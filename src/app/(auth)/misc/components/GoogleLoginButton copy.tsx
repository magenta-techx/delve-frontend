'use client';

import { Button } from '@/components/ui/Button';
import GoogleIcon from '@/assets/icons/thirdParty/GoogleIcon';
import { useGoogleLogin } from '../api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
      };
    };
  }
}

const GoogleLoginButton = (): JSX.Element => {
  const router = useRouter();
  const googleLoginMutation = useGoogleLogin();

  useEffect(() => {
    // Load Google Identity Services script for One Tap
    const clientId = process.env['NEXT_PUBLIC_GOOGLE_CLIENT_ID'];
    if (!clientId) {
      console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
      return;
    }

    const loadGoogleScript = () => {
      if (document.getElementById('google-identity-script')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const handleGoogleSignIn = async () => {
    const clientId = process.env['NEXT_PUBLIC_GOOGLE_CLIENT_ID'];
    if (!clientId || !window.google) {
      toast.error('Google Sign-In not configured');
      return;
    }

    try {
      // Initialize the One Tap UI
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          if (response.credential) {
            try {
              await googleLoginMutation.mutateAsync(response.credential);

              // Check for redirect URL from session storage (set by 401 handler)
              const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
              if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                router.push(redirectUrl);
              } else {
                router.push('/');
              }
            } catch (err) {
              const message =
                err instanceof Error ? err.message : 'Google login failed';
              toast.error('Error', { description: message });
            }
          }
        },
      });

      // Trigger the One Tap prompt
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Failed to trigger Google Sign-In:', error);
      toast.error('Google Sign-In Error', {
        description: 'Please try again.',
      });
    }
  };

  return (
    <Button
      className='w-full'
      variant='neutral'
      size='lg'
      icon={<GoogleIcon />}
      isLoading={googleLoginMutation.isPending}
      onClick={handleGoogleSignIn}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
