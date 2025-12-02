'use client';

import Link from 'next/link';

import AuthFormheader from './AuthFormheader';
import { loginSchema, type LoginInput } from '@/schemas/authSchema';
import { Button, Input } from '@/components/ui';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/app/(auth)/misc/api';
import { toast } from 'sonner';

const LoginForm = (): JSX.Element => {
  const { data: _session } = useSession();
  const router = useRouter();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const loginMutation = useLogin();

  const onSubmit = async (values: LoginInput): Promise<void> => {
    try {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      
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
        err instanceof Error ? err.message : 'Invalid credentials';
        toast.error('Error', { description: message });
    }
  };

  return (
    <FormProvider {...methods}>
      <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
        <AuthFormheader
          header={'  Welcome Back!'}
          subheader={'Your events. Your vendors. Your space to collaborate.'}
        />

        {/* Fields */}
        <div className='mb-2 flex w-full flex-col gap-3 xl:gap-5'>
          {/* Email Field */}
          <Input
            type='email'
            placeholder='Enter Email'
            label='Email address'
            haserror={Boolean(methods.formState.errors.email)}
            errormessage={
              methods.formState.errors.email?.message as string | undefined
            }
            {...methods.register('email')}
          />

          {/* Password Field */}
          <Input
            type='password'
            placeholder='Enter password'
            label='Enter password'
            haserror={Boolean(methods.formState.errors.password)}
            errormessage={
              methods.formState.errors.password?.message as string | undefined
            }
            {...methods.register('password')}
          />
        </div>

        {/* Forgot password */}
        <div className='mt-3 mb-5 flex justify-end'>
          <Link
            href='/password-reset/forgot-password'
            className='text-sm text-gray-600 hover:underline'
          >
            Forgot password?
          </Link>
        </div>

        <Button
          className='w-full'
          size='lg'
          type='submit'
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting || loginMutation.isPending}
        >
          Log In
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
