import { BaseIcons } from '@/assets/icons/base/Icons';
import Image from 'next/image';
import React from 'react';

interface BlogCardsProps {
  imageUrl: string;
  header: string;
  containerClassStyle: string;
  imageClassStyle: string;
}
const BlogCards = ({
  imageUrl,
  header,
  containerClassStyle,
  imageClassStyle,
}: BlogCardsProps): JSX.Element => {
  return (
    <div
      className={`${containerClassStyle} flex flex-col items-center border-[1px] border-[#9AA4B2] sm:h-[535px]`}
    >
      <div className={`${imageClassStyle} mb-3`}>
        <Image
          src={imageUrl}
          alt={imageUrl}
          width={400}
          height={100}
          className='h-full w-full object-cover object-top'
        />
      </div>
      <div className='w-[100%] px-5 sm:h-[150px]'>
        <h2 className='mb-2 font-inter text-[14px] font-medium sm:text-[20px]'>
          {header}
        </h2>
        <p className='line-clamp-2 border-b-[1px] border-[#9AA4B2] pb-3 text-[14px] sm:line-clamp-3'>
          Planning your big day? Here’s what’s trending across weddings this
          year.
        </p>
      </div>
      <div className='my-2 flex w-full items-center justify-between px-5 sm:-mt-4'>
        <p className='text-sm'>25th June,2025</p>
        <BaseIcons value='arrow-right-curve' />
      </div>
    </div>
  );
};

export default BlogCards;
