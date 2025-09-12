'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
import { useSession } from 'next-auth/react';

interface AuthFormButtonProps {
  text: string;
  icon: ReactNode;
  className: string;
  variant: ButtonProps['variant'];
  onClick: () => void;
}

const AuthForms = (): JSX.Element => {
  const router = useSearchParams();
  const redirect = useRouter();
  const { data: session } = useSession();

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
    if (session?.user.accessToken) {
      redirect.push('/dashboard');
    }
    if (router.get('login') === 'false') {
      setLogin(false);
    }
  }, [router, redirect, session]);
  return (
    <section className='flex w-full items-center justify-center py-10 sm:py-0'>
      <div className='flex w-full sm:w-[1400px]'>
        <div className='flex max-h-80 w-full flex-col items-center bg-white sm:w-[40%] sm:pl-40'>
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

          <div className='w-full pb-20 sm:w-[425px]'>
            <AuthSocialLoginButtons />
          </div>
        </div>
        <div className='fixed right-20 hidden w-[40%] sm:flex'>
          <AuthFormCarousel />
        </div>
      </div>
    </section>
  );
};

export default AuthForms;
