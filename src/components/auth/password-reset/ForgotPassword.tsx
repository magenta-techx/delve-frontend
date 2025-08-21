'use client';

import { Formik, Form } from 'formik';

import AuthFormheader from '../AuthFormheader';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { emailValidator } from '@/utils/validators';
import CancleIcon from '@/assets/icons/CancelIcon';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema } from '@/schemas/authSchema';
import FingerPrintIcon from '@/assets/icons/auth/FingerPrintIcon';

const ForgotPassword = (): JSX.Element => {
  const navigate = useRouter();
  const handleSendOtp = async (values: { email: string }): Promise<void> => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      // toast : {"status":true,"message":"Reset code sent to your email"}
      navigate.push(
        `/auth/password-reset/otp?email=${encodeURIComponent(values.email)}`
      );
    } else {
      const data = await res.json();
      alert(data.error || 'Forgot password failed');
    }
  };
  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={forgotPasswordSchema}
      onSubmit={handleSendOtp}
    >
      {({ errors }) => (
        <Form className='w-full sm:w-2/5'>
          {/* Header */}
          <AuthFormheader
            header={'Forgot password?'}
            subheader={'Enter your email address to continue'}
            icon={<FingerPrintIcon />}
            showMobileSubHeader={true}
          />

          {/* Fields */}
          <div className='mb-10 flex w-full flex-col gap-5'>
            {/* Email Field */}
            <Input
              name='email'
              type='email'
              placeholder='Enter Email'
              label=''
              icon={<CancleIcon />}
              validate={emailValidator}
            />
          </div>

          {/* Submit Button */}

          <Button type='submit' disabled={errors?.email ? true : false}>
            Send 4-digit code
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPassword;
