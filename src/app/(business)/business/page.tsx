'use client';

import { useBusinessContext } from '@/contexts/BusinessContext';
import { ConversationsSection } from '../misc/components/sections/conversations-section';
import { ReviewsSection } from '../misc/components/sections/reviews-section';
import { useBusinessDetails } from '../misc/api';
import { LogoLoadingIcon } from '@/assets/icons';
import { EmptyState, LinkButton } from '@/components/ui';
import { EmptyListingIcon } from '@/app/(clients)/misc/icons';

export default function DashboardPage(): JSX.Element {
  const { currentBusiness, isLoading } = useBusinessContext();

  const { data, isLoading: isBusinessDetailsLoading } = useBusinessDetails(
    currentBusiness?.id,
    undefined,
    'dashboard'
  );
  
  console.log(data?.data.thumbnail);
  if (isLoading || isBusinessDetailsLoading) {
    return (
      <div className='flex size-full items-center justify-center'>
        <LogoLoadingIcon />
      </div>
    );
  }

  if (!currentBusiness) {
    return (
      // <div className='flex-1 overflow-auto'>
      //   <div className='p-6'>
      //     <div className='rounded-2xl bg-white p-8 text-center shadow-sm'>
      //       <p className='mb-4 text-gray-600'>No business selected</p>
      //       <Link
      //         href='/businesses/create-listing'
      //         className='inline-block rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90'
      //       >
      //         Create Your First Business
      //       </Link>
      //     </div>
      //   </div>
      // </div>

      <EmptyState
        media={<EmptyListingIcon />}
        title='No business created yet'
        description='Get started by creating your first business listing.'
        actions={
          <LinkButton
            href='/businesses/create-listing'
            // className='inline-block rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90'
            size='xl'
          >
            Create Your First Business
          </LinkButton>
        }
      />
    );
  }

  return (
    <div className='flex-1 overflow-auto'>
      <div className='space-y-6 p-6'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
          <p className='mt-1 text-sm text-gray-600'>
            Welcome back to {currentBusiness.name}
          </p>
        </div>

        {/* Main content grid */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Left side - Performance chart and conversations */}
          <div className='space-y-6 lg:col-span-2'>
            {/* <PerformanceChart /> */}
            <ConversationsSection />
          </div>

          {/* Right side - Reviews and metrics */}
          <div className='space-y-6'>
            <ReviewsSection />
          </div>
        </div>
      </div>
    </div>
  );
}
