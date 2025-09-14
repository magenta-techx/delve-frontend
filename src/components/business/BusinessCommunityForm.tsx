'use client';
import React from 'react';

import { useRouter } from 'next/navigation';
import { Form, Formik } from 'formik';
import { forgotPasswordSchema } from '@/schemas/authSchema';
import Input from '../ui/Input';
import { emailValidator } from '@/utils/validators';
import ArrowRightIconGrey from '@/assets/icons/business/ArrowRightIconGrey';
import ArrowRightIconBlack from '@/assets/icons/business/ArrowRightIconBlack';
import { useSession } from 'next-auth/react';
// import { Button } from '@radix-ui/themes';

const BusinessCommunityForm = (): JSX.Element => {
  const navigate = useRouter();
  const { data: session } = useSession();
  const handleFormSubmit = async (values: { email: string }): Promise<void> => {
    if (session?.user.email != values?.email) {
      return alert("Current logged in user email don't match email inserted");
    }

    try {
      const res = await fetch('/api/user/getUser', {
        method: 'GET',
      });

      if (res.ok) {
        navigate.push('/business/introduction');
      } else {
        navigate.push(`/auth/signin-signup?login=false`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Formik
      initialValues={{ email: session?.user.email || '' }}
      validationSchema={forgotPasswordSchema}
      onSubmit={handleFormSubmit}
    >
      {({ errors, values }) => (
        <Form className='flex w-full flex-col justify-center gap-3 px-5 sm:flex-row sm:px-0'>
          {/* Email Field */}
          <Input
            name='email'
            type='email'
            placeholder='Input your email address'
            label=''
            validate={emailValidator}
            className='text-center'
            inputClass='sm:px-24 px-5 sm:py-4 py-3 sm:text-[15px] text-[14px] focus:border-white border-[#7B7B7B] placeholder:text-[#9AA4B2] text-white bg-[#1C1C1C80]/50 text-center'
          />

          {/* Submit Button */}

          <button
            className={`flex h-full w-[60px] items-center justify-center self-end rounded-md disabled:cursor-not-allowed sm:-mt-4 sm:self-center ${errors?.email || values.email.length === 0 ? 'disabled- bg-[#4B5565]/50' : 'bg-white'} py-[22px]`}
            type='submit'
            disabled={errors?.email || values.email.length === 0 ? true : false}
          >
            {errors?.email || values.email.length === 0 ? (
              <ArrowRightIconGrey />
            ) : (
              <ArrowRightIconBlack />
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};
export default BusinessCommunityForm;
