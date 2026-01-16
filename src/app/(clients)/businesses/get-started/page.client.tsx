'use client';
import { Button, Input } from '@/components/ui';
import React, { useEffect } from 'react';
import { checkUserByEmail, useCurrentUser } from '../../misc/api';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';

const getStartedSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type GetStartedFormData = z.infer<typeof getStartedSchema>;

const GetStartedPage = () => {
  const { data: session, status } = useSession();
  const hasValidAccessToken = Boolean(
    session?.user?.accessToken && String(session.user.accessToken).length > 0
  );
  const userIsloggedIn =
    status === 'authenticated' && Boolean(session?.user) && hasValidAccessToken;

  const { data } = useCurrentUser(userIsloggedIn);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GetStartedFormData>({
    resolver: zodResolver(getStartedSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (data?.user?.email) {
      setValue('email', data.user.email);
    }
  }, [data?.user?.email, setValue]);

  const { mutate, isPending } = checkUserByEmail();
  const router = useRouter();
  const onSubmit = (formData: GetStartedFormData) => {
    mutate(formData.email, {
      onSuccess: (response: any) => {
        if (response.status) {
          router.push(`/businesses/create-listing`);
        } else {
          router.push(`/sign-up?email=${encodeURIComponent(formData.email)}`);
        }
      },
    });
  };

  return (
    <div
      className='relative flex h-screen w-screen flex-col items-center justify-center'
      style={{
        backgroundImage: 'url(/business-landing-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='absolute inset-0 bg-[#000000B2]' />

      <div className='z-10 mx-auto flex w-[90%] max-w-2xl flex-col text-center text-white'>
        <h1 className='font-karma text-xl font-medium lg:text-3xl'>
          Join the Community of Trusted Vendors on Delve
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mx-auto mt-6 flex w-full max-w-xl flex-col gap-4 sm:flex-row'
        >
          <Input
            {...register('email')}
            className='h-14 bg-[#1C1C1C80] text-sm'
            placeholder='Enter your email'
            containerClassName='flex-1'
          />
          {errors.email?.message && (
            <span className='mt-1 text-xs text-red-500'>
              {errors.email.message}
            </span>
          )}
          <Button
            type='submit'
            className='flex size-14 items-center justify-center'
            variant='white'
          >
            {isPending ? (
              <Loader borderColor='border-[#9AA4B2]'  />
            ) : (
              <svg
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M2 9H16M16 9L9 2M16 9L9 16'
                  stroke='#9AA4B2'
                  strokeWidth='4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GetStartedPage;
