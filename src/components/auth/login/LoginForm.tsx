'use client';

import Link from 'next/link';

import { Formik, Form } from 'formik';

import AuthFormheader from '../AuthFormheader';
import { loginSchema } from '@/schemas/authSchema';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { emailValidator } from '@/utils/validators';
import CancleIcon from '@/assets/icons/CancelIcon';

const LoginForm = (): JSX.Element => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={values => {
        console.warn(values);
      }}
    >
      {({ errors }) => (
        <Form className='w-full'>
          {/* Header */}
          <AuthFormheader
            header={'  Welcome Back!'}
            subheader={'Your events. Your vendors. Your space to collaborate.'}
          />

          {/* Fields */}
          <div className='mb-2 flex w-full flex-col gap-5'>
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
          <div className='mb-5 flex justify-end'>
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
            disabled={errors?.email || errors?.password ? true : false}
          >
            Log In
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
