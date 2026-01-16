'use client';
import React from 'react';
import Image from 'next/image';
import { LinkButton } from '@/components/ui';

interface CreateListingFormStep8SuccessProps {
  businessId?: string | number | undefined;
}

const CreateListingFormStep8Success: React.FC<CreateListingFormStep8SuccessProps> = ({
}) => {


  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8'>
      <div className='space-y-6 text-center'>
        {/* Success Image */}
        <div className='relative mx-auto h-64 w-full max-w-md'>
          <Image
            src='/business/successful-business-listing.png'
            alt='Success'
            fill
            className='object-contain'
            priority
          />
        </div>

        {/* Title */}
        <h1 className='font-karma text-3xl font-semibold text-gray-900 lg:text-4xl'>
          🎉 Your business profile has been submitted!
        </h1>

        {/* Description */}
        <p className='mx-auto max-w-2xl text-base text-gray-600'>
          Thank you for completing your onboarding. Our team will review your
          details, and verification typically takes 24–48 hours. You'll receive
          an update as soon as your business is approved and live on Delve.
        </p>

        {/* Action Button */}
        <div className='pt-4'>
          <LinkButton
          href="/business"
            size='xl'
            className='inline-flex items-center gap-2'
          >
            View your business
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default CreateListingFormStep8Success;
