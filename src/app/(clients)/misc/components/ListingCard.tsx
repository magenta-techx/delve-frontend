'use client';
import { BaseIcons } from '@/assets/icons/base/Icons';
import Link from 'next/link';
import React from 'react';
import type { BusinessSummary } from '@/types/api';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from '@/components/ui/AlertDialog';
import { BookmarkIcon } from '../icons';

interface FeaturedListingCardProps {
  business: BusinessSummary;
  group?: boolean;
  classStyle?: string;
}

const FeaturedListingCard = ({
  business,
  classStyle,
}: FeaturedListingCardProps): JSX.Element => {
  const { isSaved, toggleSave, showLoginAlert, setShowLoginAlert, isSaving } =
    useSavedBusinessesContext();
  const isBusinessSaved = isSaved(business.id);
  const savingThisBusiness = isSaving(business.id);

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
    } catch (error) {}
  };

  const baseClasses =
    'xl:group relative flex flex-col items-center justify-center p-2 font-inter ring-[2px] ring-[#FEC601] ring-offset-4 !aspect-[5/6] rounded-xl overflow-hidden';

  return (
    <>
      <article className={`${baseClasses} ${classStyle ?? ''}`}>
        {/* Bookmark  */}
        <button
          onClick={handleBookmarkClick}
          className='absolute right-5 top-5 z-10 cursor-pointer rounded-xl transition-transform hover:scale-110'
          aria-label={isBusinessSaved ? 'Remove from saved' : 'Save business'}
          disabled={savingThisBusiness}
        >
          {savingThisBusiness ? (
            <div className='animate-spin'>
              <BaseIcons value='arrow-down-black' />
            </div>
          ) : isBusinessSaved ? (
            <svg
              width='25'
              height='28'
              viewBox='0 0 25 28'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M0.5 5V23.2188C0.5 26.5641 3.45254 27.9104 5.79844 25.5256C6.47274 24.8401 7.23017 24.0609 8.08048 23.1752C10.4881 20.6675 14.5119 20.6675 16.9195 23.1752C17.7698 24.0609 18.5273 24.8401 19.2016 25.5256C21.5475 27.9104 24.5 26.5641 24.5 23.2188V5C24.5 2.51472 22.4853 0.5 20 0.5H5C2.51472 0.5 0.5 2.51472 0.5 5Z'
                fill='#C3B5FD'
                stroke='black'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          ) : (
            <svg
              width='25'
              height='28'
              viewBox='0 0 25 28'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M0.5 5V23.2188C0.5 26.5641 3.45254 27.9104 5.79844 25.5256C6.47274 24.8401 7.23017 24.0609 8.08048 23.1752C10.4881 20.6675 14.5119 20.6675 16.9195 23.1752C17.7698 24.0609 18.5273 24.8401 19.2016 25.5256C21.5475 27.9104 24.5 26.5641 24.5 23.2188V5C24.5 2.51472 22.4853 0.5 20 0.5H5C2.51472 0.5 0.5 2.51472 0.5 5Z'
                fill='#FFFFFF'
                stroke='black'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          )}
        </button>

        <Link
          href={`/businesses/${business.id}`}
          className='relative z-10 hidden h-14 w-[120px] items-center justify-center gap-2 rounded-md bg-primary px-4 text-center font-medium text-white group-hover:flex'
        >
          <span> View</span>
          <BaseIcons value='arrow-diagonal-white' />
        </Link>

        {/* background image  */}
        <img
          src={imageUrl}
          alt={imageUrl}
          width={200}
          height={100}
          className='absolute h-full w-full'
        />

        {/* Content  */}
        <div className='absolute bottom-0 z-10 flex h-48 w-full flex-col gap-2 rounded-bl-2xl rounded-br-2xl bg-gradient-to-t from-black to-transparent px-4 text-white transition-opacity duration-300 group-hover:opacity-0 sm:h-40'>
          <div className='mt-auto flex w-full flex-col gap-2 divide-y divide-white pb-2.5'>
            <div className='flex items-start gap-2 sm:h-[85px] sm:items-start'>
              <div className='relative size-10 shrink-0 overflow-hidden rounded-full md:size-12'>
                <img
                  src={logoUrl}
                  alt={logoUrl}
                  className='h-full w-full object-cover'
                />
              </div>
              <div>
                <h3 className='text-sm font-semibold'>{header}</h3>
                <p className='line-clamp-2 text-[10px] sm:text-xs'>{desc}</p>
              </div>
            </div>
            <div className='flex items-center justify-between pt-2 text-[14px]'>
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
        </div>
      </article>
      {/* Alert dialog for not logged in */}
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to save a business. Please sign in to
              continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <a href='/auth/signup-signin'>Sign in</a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FeaturedListingCard;
