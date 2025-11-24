import Link from 'next/link';
import { BaseIcons } from '@/assets/icons/base/Icons';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      <div className='text-center'>
        <div className='mb-6 flex justify-center'>
          <BaseIcons value='listing-black' />
        </div>
        <h1 className='mb-4 text-4xl font-bold text-[#0F172A]'>
          Business Not Found
        </h1>
        <p className='mb-8 text-lg text-[#64748B]'>
          The business you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
          <Link
            href='/businesses/search'
            className='rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90'
          >
            Search Businesses
          </Link>
          <Link
            href='/'
            className='rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50'
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
