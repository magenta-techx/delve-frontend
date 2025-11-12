import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { is401Error } from '@/utils/apiHandler';

export function useAuthErrorHandler() {
  const router = useRouter();
  
  const handleAuthError = useCallback((response: Response, data?: unknown) => {
    if (is401Error(response, data)) {
      // Show user-friendly message
      toast.error('Session Expired', {
        description: 'Your session has expired. Please log in again.',
      });
      
      // Store current page for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Redirect to login page
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      
      return true; // Indicates 401 was handled
    }
    
    return false; // Not a 401 error
  }, [router]);
  
  // Helper to check and handle API response errors
  const checkAndHandleApiError = useCallback(async (response: Response): Promise<boolean> => {
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
      
      return handleAuthError(response, data);
    }
    
    return false;
  }, [handleAuthError]);
  
  // Helper for handling error objects (from React Query or catch blocks)
  const handleErrorObject = useCallback((error: unknown): boolean => {
    // Check if it's a fetch Response object
    if (error instanceof Response) {
      return handleAuthError(error);
    }
    
    // Check if it's an error with response property
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      error.response instanceof Response
    ) {
      return handleAuthError(error.response);
    }
    
    // Check if it's a structured API error
    if (
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      typeof error.data === 'object' &&
      error.data !== null &&
      'code' in error.data &&
      (error.data as Record<string, unknown>)['code'] === 'token_not_valid'
    ) {
      toast.error('Session Expired', {
        description: 'Your session has expired. Please log in again.',
      });
      
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      
      return true;
    }
    
    return false;
  }, [router, handleAuthError]);
  
  return {
    handleAuthError,
    checkAndHandleApiError,
    handleErrorObject,
  };
}