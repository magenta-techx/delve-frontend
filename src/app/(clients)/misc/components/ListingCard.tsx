'use client';
import { BaseIcons } from '@/assets/icons/base/Icons';
import Link from 'next/link';
import React from 'react';
import type { BusinessSummary, SavedBusiness } from '@/types/api';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import { AccessDeniedModal } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FeaturedListingCardProps {
  business: BusinessSummary | SavedBusiness;
  group?: boolean;
  classStyle?: string;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectToggle?: (businessId: number) => void;
}

const FeaturedListingCard = ({
  business,
  isSelectable,
  isSelected,
  onSelectToggle,
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

  return (
    <>
      <article
        className={
          cn('group !aspect-[5/6] rounded-2xl border-2 border-[#FEC601] p-1', isSelectable && "cursor-pointer")
        }
        onClick={() => {
          if (!isSelectable) return;
          onSelectToggle?.(business.id);
        }}
      >
        <div className='relative flex size-full flex-col items-center justify-center !overflow-hidden rounded-2xl p-2'>
          {/* Bookmark  */}
          <button
            onClick={handleBookmarkClick}
            className='absolute right-5 top-5 z-10 cursor-pointer rounded-xl transition-transform hover:scale-110'
            aria-label={isBusinessSaved ? 'Remove from saved' : 'Save business'}
            disabled={savingThisBusiness}
          >
            {savingThisBusiness ? (
              <div className='animate-spin'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='lucide lucide-loader-circle-icon lucide-loader-circle'
                >
                  <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                </svg>
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
                  strokeLinecap='round'
                  strokeLinejoin='round'
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
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}
          </button>

          {!isSelectable && (
            <Link
              href={`/businesses/${business.id}`}
              className='relative z-10 hidden h-14 w-[120px] items-center justify-center gap-2 rounded-md bg-primary px-4 text-center font-medium text-white group-hover:flex'
            >
              <span> View</span>
              <BaseIcons value='arrow-diagonal-white' />
            </Link>
          )}
          {isSelectable && isSelected && (
            <div className='absolute inset-0 z-[500] flex items-center justify-center h-full w-full rounded-2xl gap-2 text-white bg-black/50'>
              <svg
                width='62'
                height='62'
                viewBox='0 0 62 62'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M30.9994 56.8346C45.2667 56.8346 56.8327 45.2687 56.8327 31.0013C56.8327 16.7339 45.2667 5.16797 30.9994 5.16797C16.732 5.16797 5.16602 16.7339 5.16602 31.0013C5.16602 45.2687 16.732 56.8346 30.9994 56.8346ZM43.3485 25.2672C44.1052 24.5105 44.1052 23.2838 43.3485 22.5271C42.5919 21.7705 41.3651 21.7705 40.6085 22.5271L27.7702 35.3654L21.3902 28.9855C20.6336 28.2288 19.4068 28.2288 18.6502 28.9855C17.8935 29.7421 17.8935 30.9688 18.6502 31.7255L26.4002 39.4755C27.1568 40.2321 28.3836 40.2321 29.1402 39.4755L43.3485 25.2672Z'
                  fill='white'
                />
              </svg>
            </div>
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
          <div className={cn('absolute bottom-0 z-10 flex h-48 w-full flex-col gap-2 rounded-bl-2xl rounded-br-2xl bg-gradient-to-t from-black to-transparent px-4 text-white transition-opacity duration-300  sm:h-40', !isSelectable && "group-hover:opacity-0")}>
            <div className='mt-auto flex w-full flex-col gap-2 divide-y divide-white pb-2.5'>
              <div className='flex items-start gap-2'>
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
        </div>
      </article>

      <AccessDeniedModal
        isAccessDeniedModalOpen={showLoginAlert}
        closeAccessDeniedModal={setShowLoginAlert}
      />
    </>
  );
};

export default FeaturedListingCard;
