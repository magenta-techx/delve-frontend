'use client';
import React from 'react';

export interface TestimoniesProps {
  testimonies: { count: string; text: string }[];
}

const BusinessLandingTestimonies = ({
  testimonies,
}: TestimoniesProps): JSX.Element => {
  return (
    <div className='rounded-[30px] border border-gray-300 px-2 py-2'>
      {testimonies.map((testimony, key) => {
        return (
          <div
            className={`flex items-center gap-[24px] ${key < 2 && 'border-b-2 border-gray-300'} px-4 py-4 text-left sm:pl-10`}
            key={key}
          >
            <p className='font-karma text-[53px] font-semibold'>
              {' '}
              {testimony.count}
            </p>
            <p className='font-inter text-[14px] text-gray-600 sm:text-[16px]'>
              {' '}
              {testimony.text}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BusinessLandingTestimonies;
