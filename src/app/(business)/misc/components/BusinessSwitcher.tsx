'use client';

import { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import Image from 'next/image';
import { format } from 'date-fns';
import { LinkButton } from '@/components/ui';

export const BusinessSwitcher = () => {
  const { businesses, currentBusiness, switchBusiness, isLoading } =
    useBusinessContext();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className='flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm'>
        <div className='h-10 w-10 animate-pulse rounded-full bg-gray-200' />
        <div className='flex-1'>
          <div className='mb-1 h-4 w-24 animate-pulse rounded bg-gray-200' />
          <div className='h-3 w-32 animate-pulse rounded bg-gray-200' />
        </div>
      </div>
    );
  }

  if (!currentBusiness) {
    return null;
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center gap-3 rounded-xl bg-[#1A1A1A] p-3 text-white transition-colors hover:bg-[#2A2A2A] md:rounded-xl md:px-4 md:py-3'
      >
        {/* Business Logo */}
        <div className='md:-10 relative size-7 flex-shrink-0 overflow-hidden rounded-full bg-white'>
          {currentBusiness.logo ? (
            <Image
              src={currentBusiness.logo}
              alt={currentBusiness.name}
              fill
              className='object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-white'>
              {currentBusiness.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Business Info */}
        <div className='text-left max-md:hidden md:flex-1'>
          <p className='truncate font-inter font-semibold'>
            {currentBusiness.name}
          </p>
          <p className='truncate text-xs text-[#CDD5DF]'>
            Created on{' '}
            {currentBusiness.created_at
              ? format(new Date(currentBusiness.created_at), 'dd/MM/yyyy')
              : 'N/A'}
          </p>
        </div>

        {/* Dropdown Icon */}
        <div className={`transition-transform`}>
          <svg
            width='8'
            height='12'
            viewBox='0 0 8 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M4.40031 0.183058C4.2831 0.0658477 4.12413 0 3.95837 0C3.79261 0 3.63364 0.0658485 3.51643 0.183059L0.183105 3.51639C-0.060972 3.76047 -0.0609714 4.1562 0.183107 4.40028C0.427184 4.64435 0.822913 4.64435 1.06699 4.40027L3.95837 1.50888L6.84977 4.40028C7.09385 4.64435 7.48958 4.64435 7.73365 4.40028C7.97773 4.1562 7.97773 3.76047 7.73365 3.51639L4.40031 0.183058Z'
              fill='#D9D6FE'
            />
            <path
              d='M1.06694 6.84985C0.822864 6.60577 0.427135 6.60577 0.183058 6.84985C-0.0610195 7.09393 -0.0610193 7.48966 0.183059 7.73374L3.5164 11.0671C3.63361 11.1843 3.79258 11.2501 3.95834 11.2501C4.1241 11.2501 4.28307 11.1843 4.40028 11.0671L7.73361 7.73374C7.97768 7.48966 7.97768 7.09393 7.73361 6.84985C7.48953 6.60577 7.0938 6.60577 6.84972 6.84985L3.95834 9.74124L1.06694 6.84985Z'
              fill='#D9D6FE'
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-40'
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className='absolute left-0 top-full z-[100] mt-2 max-h-96 overflow-y-auto rounded-xl bg-white shadow-lg max-md:min-w-[220px] md:right-0'>
            <div className='p-2'>
              <p className='px-3 py-2 text-xs font-semibold text-gray-500'>
                Switch Business
              </p>
              {businesses.map(business => (
                <button
                  key={business.id}
                  onClick={() => {
                    switchBusiness(business.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    business.id === currentBusiness.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {/* Business Logo */}
                  <div className='relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-100'>
                    {business.logo ? (
                      <Image
                        src={business.logo}
                        alt={business.name}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-white'>
                        {business.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Business Info */}
                  <div className='flex-1 overflow-hidden'>
                    <p className='truncate text-sm font-medium'>
                      {business.name}
                    </p>
                    <p className='truncate text-xs text-gray-500'>
                      {business.category?.name || 'Uncategorized'}
                    </p>
                  </div>

                  {/* Selected Indicator */}
                  {business.id === currentBusiness.id && (
                    <div className='flex-shrink-0'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M13.3334 4L6.00002 11.3333L2.66669 8'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Create New Business */}
            <div className='border-t border-gray-200 p-2'>
              <LinkButton
                href={'/businesses/create-listing'}
                variant="light"
                className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10'
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M8 3.33334V12.6667M3.33334 8H12.6667'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
                <span className='md:hdden'>New</span>
                <span className='max-md:hidden'>Add New Business</span>
              </LinkButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
