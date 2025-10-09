import { BaseIcons } from '@/assets/icons/base/Icons';
import React from 'react';

const UpComingEvents = (): JSX.Element => {
  return (
    <div className='flex h-[550px] w-full flex-col items-center gap-10 bg-black py-12 font-inter sm:h-[842px]'>
      <div className='hidden sm:flex'>
        <BaseIcons value='upcoming-event-sample' />
      </div>
      <div className='flex sm:hidden'>
        <BaseIcons value='upcoming-event-sample-mobile' />
      </div>

      <div className='flex flex-col gap-2'>
        {/* Date and decription  */}
        <div className='flex items-center gap-2'>
          <div className='flex h-[64px] w-[84px] items-center justify-center rounded-lg bg-[#FFFFFF] sm:h-[100px] sm:w-[100px] sm:rounded-md'>
            <div className='flex w-full flex-col items-center justify-center sm:gap-2'>
              <small className='text-xs sm:text-sm'>Jul</small>
              <h1 className='text-[20px] font-semibold sm:text-4xl'>11</h1>
            </div>
          </div>
          <div className='flex h-[64px] w-full items-center rounded-lg bg-[#FF9C66] pl-4 sm:h-[100px] sm:w-[643px] sm:rounded-md sm:pl-8'>
            <div className='font-inter'>
              <h1 className='text-[16px] font-semibold sm:text-[32px]'>
                Innovation & Inspiration Week{' '}
              </h1>
              <p className='text-[12px] sm:text-lg'>
                Opening ceremony & Innovation Workshop
              </p>
            </div>
          </div>
        </div>
        {/* Date and decription  */}
        <div className='flex items-center gap-2'>
          <div className='flex h-[64px] w-[84px] items-center justify-center rounded-lg bg-[#D9D6FE] sm:h-[100px] sm:w-[100px] sm:rounded-md'>
            <div className='flex w-full flex-col items-center justify-center sm:gap-2'>
              <small className='text-xs sm:text-sm'>Jul</small>
              <h1 className='text-[20px] font-semibold sm:text-4xl'>18</h1>
            </div>
          </div>
          <div className='flex h-[64px] w-full items-center rounded-lg bg-[#F3FEE7] pl-4 sm:h-[100px] sm:w-[643px] sm:rounded-md sm:pl-8'>
            <div className='font-inter'>
              <h1 className='text-[16px] font-semibold sm:text-[32px]'>
                Artistic Expression
              </h1>
              <p className='text-[12px] sm:text-lg'>Creative Workshop</p>
            </div>
          </div>
        </div>
        {/* Date and decription  */}
        <div className='flex items-center gap-2'>
          <div className='flex h-[64px] w-[84px] items-center justify-center rounded-lg bg-[#FF9C66] sm:h-[100px] sm:w-[100px] sm:rounded-md'>
            <div className='flex w-full flex-col items-center justify-center sm:gap-2'>
              <small className='text-xs sm:text-sm'>Jul</small>
              <h1 className='text-[20px] font-semibold sm:text-4xl'>21</h1>
            </div>
          </div>
          <div className='flex h-[64px] w-full items-center rounded-lg bg-[#FFFFFF] pl-4 sm:h-[100px] sm:w-[643px] sm:rounded-md sm:pl-8'>
            <div className='font-inter'>
              <h1 className='text-[16px] font-semibold sm:text-[32px]'>
                Story Writing & Art Performance{' '}
              </h1>
              <p className='text-[12px] sm:text-lg'>
                Opening ceremony & Innovation Workshop
              </p>
            </div>
          </div>
        </div>

        {/* Date and decription  */}
        <div className='flex items-center gap-2'>
          <div className='flex h-[64px] w-[84px] items-center justify-center rounded-lg bg-[#F3FEE7] sm:h-[100px] sm:w-[100px] sm:rounded-md'>
            <div className='flex w-full flex-col items-center justify-center sm:gap-2'>
              <small className='text-xs sm:text-sm'>Jul</small>
              <h1 className='text-[20px] font-semibold sm:text-4xl'>28</h1>
            </div>
          </div>
          <div className='flex h-[64px] w-full items-center rounded-lg bg-[#D9D6FE] pl-4 sm:h-[100px] sm:w-[643px] sm:rounded-md sm:pl-8'>
            <div className='font-inter'>
              <h1 className='text-[16px] font-semibold sm:text-[32px]'>
                Reflect & Network
              </h1>
              <p className='text-[12px] sm:text-lg'>
                Opening ceremony & Innovation Workshop
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpComingEvents;
