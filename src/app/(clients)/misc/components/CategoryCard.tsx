import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { ReactNode } from 'react';

interface CategoryCardProps {
  icon: IconsType | ReactNode;
  hoverIcon: IconsType | ReactNode;
  title: string;
  imageSrc: string;
}
const CategoryCard = ({
  icon,
  title,
  hoverIcon,
  imageSrc,
}: CategoryCardProps): JSX.Element => {
  const isIconString = typeof icon === 'string';
  const isHoverIconString = typeof hoverIcon === 'string';

  return (
    <button className='group relative flex size-28 !shrink-0 items-center justify-center rounded-full sm:!size-48'>
      <div className='absolute -left-3 -top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border-[1px] border-[#FEC601] bg-white duration-500 sm:hidden sm:h-16 sm:w-16 sm:group-hover:flex'>
        {isHoverIconString ? (
          <BaseIcons value={hoverIcon as IconsType} />
        ) : (
          hoverIcon
        )}
      </div>
      <Image
        src={imageSrc}
        priority
        alt={title}
        width={200}
        height={200}
        className={cn('absolute h-full w-full rounded-full [filter:grayscale(100%)] transition-all duration-500 group-hover:grayscale-0')}
      />
      <div className='absolute h-full w-full rounded-full transition-all duration-500 group-hover:bg-transparent sm:bg-black/50'></div>
      <div className='relative z-10 flex h-full flex-col items-center justify-center p-4 transition-all duration-500 sm:group-hover:hidden'>
        <div className='mb-4 hidden sm:flex'>
          {isIconString ? <BaseIcons value={icon as IconsType} /> : icon}
        </div>
        <p className='text-balance text-center text-sm font-medium uppercase text-white max-sm:hidden'>
          {title}
        </p>
      </div>
    </button>
  );
};

export default CategoryCard;
