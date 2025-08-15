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
  const router = useRouter();
  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={forgotPasswordSchema}
      onSubmit={values => {
        console.warn(values);

        router.push(
          `/auth/password-reset/otp?email=${encodeURIComponent(values.email)}`
        );
      }}
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
          <div className='mb-5 flex w-full flex-col gap-5'>
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
