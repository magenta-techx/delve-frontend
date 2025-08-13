'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8'>
      <div className='text-center'>
        <h1 className='mb-4 text-4xl font-bold text-destructive'>
          Something went wrong!
        </h1>
        <p className='mb-8 text-muted-foreground'>
          An unexpected error occurred. Please try again.
        </p>
        <div className='space-x-4'>
          <Button onClick={reset}>
            Try again
          </Button>
          <Button variant='outline' onClick={() => window.location.href = '/'}>
            Go home
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className='mt-8 text-left'>
            <summary className='cursor-pointer text-sm text-muted-foreground'>
              Error details (development only)
            </summary>
            <pre className='mt-4 overflow-auto rounded bg-muted p-4 text-xs'>
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
