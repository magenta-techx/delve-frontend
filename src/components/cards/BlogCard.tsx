import { BaseIcons } from '@/assets/icons/base/Icons';
import Image from 'next/image';
import React from 'react';

interface BlogCardProps {
  imageUrl: string;
  header: string;
  containerClassStyle: string;
  imageClassStyle: string;
}
const BlogCard = ({
  imageUrl,
  header,
  containerClassStyle,
  imageClassStyle,
}: BlogCardProps): JSX.Element => {
  return (
    <div
      className={`bg-[#F5F5F5] sm:py-8 ${containerClassStyle} flex flex-col items-center rounded-2xl p-4 sm:px-9`}
    >
      <div className={`${imageClassStyle} mb-7`}>
        <Image
          src={imageUrl}
          alt={imageUrl}
          width={400}
          height={100}
          className='h-full w-full rounded-xl'
        />
      </div>
      <div className='w-[100%] border-b-[1px] border-[#9AA4B2] pb-4 sm:h-[200px] sm:pb-6'>
        <h2 className='mb-2 font-inter text-[14px] font-medium sm:text-[28px]'>
          {header}
        </h2>
        <p className='text-[12px] italic text-[#697586] sm:text-[17px] sm:text-black'>
          Planning your big day? Here’s what’s trending across weddings this
          year, from soft pastels in Port Harcourt to bold garden glam in Lagos.
          Nigerian couples are redefining elegance, and we’re here for it.
        </p>
      </div>
      <div className='sm:text-md mt-3 flex w-full items-center justify-between text-[12px]'>
        <p className='font-semibold'>25th June,2025</p>
        <BaseIcons value='arrow-right-curve' />
      </div>
    </div>
  );
};

export default BlogCard;
