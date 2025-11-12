import React from 'react';

interface ListingCardSkeletonProps {
  classStyle?: string;
  group?: boolean;
}

export default function ListingCardSkeleton({ classStyle = '', group = false }: ListingCardSkeletonProps): JSX.Element {
  return (
    <div className='rounded-xl border-[2px] border-[#FEC601] p-1'>
      <div className={`relative flex ${classStyle} ${group ? 'group' : ''} flex-col items-center justify-end rounded-xl overflow-hidden font-inter`}>
        {/* Bookmark placeholder */}
        <div className='absolute right-5 top-5 z-10 h-6 w-6 rounded-md bg-white/40 backdrop-blur-sm' />

        {/* Background image placeholder */}
        <div className='absolute inset-0 animate-pulse bg-gray-200' />

        {/* Content placeholder */}
        <div className='relative z-10 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-white'>
          <div className='flex items-center gap-2 border-b border-white/50 pb-2 sm:h-[85px] sm:items-start'>
            {/* Logo circle */}
            <div className='mt-2 sm:mt-0 h-10 w-14 sm:h-14 sm:w-14 flex-shrink-0'>
              <div className='h-full w-10 sm:w-14 rounded-full bg-white/60' />
            </div>
            {/* Title and desc lines */}
            <div className='flex w-full flex-col gap-2'>
              <div className='h-4 w-40 rounded bg-white/70' />
              <div className='h-3 w-64 rounded bg-white/50' />
            </div>
          </div>
          <div className='mt-3 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='h-4 w-4 rounded bg-white/60' />
              <div className='h-3 w-24 rounded bg-white/50' />
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-4 w-4 rounded bg-white/60' />
              <div className='h-3 w-8 rounded bg-white/50' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
