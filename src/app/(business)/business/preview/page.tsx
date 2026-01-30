'use client';

import React from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import BusinessDetailsClient from '@/app/(clients)/businesses/[business_id]/BusinessDetailsClient';
import { LogoLoadingIcon } from '@/assets/icons';

export default function BusinessPreviewPage() {
  const { currentBusiness, isLoading } = useBusinessContext();

  if (isLoading) {
    return (
      <div className='flex h-full min-h-[50vh] w-full items-center justify-center'>
        <LogoLoadingIcon />
      </div>
    );
  }

  if (!currentBusiness) {
    return (
      <div className='flex h-full min-h-[50vh] w-full items-center justify-center'>
        <p className='text-gray-500'>No business data found to preview.</p>
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className='flex h-full min-h-[50vh] w-full items-center justify-center'>
          <LogoLoadingIcon />
        </div>
      }
    >
      <div className='-m-4 h-screen overflow-y-auto md:-m-6'>
        <BusinessDetailsClient business={currentBusiness} preview />
      </div>
    </React.Suspense>
  );
}
