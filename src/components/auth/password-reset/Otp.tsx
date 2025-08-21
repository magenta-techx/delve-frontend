'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import AuthFormheader from '../AuthFormheader';
import { Button } from '@/components/ui/Button';
import EmailIcon from '@/assets/icons/auth/EmailIcon';
import '@/styles/auth.css';

const Otp = (): JSX.Element => {
  const urlParams = useSearchParams();
  const navigate = useRouter();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');

  const handleOtpSubmit = async (): Promise<void> => {
    if (otp.length !== 6) return;

    const res = await fetch('/api/auth/otp-verify', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        otp: otp,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      // {status: true, message: "Reset code is valid."}

      navigate.push(
        `/auth/password-reset/create-new-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
      );
    } else {
      const data = await res.json();
      alert(data.error || 'Incorrect OTP');
    }
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
            className='mb-5 border border-primary text-[28px] focus:border-2 focus:outline-8 focus:outline-primary'
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
      <Button disabled={otp.length !== 6} onClick={handleOtpSubmit}>
        Confirm
      </Button>
    </div>
  );
};

export default Otp;
