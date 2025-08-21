'use client';

import { Formik, Form } from 'formik';

import AuthFormheader from '../AuthFormheader';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPasswordSchema } from '@/schemas/authSchema';
import LockIcon from '@/assets/icons/auth/LockIcon';
import { useEffect, useState } from 'react';
import { showToastNotification } from '@/components/notifications/ToastNotification';
import KeyIcon from '@/assets/icons/auth/KeyIcon';

const CreateNewPassword = (): JSX.Element => {
  const navigate = useRouter();
  const urlParams = useSearchParams();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');

  const handleNewpasswordSubmit = async (values: {
    password: string;
    confirm_password: string;
  }): Promise<void> => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ ...values, email: email, otp: otp }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      showToastNotification(
        {
          header: 'Successfull',
          body: 'Password successfully changed',
        },
        <KeyIcon />
      );
      navigate.push(`/auth/signin-signup`);
    } else {
      const data = await res.json();
      alert(data.error || 'Incorrect OTP');
    }
  };

  useEffect(() => {
    const email = urlParams.get('email');
    const otp = urlParams.get('otp');
    if (email && otp) {
      setOtp(otp);
      setEmail(email);
    }
  }, [urlParams]);

  return (
    <Formik
      initialValues={{ password: '', confirm_password: '' }}
      validationSchema={createPasswordSchema}
      onSubmit={handleNewpasswordSubmit}
    >
      {({ errors, isSubmitting }) => (
        <Form className='w-full'>
          {/* Header */}
          <AuthFormheader
            header={'Create new password'}
            subheader={'Create a password with at least 10 characters'}
            icon={<LockIcon />}
            showMobileSubHeader={true}
          />

          {/* Fields */}
          <div className='mb-10 flex w-full flex-col gap-5'>
            {/* Password Field */}
            <Input
              name='password'
              type='password'
              placeholder='New password'
              label=''
            />
            {/*Confirm Password Field */}
            <Input
              name='confirm_password'
              type='password'
              placeholder='Confirm password'
              label=''
            />
          </div>

          {/* Submit Button */}

          <Button
            type='submit'
            disabled={
              errors?.password || errors.confirm_password ? true : false
            }
            isSubmitting={isSubmitting}
          >
            Change password
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateNewPassword;
