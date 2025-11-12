'use client';
import React from 'react';

import { useRouter } from 'next/navigation';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/schemas/authSchema';
import ArrowRightIconGrey from '@/assets/icons/business/ArrowRightIconGrey';
import ArrowRightIconBlack from '@/assets/icons/business/ArrowRightIconBlack';
import { useSession } from 'next-auth/react';
import Loader from '../ui/Loader';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authAwareFetch } from '@/utils/authAwareFetch';
import { Input } from '@/components/ui/Input';

const BusinessCommunityForm = (): JSX.Element => {
  const navigate = useRouter();
  const { data: session } = useSession();
  const methods = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: session?.user.email || '' },
    mode: 'onChange',
  });

  const { handleSubmit, formState: { isSubmitting, isValid }, watch } = methods;

  const values = watch();

  const handleFormSubmit = async (values: ForgotPasswordInput): Promise<void> => {
    try {
      const res = await authAwareFetch(`/api/user/getUser?email=${values.email}`, {
        method: 'GET',
      });

      if (res.ok) {
        if (session?.user.email != values?.email) {
          return navigate.push(`/signin`);
        }
        navigate.push('/business/introduction');
      } else {
        navigate.push(`/signup`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='flex w-full flex-col justify-center gap-3 px-5 sm:flex-row sm:px-0'>
          {/* Email Field */}
          <Input
            type='email'
            placeholder='Input your email address'
            containerClassName='text-center'
            className='sm:px-24 px-5 sm:py-4 py-3 sm:text-[15px] text-[14px] focus:border-white border-[#7B7B7B] placeholder:text-[#9AA4B2] text-white bg-[#1C1C1C80]/50 text-center'
            hasError={Boolean(methods.formState.errors.email)}
            errorMessage={methods.formState.errors.email?.message as string | undefined}
            {...methods.register('email')}
          />

          {/* Submit Button */}

          <button
            className={`flex h-full w-[60px] items-center justify-center self-end rounded-md disabled:cursor-not-allowed sm:-mt-4 sm:self-center ${!isValid || !values.email ? 'bg-[#4B5565]/50 py-[22px] disabled:cursor-not-allowed' : isSubmitting ? 'bg-gray-600 py-[20px]' : 'bg-white py-[22px]'} `}
            type='submit'
            disabled={!isValid || !values.email}
          >
            {!isValid || !values.email ? (
              <ArrowRightIconGrey />
            ) : isSubmitting ? (
              <Loader />
            ) : (
              <ArrowRightIconBlack />
            )}
          </button>
      </form>
    </FormProvider>
  );
};
export default BusinessCommunityForm;
