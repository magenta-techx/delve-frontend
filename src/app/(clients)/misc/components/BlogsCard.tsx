import { BaseIcons } from '@/assets/icons/base/Icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface BlogCardsProps {
  imageUrl: string;
  header: string;
  description?: string;
  dateLabel?: string;
  href?: string;
  containerClassStyle?: string;
  imageClassStyle?: string;
}
const BlogCards = ({
  imageUrl,
  header,
  description,
  dateLabel,
  href,
  containerClassStyle = '',
  imageClassStyle = '',
}: BlogCardsProps): JSX.Element => {
  const cardContent = (
    <div
      className={`flex h-full flex-col overflow-hidden border border-[#9AA4B2] bg-white transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] ${containerClassStyle}`}
    >
      <div className={`${imageClassStyle} mb-3 overflow-hidden`}>
        <Image
          src={imageUrl || '/blog/blog-image.jpg'}
          alt={header}
          width={400}
          height={280}
          className='h-full w-full object-cover object-center'
          priority={false}
        />
      </div>
      <div className='flex flex-1 flex-col px-5'>
        <h2 className='mb-2 font-inter text-[0.9rem] font-semibold leading-6 text-[#0F0F0F] sm:text-base'>
          {header}
        </h2>
        <p className='line-clamp-3 text-sm text-[#000000] '>
          {description || "Planning your big day? Here’s what’s trending across weddings this year."}
        </p>
      </div>
      <div className='flex items-center justify-between mx-5 pb-3 pt-2 mt-3 border-t border-[#9AA4B2] text-xs text-black'>
        <p>{dateLabel || '25th June, 2025'}</p>
        <BaseIcons value='arrow-right-curve' />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className='block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default BlogCards;
