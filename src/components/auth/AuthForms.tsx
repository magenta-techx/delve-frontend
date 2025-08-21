'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Logo from '@/components/ui/Logo';

import AuthFormCarousel from './AuthFormCarousel';
import LoginForm from './login/LoginForm';
import SignUpForm from './signup/SignUpForm';
import AuthSocialLoginButtons from './AuthFormSocialLoginButtons';
import AuthFormButton from './AuthFormButton';
import type { ButtonProps } from '../ui/Button';
import DefaultLogoIcon from '@/assets/icons/logo/DefaultLogoIcon';
import LoginIcon from '@/assets/icons/auth/LoginIcon';
import SignUpIcon from '@/assets/icons/auth/SignUpIcon';
// import { useSession } from 'next-auth/react';

interface AuthFormButtonProps {
  text: string;
  icon: ReactNode;
  className: string;
  variant: ButtonProps['variant'];
  onClick: () => void;
}

const AuthForms = (): JSX.Element => {
  const router = useSearchParams();
  // const { data: session } = useSession();

  // if (session) {
  //   redirect('/dashboard');
  // }

  const [login, setLogin] = useState(true);

  const AUTH_FORM_BUTTONS: AuthFormButtonProps[] = [
    {
      text: 'log in',
      icon: <LoginIcon />,
      onClick: () => setLogin(true),
      className: login ? 'bg-white border-none' : '',
      variant: !login ? 'ghost' : 'neutral',
    },
    {
      text: 'sign up',
      icon: <SignUpIcon />,
      onClick: () => setLogin(false),
      className: !login ? 'bg-white  border-none' : '',
      variant: login ? 'ghost' : 'neutral',
    },
  ];

  useEffect(() => {
    if (router.get('login') === 'false') {
      setLogin(false);
    }
  }, [router]);
  return (
    <section className='flex w-full items-center justify-center py-10 sm:py-0'>
      <div className='flex w-full sm:w-[1600px]'>
        <div className='flex max-h-80 w-full flex-col items-center bg-white sm:w-1/2'>
          <div className='mb-7'>
            <Logo icon={<DefaultLogoIcon />} link='/' />
          </div>

          <div className='mb-7 flex w-64 rounded-xl border border-neutral-100 bg-neutral p-[2px] text-sm'>
            {AUTH_FORM_BUTTONS.map((button, key) => (
              <AuthFormButton
                key={key}
                text={button.text}
                icon={button.icon}
                className={button.className}
                variant={button.variant}
                onClick={button.onClick}
              />
            ))}
          </div>

          <div className='mb-8 flex w-full flex-col items-center sm:w-[425px]'>
            {login ? <LoginForm /> : <SignUpForm />}
          </div>

          <div className='mb-8 flex items-center gap-4'>
            <div className='h-[1px] w-full bg-gray-300 sm:w-[185px]'></div>
            <div className='text-sm font-medium text-gray-600'>OR</div>
            <div className='h-[1px] w-full bg-gray-300 sm:w-[185px]'></div>
          </div>

          <div className='w-full sm:w-[425px]'>
            <AuthSocialLoginButtons />
          </div>
        </div>
        <div className='hidden w-1/2 sm:flex'>
          <AuthFormCarousel />
        </div>
      </div>
    </section>
  );
};

export default AuthForms;
