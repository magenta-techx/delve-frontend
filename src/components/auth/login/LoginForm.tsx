'use client';

import Link from 'next/link';

import { Formik, Form } from 'formik';

import AuthFormheader from '../AuthFormheader';
import { loginSchema } from '@/schemas/authSchema';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { emailValidator } from '@/utils/validators';
import CancleIcon from '@/assets/icons/CancelIcon';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginForm = (): JSX.Element => {
  const router = useRouter();
  // Login Handler
  const handleLogin = async (values: {
    email: string;
    password: string;
  }): Promise<void> => {
    const res = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      alert(res?.error);
    } else {
      router.push('/dashboard');
    }
  };
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={handleLogin}
    >
      {({ errors, isSubmitting }) => (
        <Form className='w-full'>
          {/* Header */}
          <AuthFormheader
            header={'  Welcome Back!'}
            subheader={'Your events. Your vendors. Your space to collaborate.'}
          />

          {/* Fields */}
          <div className='mb-2 flex w-full flex-col gap-3'>
            {/* Email Field */}
            <Input
              name='email'
              type='email'
              placeholder='Enter Email'
              label='Email address'
              icon={<CancleIcon />}
              validate={emailValidator}
            />

            {/* Password Field */}
            <Input
              name='password'
              type='password'
              placeholder='Enter password'
              label='Enter password'
            />
          </div>

          {/* Forgot password */}
          <div className='-mt-3 mb-5 flex justify-end'>
            <Link
              href='/auth/password-reset/forgot-password'
              className='text-sm text-gray-600 hover:underline'
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}

          <Button
            type='submit'
            disabled={
              errors?.email || errors?.password || isSubmitting ? true : false
            }
          >
            Log In{' '}
            {isSubmitting && (
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
            )}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
