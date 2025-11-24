'use client';

import AuthFormheader from '../../../app/(auth)/misc/components/AuthFormheader';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPasswordSchema, type CreatePasswordInput } from '@/schemas/authSchema';
import LockIcon from '@/assets/icons/auth/LockIcon';
import { useEffect, useState } from 'react';
import KeyIcon from '@/assets/icons/auth/KeyIcon';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { useResetPassword } from '@/app/(auth)/misc/api';
import { toast } from 'sonner';

const CreateNewPassword = (): JSX.Element => {
  const navigate = useRouter();
  const urlParams = useSearchParams();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');

  const methods = useForm<CreatePasswordInput>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: { password: '', confirm_password: '' },
    mode: 'onChange',
  });

  const { handleSubmit, formState: { isSubmitting, isValid } } = methods;

  const resetPasswordMutation = useResetPassword();

  const handleNewpasswordSubmit = async (values: CreatePasswordInput): Promise<void> => {
    try {
      await resetPasswordMutation.mutateAsync({ ...values, email, otp });
      toast.success('Password successfully changed', {
        icon: <KeyIcon />
      });
      navigate.push(`/signin`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Incorrect OTP';
      alert(message);
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
    <FormProvider {...methods}>
      <form className='w-full' onSubmit={handleSubmit(handleNewpasswordSubmit)}>
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
              type='password'
              placeholder='New password'
              haserror={Boolean(methods.formState.errors.password)}
              errormessage={methods.formState.errors.password?.message as string | undefined}
              {...methods.register('password')}
            />
            {/*Confirm Password Field */}
            <Input
              type='password'
              placeholder='Confirm password'
              haserror={Boolean(methods.formState.errors.confirm_password)}
              errormessage={methods.formState.errors.confirm_password?.message as string | undefined}
              {...methods.register('confirm_password')}
            />
          </div>

          {/* Submit Button */}

          <Button type='submit' disabled={!isValid || isSubmitting} isLoading={isSubmitting || resetPasswordMutation.isPending}>
            Change password
          </Button>
      </form>
    </FormProvider>
  );
};

export default CreateNewPassword;
