'use client';
import { BaseIcons } from '@/assets/icons/base/Icons';
import Link from 'next/link';
import React from 'react';
import type { BusinessSummary } from '@/types/api';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import { BookmarkIcon } from '../icons';

interface FeaturedListingCardProps {
  business: BusinessSummary;
  group?: boolean;
  classStyle?: string;
}

const FeaturedListingCard = ({
  business,
  group = false,
  classStyle,
}: FeaturedListingCardProps): JSX.Element => {
  const { isSaved, toggleSave } = useSavedBusinessesContext();
  const isBusinessSaved = isSaved(business.id);

  const header = business.name;
  const desc = business.description || '';
  const imageUrl = business.thumbnail || '/landingpage/feature-listing-2.jpg';
  const logoUrl = business.logo || '/landingpage/logo.jpg';
  const address = business.address || '';
  const rating = business.average_review_rating ?? 0;

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleSave(business.id);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  // Allow parent to pass sizing classes via `classStyle` (keeps sensible defaults)
  const baseClasses =
    'group relative flex flex-col items-center justify-center p-2 font-inter ring-[2px] ring-[#FEC601] ring-offset-4 !aspect-[5/6] rounded-xl overflow-hidden';

  return (
    <article className={`${baseClasses} ${classStyle ?? ''}`}>
      {/* Bookmark  */}
      <button
        onClick={handleBookmarkClick}
        className='absolute right-5 top-5 z-10 rounded-xl cursor-pointer transition-transform hover:scale-110'
        aria-label={isBusinessSaved ? 'Remove from saved' : 'Save business'}
      >
        <BookmarkIcon
          strokeColor={isBusinessSaved ? 'black' : '#000000'}
          fillColor={isBusinessSaved ? '#C3B5FD' : '#ffffff'}
        />
      </button>

      {group && (
        <Link
          href={`/businesses/${business.id}`}
          className='relative z-10 hidden h-14 w-[120px] items-center justify-center gap-2 rounded-md bg-primary px-4 text-center font-medium text-white group-hover:flex'
        >
          <span> View</span>
          <BaseIcons value='arrow-diagonal-white' />
        </Link>
      )}

      {/* background image  */}
      <img
        src={imageUrl}
        alt={imageUrl}
        width={200}
        height={100}
        className='absolute h-full w-full'
      />

      {/* Content  */}
      <div className='absolute bottom-0 z-10 flex h-28 w-full flex-col gap-2 rounded-bl-2xl rounded-br-2xl bg-gradient-to-t from-black to-transparent px-4 text-white transition-opacity duration-300 group-hover:opacity-0 sm:h-32'>
        <div className='flex items-start gap-2 border-b-[1px] border-b-white sm:h-[85px] sm:items-start'>
          <div className='relative  size-12 shrink-0 rounded-full overflow-hidden '>
            <img
              src={logoUrl}
              alt={logoUrl}
              className='object-cover'
            // objectFit='cover'
            // fill
            />
          </div>
          <div>
            <h3 className='text-sm font-semibold'>{header}</h3>
            <p className='line-clamp-2 text-[10px] sm:text-xs'>{desc}</p>
          </div>
        </div>
        <div className='flex items-center justify-between text-[14px]'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='marker-light-red' />
            <span className='sm:text-md text-[0.65rem] text-[#FFE6D5]'>
              {address}
            </span>
          </div>
          <div className='sm:text-md flex items-center gap-1 text-[10px]'>
            <BaseIcons value='star-yellow' />
            <p>{rating}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedListingCard;
