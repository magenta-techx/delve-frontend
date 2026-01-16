import { toast } from 'sonner';
import { getSession, signOut } from 'next-auth/react';

export interface ApiErrorResponse {
  error: string;
  data?: {
    detail?: string;
    code?: string;
    messages?: Array<{
      token_class?: string;
      token_type?: string;
      message?: string;
    }>;
  };
}

// Queue for pending requests that failed with 401
interface PendingRequest {
  url: string;
  options: RequestInit;
  token?: string | undefined;
  requestOpts?: { skipAuthRedirect?: boolean } | undefined;
  resolve: (value: Response) => void;
  reject: (reason?: unknown) => void;
}

let pendingRequests: PendingRequest[] = [];
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// Check if response is a 401 unauthorized error
export function is401Error(response: Response, data?: unknown): boolean {
  if (response.status === 401) {
    return true;
  }
  
  // Check for token_not_valid errors in response data
  if (
    typeof data === 'object' && 
    data !== null && 
    'data' in data &&
    typeof data.data === 'object' &&
    data.data !== null &&
    'code' in data.data &&
    data.data.code === 'token_not_valid'
  ) {
    return true;
  }
  
  return false;
}

// Attempt to refresh the access token using the refresh token
async function attemptTokenRefresh(): Promise<boolean> {
  // If a refresh is already in progress, wait for it and return that result
  if (isRefreshing && refreshPromise) {
    console.log('Token refresh already in progress, waiting...');
    return refreshPromise;
  }

  isRefreshing = true;
  
  refreshPromise = (async () => {
    try {
      const session = await getSession();
      
      if (!session?.user?.refreshToken) {
        console.log('No refresh token available');
        return false;
      }

      console.log('Attempting to refresh access token via NextAuth...');
      
      // Trigger NextAuth's JWT callback by calling the session endpoint with cache bypass
      // This will cause NextAuth to check token expiration and refresh if needed
      const res = await fetch(`${process.env['NEXT_PUBLIC_API_BASE_URL'] || ''}/api/auth/session`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store', // Force a fresh session check
      });

      if (!res.ok) {
        console.log('Failed to fetch session endpoint');
        return false;
      }

      const newSession = await res.json();
      
      // Check if the session has an error (refresh failed)
      if (newSession?.user?.error === 'RefreshAccessTokenError') {
        console.log('Token refresh failed - refresh token invalid or expired');
        return false;
      }

      // Verify we got a new access token
      if (!newSession?.user?.accessToken) {
        console.log('No access token in refreshed session');
        return false;
      }

      console.log('Token refreshed successfully via NextAuth');
      return true;
    } catch (error) {
      console.error('Error during token refresh:', error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  
  return refreshPromise;
}

// Retry all pending requests after token refresh succeeds
async function retryPendingRequests(): Promise<void> {
  console.log(`Retrying ${pendingRequests.length} pending requests...`);
  
  const requests = [...pendingRequests];
  pendingRequests = []; // Clear the queue
  
  // Get the new session with the refreshed token
  const newSession = await getSession();
  const newToken = newSession?.user?.accessToken;
  
  if (!newToken) {
    console.error('No new access token available for retry');
    requests.forEach((req) => {
      req.reject(new Error('No access token available after refresh'));
    });
    return;
  }
  
  console.log('Using new access token for retries');
  
  requests.forEach((req) => {
    console.log(`Retrying request to ${req.url}`);
    // Make the request again with the NEW token from the refreshed session
    apiRequest(req.url, req.options, newToken, req.requestOpts)
      .then(req.resolve)
      .catch(req.reject);
  });
}

export async function handle401Redirect(): Promise<void> {
  // Debounce repeated redirects: if we've redirected within the last 5s, do nothing.
  const last = Number(sessionStorage.getItem('lastAuthRedirect') ?? '0');
  const now = Date.now();
  if (now - last < 5000) return;
  
  sessionStorage.setItem('lastAuthRedirect', String(now));
  
  // Check if we have a refresh token before attempting refresh
  const session = await getSession();
  
  if (!session?.user?.refreshToken) {
    console.log('No refresh token available, redirecting to signin');
    // No refresh token, proceed with redirect immediately
    toast.error('Session Expired', {
      description: 'Your session has expired. Please log in again.',
    });

    // Clear any pending requests as they can't be retried
    pendingRequests = [];

    setTimeout(async () => {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/signin') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }

      // Sign out and redirect to signin
      await signOut({ redirect: false });
      window.location.href = '/signin';
    }, 1500);
    return;
  }
  
  // Try to refresh the token
  console.log('401 error detected, attempting token refresh...');
  const refreshed = await attemptTokenRefresh();
  
  if (refreshed) {
    console.log('Token refreshed successfully, retrying pending requests');
    toast.success('Session refreshed', {
      description: 'Your session has been restored.',
    });
    // Clear the debounce so future 401s can try again
    sessionStorage.removeItem('lastAuthRedirect');
    
    // Retry all pending requests instead of reloading the page
    await retryPendingRequests();
    return;
  }

  // If refresh failed, proceed with redirect
  console.log('Token refresh failed, redirecting to signin');
  toast.error('Session Expired', {
    description: 'Your session has expired. Please log in again.',
  });

  // Clear any pending requests as they can't be retried
  pendingRequests = [];

  setTimeout(async () => {
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/signin') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }

    // Sign out and redirect to signin
    await signOut({ redirect: false });
    window.location.href = '/signin';
  }, 1500);
}

export async function apiRequest(
  url: string,
  options: RequestInit = {},
  token?: string, // optional bearer token to attach
  requestOpts?: { skipAuthRedirect?: boolean } // allow skipping automatic 401 redirect
): Promise<Response> {
  // send cookies by default so app routes can read NextAuth session cookie
  const mergedOptions: RequestInit = {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.headers ?? {}),
    },
  };

  const headers = new Headers(mergedOptions.headers as HeadersInit);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  mergedOptions.headers = headers;

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    let data: unknown;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.clone().json();
      }
    } catch {
      // Ignore JSON parsing errors
    }

    if (is401Error(response, data)) {
      if (!requestOpts?.skipAuthRedirect) {
        // If a refresh is already in progress, queue this request to retry later
        if (isRefreshing) {
          console.log('Refresh in progress, queueing request for retry:', url);
          return new Promise((resolve, reject) => {
            pendingRequests.push({
              url,
              options,
              token,
              requestOpts,
              resolve,
              reject,
            });
          });
        }
        
        // Otherwise, start the refresh process and queue this request
        console.log('401 error, starting refresh and queueing request:', url);
        handle401Redirect(); // This won't await, it runs in background
        
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            url,
            options,
            token,
            requestOpts,
            resolve,
            reject,
          });
        });
      }
      // If skipping redirect, just return the response so callers can handle it
    }
  }

  return response;
}

