import BusinessCommunityForm from '@/components/business/BusinessCommunityForm';
import BusinessSectionHeader from '@/components/business/BusinessSectionHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard',
};

export default function DashboardPage(): JSX.Element {
  return (
    <section className='absolute top-0 z-10 flex h-full w-full items-center justify-center overflow-y-hidden'>
      <div className='flex w-full flex-col items-center pt-20 sm:-mt-10 sm:pt-0'>
        <div className='-mb-2 mt-10 w-full px-2 text-white sm:px-0'>
          <BusinessSectionHeader text='Join the Community of Trusted Vendors on Delve' />
        </div>
        <div className='w-full'>
          {' '}
          <BusinessCommunityForm />
        </div>
      </div>
    </section>
  );
}
