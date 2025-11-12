'use client';

import AuthFormheader from './AuthFormheader';
import { signupSchema, type SignupInput } from '@/schemas/authSchema';

import { Button } from '@/components/ui/Button';
import CancleIcon from '@/assets/icons/CancelIcon';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { useRegister } from '@/app/(auth)/misc/api';

const SignUpForm = (): JSX.Element => {
  const router = useRouter();
  const methods = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onChange',
  });

  const registerMutation = useRegister();

  // Signup Handler
  const handleSignup = async (values: SignupInput): Promise<void> => {
    try {
      await registerMutation.mutateAsync(values);
      window.location.reload();
      router.push('/signin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      alert(message);
    }
  };

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form className='w-full' onSubmit={handleSubmit(handleSignup)}>
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
              type='text'
              placeholder='Enter first name'
              label='First name'
              containerClassName='w-full'
              hasError={Boolean(methods.formState.errors.first_name)}
              errorMessage={
                methods.formState.errors.first_name?.message as
                  | string
                  | undefined
              }
              {...methods.register('first_name')}
            />

            {/* last name  */}
            <Input
              type='text'
              placeholder='Enter last name'
              label='Last name'
              containerClassName='w-full'
              hasError={Boolean(methods.formState.errors.last_name)}
              errorMessage={
                methods.formState.errors.last_name?.message as
                  | string
                  | undefined
              }
              {...methods.register('last_name')}
            />
          </div>
          {/* Email Field */}
          <Input
            type='email'
            placeholder='Enter Email'
            label='Email address'
            rightIcon={<CancleIcon />}
            hasError={Boolean(methods.formState.errors.email)}
            errorMessage={
              methods.formState.errors.email?.message as string | undefined
            }
            {...methods.register('email')}
          />

          {/* Password Field */}
          <Input
            type='password'
            placeholder='Enter password'
            label='Enter password'
            hasError={Boolean(methods.formState.errors.password)}
            errorMessage={
              methods.formState.errors.password?.message as string | undefined
            }
            {...methods.register('password')}
          />
          {/* Confirm Password Field */}
          <Input
            type='password'
            placeholder='Confirm password'
            label='Confirm password'
            hasError={Boolean(methods.formState.errors.confirm_password)}
            errorMessage={
              methods.formState.errors.confirm_password?.message as
                | string
                | undefined
            }
            {...methods.register('confirm_password')}
          />
        </div>

        {/* Submit Button */}
        <Button
          className='w-full'
          size='lg'
          type='submit'
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting || registerMutation.isPending}
        >
          Sign Up
        </Button>
      </form>
    </FormProvider>
  );
};

export default SignUpForm;
