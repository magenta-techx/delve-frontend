'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { useVerifyPaymentReference } from '@/app/(clients)/misc/api/payment';
import { LinkButton } from '@/components/ui';

interface PaystackStatusViewProps {
  redirectPath: string;
  redirectLabel: string;
}

export default function PaystackStatusView({
  redirectPath,
  redirectLabel,
}: PaystackStatusViewProps) {
  const searchParams = useSearchParams();
  const referenceId =
    searchParams.get('reference') || searchParams.get('trxref');

  const { data, isLoading, error } = useVerifyPaymentReference(referenceId);

  // Invalid / missing reference → don't render anything (parent shows normal page)
  if (!referenceId || error) {
    return null;
  }

  // Derive transaction status from the response
  const txStatus = data?.transaction_status;
  const message = data?.message || '';

  const isProcessing =
    txStatus === 'pending' ||
    txStatus === 'processing' ||
    /processing/i.test(message);

  const isSuccess = txStatus === 'success' || /success/i.test(message);

  if (isLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='flex max-w-md flex-col items-center gap-6 px-6 text-center'>
          <Loader2 className='size-12 animate-spin text-[#6E44FF]' />
          <div className='space-y-2'>
            <h1 className='font-inter text-xl font-semibold text-[#1A1A1A]'>
              Verifying Payment
            </h1>
            <p className='text-sm text-[#4B5565]'>
              Please wait while we confirm your transaction...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='flex max-w-md flex-col items-center gap-6 px-6 text-center'>
          <div className='flex size-20 items-center justify-center rounded-full bg-[#E3F5E1]'>
            <CheckCircle className='size-10 text-[#2E7D32]' />
          </div>
          <div className='space-y-2'>
            <h1 className='font-inter text-2xl font-semibold text-[#1A1A1A]'>
              Payment Successful
            </h1>
            <p className='text-sm text-[#4B5565]'>
              {message || 'Your transaction has been processed successfully.'}
            </p>
          </div>
          <LinkButton href={redirectPath}>{redirectLabel}</LinkButton>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='flex max-w-md flex-col items-center gap-6 px-6 text-center'>
          <div className='flex size-20 items-center justify-center rounded-full bg-[#F5F3FF]'>
            <Clock className='size-10 text-[#6E44FF]' />
          </div>
          <div className='space-y-2'>
            <h1 className='font-inter text-2xl font-semibold text-[#1A1A1A]'>
              Payment Processing
            </h1>
            <p className='text-sm text-[#4B5565]'>
              {message ||
                'Your payment is being processed. You will be notified via email once completed.'}
            </p>
          </div>
          <LinkButton href={redirectPath}>{redirectLabel}</LinkButton>
        </div>
      </div>
    );
  }

  // Failed or any other non-success state
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex max-w-md flex-col items-center gap-6 px-6 text-center'>
        <div className='flex size-20 items-center justify-center rounded-full bg-[#FFE1E1]'>
          <XCircle className='size-10 text-[#C62828]' />
        </div>
        <div className='space-y-2'>
          <h1 className='font-inter text-2xl font-semibold text-[#1A1A1A]'>
            Payment Failed
          </h1>
          <p className='text-sm text-[#4B5565]'>
            {message ||
              'We could not verify your payment. Please try again or contact support.'}
          </p>
        </div>
        <LinkButton href={redirectPath}>{redirectLabel}</LinkButton>
      </div>
    </div>
  );
}
