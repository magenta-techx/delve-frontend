'use client';

import Link from 'next/link';

import { Formik, Form } from 'formik';

import AuthFormheader from '../AuthFormheader';
import { loginSchema } from '@/schemas/authSchema';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { emailValidator } from '@/utils/validators';
import CancleIcon from '@/assets/icons/CancelIcon';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { showToastNotification } from '@/components/notifications/ToastNotification';
import KeyIcon from '@/assets/icons/auth/KeyIcon';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setBusinessData } from '@/redux/slices/businessSlice';

const LoginForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
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
      // console.log(res?.error);
      console.log('res: ', res?.error);
      showToastNotification(
        {
          header: 'Error',
          body: `Invalid credentials`,
        },
        <KeyIcon />
      );
    } else {
      // router.push('/dashboard');
      router.push('/business/get-started');
      console.log(res);
    }
  };
  useEffect(() => {
    if (session?.user) {
      dispatch(
        setBusinessData({
          is_brand_owner: session?.user.is_brand_owner ?? undefined,
          number_of_owned_brands:
            session?.user.number_of_owned_brands ?? undefined,
          is_active: session?.user.is_active ?? undefined,
          current_plan: session?.user.current_plan ?? undefined,
          is_premium_plan_active:
            session?.user.is_premium_plan_active ?? undefined,
          userIsLoggedIn: true,
        })
      );
    }
  }, [session, dispatch]);
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
            isSubmitting={isSubmitting}
          >
            Log In{' '}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
