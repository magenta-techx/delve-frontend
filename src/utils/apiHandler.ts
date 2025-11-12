import { toast } from 'sonner';

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

export function handle401Redirect(): void {
  toast.error('Session Expired', {
    description: 'Your session has expired. Please log in again.',
  });
  
  setTimeout(() => {
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/signin') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    window.location.href = '/signin';
  }, 1500);
}

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, options);
  
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
      handle401Redirect();
      throw new Error('Unauthorized - redirecting to login');
    }
  }
  
  return response;
}

