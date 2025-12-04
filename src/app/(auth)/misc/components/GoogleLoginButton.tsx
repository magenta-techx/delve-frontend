'use client';

import { Button } from '@/components/ui/Button';
import GoogleIcon from '@/assets/icons/thirdParty/GoogleIcon';
import { useGoogleLogin } from '../api';
import { useEffect, useRef } from 'react';
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
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme?: string; size?: string; type?: string }
          ) => void;
        };
      };
    };
  }
}

const GoogleLoginButton = (): JSX.Element => {
  const router = useRouter();
  const googleLoginMutation = useGoogleLogin();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = async (response: { credential: string }) => {
    console.log('Google credential received, length:', response.credential?.length);
    try {
      await googleLoginMutation.mutateAsync(response.credential);
      
      // Check for redirect URL
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      toast.error('Error', { description: message });
      console.error('Google login error:', err);
    }
  };

  useEffect(() => {
    const clientId = process.env['NEXT_PUBLIC_GOOGLE_CLIENT_ID'];
    if (!clientId) {
      console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
      return;
    }

    const loadGoogleScript = () => {
      if (document.getElementById('google-gsi-script')) {
        // Script already exists, wait for it to load
        const checkInterval = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(checkInterval);
            initGoogle();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => clearInterval(checkInterval), 5000);
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Wait a bit for the SDK to fully initialize
        setTimeout(initGoogle, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services script');
      };
      document.head.appendChild(script);
    };

    const initGoogle = () => {
      if (!window.google?.accounts?.id || !containerRef.current) {
        console.error('Google SDK not ready or container not available');
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        // Render as one_tap button type
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
        });
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
      }
    };

    // Check if already loaded
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      loadGoogleScript();
    }
  }, []);

  const handleClick = () => {
    // Trigger the hidden Google button
    const googleBtn = containerRef.current?.querySelector('div[role="button"]') as HTMLElement;
    if (googleBtn) {
      googleBtn.click();
    }
  };

  return (
    <>
      <div ref={containerRef} style={{ display: 'none' }} />
      <Button
        ref={buttonRef}
        className='w-full'
        variant='neutral'
        size='lg'
        icon={<GoogleIcon />}
        isLoading={googleLoginMutation.isPending}
        onClick={handleClick}
      >
        Sign in with Google
      </Button>
    </>
  );
};

export default GoogleLoginButton;
