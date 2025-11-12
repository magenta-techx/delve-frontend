import { is401Error, handle401Redirect } from './apiHandler';

interface FetchWrapperOptions extends RequestInit {
  skipAuthRedirect?: boolean; // Allow skipping 401 handling for specific cases
}

/**
 * Enhanced fetch wrapper that automatically handles 401 errors
 * by redirecting to login and showing appropriate error messages
 */
export async function authAwareFetch(
  url: string, 
  options: FetchWrapperOptions = {}
): Promise<Response> {
  const { skipAuthRedirect = false, ...fetchOptions } = options;
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Check for 401 errors and handle them
    if (!skipAuthRedirect && response.status === 401) {
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
        // Return the response for callers who want to handle it too
        return response;
      }
    }
    
    return response;
  } catch (error) {
    // Re-throw network errors
    throw error;
  }
}
