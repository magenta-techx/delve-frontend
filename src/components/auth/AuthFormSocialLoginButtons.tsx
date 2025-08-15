import { signIn } from 'next-auth/react';
import { Button } from '../ui/Button';
import FacebookIcon from '@/assets/icons/thirdParty/FacebookIcon';
import GoogleIcon from '@/assets/icons/thirdParty/GoogleIcon';
import AppleIcon from '@/assets/icons/thirdParty/AppleIcon';

const AuthSocialLoginButtons = (): JSX.Element => {
  const SOCIAL_BUTTONS = [
    {
      title: 'facebook',
      icon: <FacebookIcon />,
    },
    {
      title: 'google',
      icon: <GoogleIcon />,
    },
    {
      title: 'apple',
      icon: <AppleIcon />,
    },
  ];
  return (
    <div className='w-full'>
      <div className='flex w-full flex-col gap-3'>
        {SOCIAL_BUTTONS.map((button, key) => (
          <Button
            key={key}
            variant='neutral'
            onClick={() => signIn(button.title)}
            icon={button.icon}
          >
            Sign in with {button.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AuthSocialLoginButtons;
