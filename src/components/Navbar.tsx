'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AuthFormButton from './auth/AuthFormButton';
import Logo from './ui/Logo';
import DefaultLogoTextIcon from '@/assets/icons/logo/DefaultLogoTextIcon';
import LoginIcon from '@/assets/icons/auth/LoginIcon';
import SignUpIcon from '@/assets/icons/auth/SignUpIcon';

interface AuthFormButtonProps {
  text: string;
  icon: ReactNode;
  onClick: () => void;
}

const Navbar = (): JSX.Element => {
  const router = useRouter();
  const handleAuthRouter = (login: string = 'true'): void => {
    router.push(`/auth/signin-signup?login=${login}`);
  };

  const AUTH_FORM_BUTTONS: AuthFormButtonProps[] = [
    {
      text: 'log in',
      icon: <LoginIcon />,
      onClick: () => handleAuthRouter('true'),
    },
    {
      text: 'sign up',
      icon: <SignUpIcon />,
      onClick: () => handleAuthRouter('false'),
    },
  ];

  return (
    <div className='flex items-center justify-between'>
      <Logo icon={<DefaultLogoTextIcon />} link='/' />
      <div className='flex w-[250px] rounded-xl border border-neutral-100 bg-neutral p-[2px] text-sm'>
        {AUTH_FORM_BUTTONS.map((button, key) => (
          <AuthFormButton
            key={key}
            text={button.text}
            icon={button.icon}
            onClick={button.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Navbar;
