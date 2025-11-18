'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import AuthFormheader from '../../../app/(auth)/misc/components/AuthFormheader';
import { Button } from '@/components/ui/Button';
import EmailIcon from '@/assets/icons/auth/EmailIcon';
import '@/styles/auth.css';
import KeyIcon from '@/assets/icons/auth/KeyIcon';
import { toast } from 'sonner';

const Otp = (): JSX.Element => {
  const urlParams = useSearchParams();
  const navigate = useRouter();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOtpSubmit = async (): Promise<void> => {
    if (otp.length !== 6) return;
    setIsSubmitting(true);
    const res = await fetch('/api/auth/otp-verify', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        otp: otp,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const message = await res.json();
      toast.success('Reset code is valid.', {
        icon: <KeyIcon />,
        description: message.message,
      });
      //
    
      navigate.push(
        `/auth/password-reset/create-new-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
      );
    } else {
      const data = await res.json();
      toast.error('Invalid reset code.', {
        icon: <KeyIcon />,
        description: data.error,
      });
    
    }
    setIsSubmitting(false);
  };
  useEffect(() => {
    const emailInput = urlParams.get('email');
    if (emailInput) {
      setEmail(emailInput);
    } else {
      setEmail('');
    }
  }, [urlParams]);

  return (
    <div>
      {/* Header */}
      <AuthFormheader
        header={'Enter your code'}
        subheader={`We sent a code to ${email}`}
        icon={<EmailIcon />}
        showMobileSubHeader={true}
      />

      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        inputType='tel'
        shouldAutoFocus
        renderSeparator={null}
        renderInput={props => (
          <input
            {...props}
            className='mb-5 border border-primary text-[28px] focus:outline-primary'
          />
        )}
        containerStyle='flex justify-center gap-3'
        inputStyle={{
          width: '56px',
          height: '70px',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif',
        }}
      />

      <div className='mb-10 flex items-center justify-center gap-1 text-sm'>
        <p>Didn&apos;t receive an email? </p>
        <button className='font-semibold'> Click to resend</button>
      </div>
      {/* Submit Button */}
      <Button
        disabled={otp.length !== 6}
        onClick={handleOtpSubmit}
        isLoading={isSubmitting}
      >
        Confirm
      </Button>
    </div>
  );
};

export default Otp;
