'use client';

import { Formik, Form } from 'formik';

import AuthFormheader from '../AuthFormheader';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { createPasswordSchema } from '@/schemas/authSchema';
import LockIcon from '@/assets/icons/auth/LockIcon';

const CreateNewPassword = (): JSX.Element => {
  const router = useRouter();
  return (
    <Formik
      initialValues={{ password: '', confirm_password: '' }}
      validationSchema={createPasswordSchema}
      onSubmit={values => {
        console.warn(values);

        router.push(`/auth/signin-signup`);
      }}
    >
      {({ errors }) => (
        <Form className='w-full sm:w-2/5'>
          {/* Header */}
          <AuthFormheader
            header={'Create new password'}
            subheader={'Create a password with at least 10 characters'}
            icon={<LockIcon />}
            showMobileSubHeader={true}
          />

          {/* Fields */}
          <div className='mb-5 flex w-full flex-col gap-5'>
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
          >
            Change password
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateNewPassword;
