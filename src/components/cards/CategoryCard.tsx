import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';
import Image from 'next/image';
import React from 'react';

interface CategoryCardProps {
  icon: IconsType;
  hoverIcon: IconsType;
  title: string;
}
const CategoryCard = ({
  icon,
  title,
  hoverIcon,
}: CategoryCardProps): JSX.Element => {
  return (
    <button className='sm:group relative flex h-[110px] w-[110px] items-center justify-center rounded-full sm:h-[197px] sm:w-[197px]'>
      <div className='absolute -left-3 -top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border-[1px] border-[#FEC601] bg-white duration-500 sm:hidden sm:h-16 sm:w-16 sm:group-hover:flex'>
        <BaseIcons value={hoverIcon} />
      </div>
      <Image
        src={'/landingpage/trendz-1.jpg'}
        alt=''
        width={200}
        height={200}
        className='absolute h-full w-full rounded-full'
      />
      <div className='absolute h-full w-full rounded-full transition-all duration-500 group-hover:bg-transparent sm:bg-black/50'></div>
      <div className='relative z-10 flex h-[100px] flex-col items-center transition-all duration-500 sm:group-hover:hidden'>
        <div className='mb-8 hidden sm:flex'>
          <BaseIcons value={icon} />
        </div>
        <p className='hidden w-[114px] text-center text-[13px] font-medium uppercase text-white sm:flex'>
          {title}
        </p>
      </div>
    </button>
  );
};

export default CategoryCard;
