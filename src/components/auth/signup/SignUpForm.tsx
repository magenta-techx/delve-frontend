'use client';

import { Formik, Form } from 'formik';
import AuthFormheader from '../AuthFormheader';
import { emailValidator } from '@/utils/validators';
import Input from '@/components/ui/Input';
import { signupSchema } from '@/schemas/authSchema';

import { Button } from '@/components/ui/Button';
import CancleIcon from '@/assets/icons/CancelIcon';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const SignUpForm = (): JSX.Element => {
  const router = useRouter();
  // Signup Handler
  const handleSignup = async (values: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
  }): Promise<void> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      router.push('/dashboard');
    } else {
      const data = await res.json();
      alert(data.error || 'Signup failed');
    }
  };

  return (
    <Formik
      initialValues={{
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
      }}
      validationSchema={signupSchema}
      onSubmit={handleSignup}
    >
      {({ errors, isSubmitting }) => (
        <Form className='w-full'>
          {/* Header */}
          <AuthFormheader
            header={'Create Your Free Account'}
            subheader={' Sign up to start exploring trusted vendors on Delve.'}
          />

          {/* Fields */}
          <div className='mb-5 flex w-full flex-col gap-2'>
            {/* First name and last name  */}

            <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
              {/* first name  */}
              <Input
                name='first_name'
                type='text'
                placeholder='Enter first name'
                label='First name'
                className='w-full'
              />

              {/* last name  */}
              <Input
                name='last_name'
                type='text'
                placeholder='Enter last name'
                label='Last name'
                className='w-full'
              />
            </div>
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
            {/* Confirm Password Field */}
            <Input
              name='confirm_password'
              type='password'
              placeholder='Confirm password'
              label='Confirm password'
            />
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={
              errors?.email || errors?.password || errors?.confirm_password
                ? true
                : false
            }
            isSubmitting={isSubmitting}
          >
            Log In
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
