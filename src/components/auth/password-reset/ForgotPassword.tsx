'use client';

import AuthFormheader from '../../../app/(auth)/misc/components/AuthFormheader';
import { Button } from '@/components/ui/Button';
import CancleIcon from '@/assets/icons/CancelIcon';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/schemas/authSchema';
import FingerPrintIcon from '@/assets/icons/auth/FingerPrintIcon';
import KeyIcon from '@/assets/icons/auth/KeyIcon';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { useForgotPassword } from '@/app/(auth)/misc/api';
import { toast } from 'sonner';

const ForgotPassword = (): JSX.Element => {
  const navigate = useRouter();
  const methods = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const { handleSubmit, formState: { isSubmitting, isValid } } = methods;

  const forgotPasswordMutation = useForgotPassword();

  const handleSendOtp = async (values: ForgotPasswordInput): Promise<void> => {
    try {
      const result = await forgotPasswordMutation.mutateAsync(values);
      toast.success(`${result.message ?? 'Reset code sent to your email'} - ${values.email}`, {
        icon: <KeyIcon />,
      });
    
      navigate.push(
        `/auth/password-reset/otp?email=${encodeURIComponent(values.email)}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Forgot password failed';
      toast.error('Failed to send reset code.', {
        icon: <KeyIcon />,
        description: message,
      });
    }
  };
  return (
    <FormProvider {...methods}>
      <form className='w-full' onSubmit={handleSubmit(handleSendOtp)}>
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
              type='email'
              placeholder='Enter Email'
              rightIcon={<CancleIcon />}
              haserror={Boolean(methods.formState.errors.email)}
              errormessage={methods.formState.errors.email?.message as string | undefined}
              {...methods.register('email')}
            />
          </div>

          {/* Submit Button */}

          <Button type='submit' disabled={!isValid || isSubmitting} isLoading={isSubmitting || forgotPasswordMutation.isPending}>
            Send 4-digit code
          </Button>
      </form>
    </FormProvider>
  );
};

export default ForgotPassword;
