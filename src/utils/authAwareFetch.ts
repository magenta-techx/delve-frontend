import { is401Error, handle401Redirect, apiRequest } from './apiHandler';

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
    // Pass skipAuthRedirect through to apiRequest so it doesn't auto-redirect.
    const response = await apiRequest(url, fetchOptions as RequestInit, undefined, {
      skipAuthRedirect,
    });

    // If caller asked to skip redirect, just return the response and let them handle 401.
    if (skipAuthRedirect) return response;

    // Otherwise, apiRequest already handled 401 redirect and thrown; return response for non-401.
    return response;
  } catch (error) {
    // Re-throw network errors
    throw error;
  }
}
