import { Button } from '@/components/ui/Button';
import FacebookIcon from '@/assets/icons/thirdParty/FacebookIcon';
import GoogleIcon from '@/assets/icons/thirdParty/GoogleIcon';
import AppleIcon from '@/assets/icons/thirdParty/AppleIcon';
import * as React from 'react';
import { getProviders, signIn } from 'next-auth/react';

type ProviderId = 'google' | 'facebook' | 'apple';
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
          google: ids.includes('google'),
          facebook: ids.includes('facebook'),
          apple: ids.includes('apple'),
        };
        setAvailable(map);
      } catch (_e) {
        setAvailable({ google: true, facebook: true });
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
      {/* Optional info when no providers are configured */}
      {!available.google && !available.facebook && !available.apple && (
        <div className='mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800'>
          Social login is not configured for this environment.
        </div>
      )}
      <div className='flex w-full flex-col gap-3'>
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
        {available.google && (
          <Button
            className='w-full'
            variant='neutral'
            size='lg'
            icon={<GoogleIcon />}
            isLoading={!!loading.google}
            onClick={() => handleSignIn('google')}
          >
            Sign in with Google
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
