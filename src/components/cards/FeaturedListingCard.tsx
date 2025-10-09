import { BaseIcons } from '@/assets/icons/base/Icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface FeaturedListingCardProps {
  header: string;
  desc: string;
  imageUrl: string;
  logoUrl: string;
  address: string;
  classStyle: string;
  rating: number;
  group?: boolean;
}
const FeaturedListingCard = ({
  header,
  desc,
  imageUrl,
  logoUrl,
  address,
  classStyle,
  rating,
  group = false,
}: FeaturedListingCardProps): JSX.Element => {
  return (
    <div className='rounded-[28px] border-[2px] border-[#FEC601] p-2'>
      <div
        className={`relative flex ${classStyle} ${group ? 'group' : ''} flex-col items-center justify-center rounded-lg font-inter`}
      >
        {/* Bookmark  */}
        <div className='absolute right-5 top-5 z-10'>
          <BaseIcons value='bookmark-white' />
        </div>

        {group && (
          <Link
            href={'/business/get-started'}
            className='relative z-10 hidden h-14 w-[120px] items-center justify-center gap-2 rounded-md bg-primary px-4 text-center font-medium text-white group-hover:flex'
          >
            <span> View</span>
            <BaseIcons value='arrow-diagonal-white' />
          </Link>
        )}

        {/* background image  */}
        <Image
          src={imageUrl}
          alt={imageUrl}
          width={200}
          height={100}
          className='absolute h-full w-full'
        />

        {/* Content  */}
        <div className='absolute bottom-0 z-10 flex h-28 w-full flex-col gap-2 rounded-bl-2xl rounded-br-2xl bg-gradient-to-t from-black to-transparent px-4 text-white transition-opacity duration-300 group-hover:opacity-0 sm:h-32'>
          <div className='flex h-[70px] items-center gap-2 border-b-[1px] border-b-white sm:h-[85px] sm:items-start'>
            <div className='mt-3 h-10 w-14 rounded-full sm:mt-0 sm:h-20 sm:w-20'>
              <Image
                src={logoUrl}
                alt={logoUrl}
                width={200}
                height={100}
                className='h-ful w-full rounded-full'
              />
            </div>
            <div>
              <h3 className='text-[16px] font-bold sm:text-xl'>{header}</h3>
              <p className='line-clamp-1 text-[10px] sm:text-[13px]'>{desc}</p>
            </div>
          </div>
          <div className='flex items-center justify-between text-[14px]'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='marker-light-red' />
              <span className='sm:text-md text-[10px] text-[#FFE6D5]'>
                {address}
              </span>
            </div>
            <div className='sm:text-md flex items-center gap-1 text-[10px]'>
              <BaseIcons value='star-yellow' />
              <p>{rating}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListingCard;
