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
import Spinner from '../ui/spinner';
// import { Button } from '@radix-ui/themes';

const BusinessCommunityForm = (): JSX.Element => {
  const navigate = useRouter();
  const { data: session } = useSession();
  const handleFormSubmit = async (values: { email: string }): Promise<void> => {
    try {
      const res = await fetch(`/api/user/getUser?email=${values.email}`, {
        method: 'GET',
      });

      if (res.ok) {
        if (session?.user.email != values?.email) {
          return navigate.push(`/auth/signin-signup`);
        }
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
      {({ errors, values, isSubmitting }) => (
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
            className={`flex h-full w-[60px] items-center justify-center self-end rounded-md disabled:cursor-not-allowed sm:-mt-4 sm:self-center ${errors?.email || values.email.length === 0 ? 'bg-[#4B5565]/50 py-[22px] disabled:cursor-not-allowed' : isSubmitting ? 'bg-gray-600 py-[20px]' : 'bg-white py-[22px]'} `}
            type='submit'
            disabled={errors?.email || values.email.length === 0 ? true : false}
          >
            {errors?.email || values.email.length === 0 ? (
              <ArrowRightIconGrey />
            ) : isSubmitting ? (
              <Spinner borderColor='border-gray-600' />
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
