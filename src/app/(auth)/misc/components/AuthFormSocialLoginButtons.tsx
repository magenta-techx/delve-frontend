import { Button } from '@/components/ui/Button';
import FacebookIcon from '@/assets/icons/thirdParty/FacebookIcon';
import AppleIcon from '@/assets/icons/thirdParty/AppleIcon';
import GoogleLoginButton from './GoogleLoginButton';
import * as React from 'react';
import { getProviders, signIn } from 'next-auth/react';

type ProviderId = 'facebook' | 'apple';
type ProviderMap = Partial<Record<ProviderId, boolean>>;

const AuthSocialLoginButtons = (): JSX.Element => {
  const [available, setAvailable] = React.useState<ProviderMap>({});
  const [loading, setLoading] = React.useState<ProviderMap>({});

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const providers = await getProviders();
        if (!mounted) return;
        const ids = Object.keys(providers ?? {}) as string[];
        const map: ProviderMap = {
          facebook: ids.includes('facebook'),
          apple: ids.includes('apple'),
        };
        setAvailable(map);
      } catch (_e) {
        setAvailable({ facebook: true });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSignIn = async (provider: ProviderId) => {
    setLoading((s) => ({ ...s, [provider]: true }));
    try {
      await signIn(provider, { callbackUrl: '/' });
      // signIn will redirect; this line is a fallback if redirect is blocked
    } finally {
      // If redirect happens, this won't run; if not, we unblock UI after a brief delay
      setTimeout(() => setLoading((s) => ({ ...s, [provider]: false })), 2000);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex w-full flex-col gap-3'>
        <GoogleLoginButton />

        {available.facebook && (
          <Button
            className='w-full'
            variant='neutral'
            size='lg'
            icon={<FacebookIcon />}
            isLoading={!!loading.facebook}
            onClick={() => handleSignIn('facebook')}
          >
            Sign in with Facebook
          </Button>
        )}
        {available.apple && (
          <Button
            className='w-full'
            variant='neutral'
            size='lg'
            icon={<AppleIcon />}
            isLoading={!!loading.apple}
            onClick={() => handleSignIn('apple')}
          >
            Sign in with Apple
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuthSocialLoginButtons;
