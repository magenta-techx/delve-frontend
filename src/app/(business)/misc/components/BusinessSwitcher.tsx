'use client';

import { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import Image from 'next/image';

export const BusinessSwitcher = () => {
  const { businesses, currentBusiness, switchBusiness, isLoading } = useBusinessContext();
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
        className='flex w-full items-center gap-3 rounded-xl bg-[#1A1A1A] px-4 py-3 text-white transition-colors hover:bg-[#2A2A2A]'
      >
        {/* Business Logo */}
        <div className='relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-white'>
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
        <div className='max-md:hidden md:flex-1 text-left'>
          <p className='truncate text-sm font-semibold'>{currentBusiness.name}</p>
          <p className='truncate text-xs text-gray-400'>
            Created on {currentBusiness.created_at ? new Date(currentBusiness.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
          </p>
        </div>

        {/* Dropdown Icon */}
        <div className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M4 6L8 10L12 6'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
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
          <div className='absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl bg-white shadow-lg'>
            <div className='p-2'>
              <p className='px-3 py-2 text-xs font-semibold text-gray-500'>
                Switch Business
              </p>
              {businesses.map((business) => (
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
                    <p className='truncate text-sm font-medium'>{business.name}</p>
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
              <button
                onClick={() => {
                  window.location.href = '/business/get-started';
                }}
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
                Add New Business
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
