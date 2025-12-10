'use client';
import { BaseIcons } from '@/assets/icons/base/Icons';
import Link from 'next/link';
import React from 'react';
import type { BusinessSummary, SavedBusiness } from '@/types/api';
import { useSavedBusinessesContext } from '@/contexts/SavedBusinessesContext';
import { AccessDeniedModal } from '@/components/ui';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FeaturedListingCardProps {
  business: BusinessSummary | SavedBusiness;
  group?: boolean;
  classStyle?: string;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectToggle?: (businessId: number) => void;
  isDeletable?: boolean;
  onDelete?: (businessId: number) => void;
}

const FeaturedListingCard = ({
  business,
  isSelectable,
  isSelected,
  onSelectToggle,
  isDeletable,
  onDelete,
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
    } catch (error) { }
  };

  const articleRef = React.useRef<HTMLElement>(null);
  const [articleWidth, setArticleWidth] = React.useState<number>(0);
  React.useEffect(() => {

    if (articleRef.current) {
      setArticleWidth(articleRef.current.offsetWidth);
    }
  }, [articleRef.current]);

  // Calculate fluid font size based on article width
  const getFluidFontSize = (minRem: number, maxRem: number, scaleFactor: number = 0.05) => {
    if (!articleWidth) return `${minRem}rem`;
    const calculatedRem = minRem + (articleWidth * scaleFactor);
    const clampedRem = Math.max(minRem, Math.min(maxRem, calculatedRem));
    return `${clampedRem}rem`;
  };




  return (
    <>
      <article

        ref={articleRef}
        className={cn(
          'group !aspect-[342/427] rounded-3xl border-2 border-[#FEC601] p-1.5',
          isSelectable && 'cursor-pointer'
        )}
        onClick={() => {
          if (!isSelectable) return;
          onSelectToggle?.(business.id);
        }}
      >
        <div className='relative flex size-full flex-col items-center justify-center !overflow-hidden rounded-2xl p-2'>
          {/* Bookmark  */}
          {isDeletable && onDelete ? (
            <button
              onClick={e => {
                e.stopPropagation();
                onDelete(business.id);
              }}
              className='absolute right-5 top-5 z-10 cursor-pointer rounded-xl bg-white transition-transform hover:scale-110'
              aria-label='Delete business'
            >
              <svg
                width='28'
                height='28'
                viewBox='0 0 28 28'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect
                  x='0.5'
                  y='0.5'
                  width='27'
                  height='27'
                  rx='7.5'
                  fill='white'
                />
                <rect
                  x='0.5'
                  y='0.5'
                  width='27'
                  height='27'
                  rx='7.5'
                  stroke='#FF9C66'
                />
                <path
                  d='M14.001 11.583C15.3182 11.583 17.1263 11.7732 18.1562 11.8965C18.3239 11.9167 18.4491 12.0677 18.4336 12.2461L17.832 19.1729C17.7422 20.2064 16.8763 21 15.8389 21H11.8291C10.7583 21 9.87759 20.1567 9.83105 19.0869L9.5332 12.2363C9.52568 12.0633 9.64961 11.9201 9.8125 11.9004C10.8361 11.7773 12.6694 11.583 14.001 11.583ZM11.501 17.875C10.8797 17.875 10.376 18.3787 10.376 19C10.376 19.6213 10.8797 20.125 11.501 20.125H16.501C17.1222 20.1248 17.626 19.6212 17.626 19C17.626 18.3788 17.1222 17.8752 16.501 17.875H11.501ZM11.501 15.375C10.8797 15.375 10.376 15.8787 10.376 16.5C10.376 17.1213 10.8797 17.625 11.501 17.625H16.501C17.1222 17.6248 17.626 17.1212 17.626 16.5C17.626 15.8788 17.1222 15.3752 16.501 15.375H11.501ZM11.501 12.875C10.8797 12.875 10.376 13.3787 10.376 14C10.376 14.6213 10.8797 15.125 11.501 15.125H16.501C17.1222 15.1248 17.626 14.6212 17.626 14C17.626 13.3788 17.1222 12.8752 16.501 12.875H11.501ZM7.89453 9.98145H7.89258C7.89186 9.97525 7.89157 9.96908 7.89062 9.96289C7.89214 9.9731 7.89435 9.9797 7.89453 9.98145ZM7.87695 9.89355C7.87852 9.89877 7.87857 9.90423 7.87988 9.90918C7.87519 9.89076 7.86988 9.8729 7.86328 9.85547C7.87016 9.87293 7.87483 9.88652 7.87695 9.89355ZM13.5527 6.375H14.6758C15.616 6.37501 16.4622 6.94565 16.8145 7.81738L16.8896 8.00391C17.1115 8.55292 17.6033 8.94648 18.1875 9.04297C18.1978 9.04466 18.2075 9.04738 18.2158 9.05078C18.2638 9.0705 18.3145 9.08282 18.3662 9.08691C19.0186 9.13788 19.5916 9.18931 20.0039 9.22754C20.067 9.23339 20.1264 9.23892 20.1816 9.24414L20.1699 9.36523C20.1654 9.40916 20.1683 9.45247 20.1748 9.49414C20.1151 9.48849 20.0506 9.482 19.9814 9.47559C19.5607 9.43657 18.9722 9.38503 18.3027 9.33301C16.9628 9.2289 15.3001 9.12501 14.001 9.125C12.7019 9.125 11.0391 9.2289 9.69922 9.33301C9.02975 9.38503 8.44123 9.43657 8.02051 9.47559C7.95107 9.48203 7.8861 9.48847 7.82617 9.49414C7.83271 9.45245 7.83557 9.40918 7.83105 9.36523C7.82661 9.32191 7.82221 9.28163 7.81836 9.24414C7.87393 9.23889 7.93361 9.23342 7.99707 9.22754C8.40933 9.18931 8.98229 9.13789 9.63477 9.08691C9.68675 9.08284 9.73791 9.07063 9.78613 9.05078C9.79538 9.04699 9.80581 9.04452 9.81738 9.04297L9.84082 9.04004C10.562 8.94484 11.1767 8.46844 11.4492 7.79395C11.7958 6.93652 12.6279 6.37515 13.5527 6.375ZM13.5527 6.625C12.7298 6.62515 11.989 7.12464 11.6807 7.8877C11.6394 7.98986 11.5916 8.0882 11.5371 8.18164C11.4447 8.34008 11.4458 8.53659 11.541 8.69336C11.6363 8.85005 11.81 8.94164 11.9932 8.93262C12.6962 8.89743 13.3893 8.875 14.001 8.875C14.68 8.87501 15.458 8.90343 16.2393 8.94531C16.4164 8.95481 16.5858 8.86962 16.6836 8.72168C16.7813 8.57376 16.7929 8.38479 16.7148 8.22559C16.6944 8.1839 16.6758 8.14113 16.6582 8.09766L16.582 7.91113C16.268 7.13396 15.514 6.62501 14.6758 6.625H13.5527Z'
                  fill='#BC1B06'
                  stroke='#BC1B06'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleBookmarkClick}
              className='absolute right-5 top-5 z-10 cursor-pointer rounded-xl transition-transform hover:scale-110'
              aria-label={
                isBusinessSaved ? 'Remove from saved' : 'Save business'
              }
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
          )}

          {!isSelectable && (
            <Link
              href={`/businesses/${business.id}`}
              className='relative z-[15] hidden h-14 w-[120px] items-center justify-center gap-2 rounded-md bg-primary px-4 text-center font-medium text-white group-hover:flex'
              style={{ fontSize: getFluidFontSize(0.875, 1, 0.003) }}
            >
              <span> View</span>
              <BaseIcons value='arrow-diagonal-white' />
            </Link>
          )}
          {isSelectable && isSelected && (
            <div className='absolute inset-0 z-[500] flex h-full w-full items-center justify-center gap-2 rounded-2xl bg-black/50 text-white'>
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
          <Image
            src={imageUrl}
            alt={imageUrl}
            className='absolute'
            style={{ objectFit: 'cover' }}
            fill
            priority
          />

          {/* Content  */}
          <div
            className={cn(
              'absolute bottom-0 z-10 flex h-[80%] w-full flex-col gap-2 rounded-bl-2xl rounded-br-2xl bg-gradient-to-t from-black to-transparent px-4 text-white transition-opacity duration-300 sm:h-[80%]',
              !isSelectable && 'group-hover:opacity-0'
            )}
          >
            <div className='mt-auto flex w-full flex-col gap-2 divide-y divide-white pb-3'>
              <div className='flex items-start gap-2'>
                <div className='relative size-10 shrink-0 overflow-hidden rounded-full md:size-12'>
                  <img
                    src={logoUrl}
                    alt={logoUrl}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div>
                  <h3 className='font-semibold truncate max-sm:w-[90%] ' style={{ fontSize: getFluidFontSize(0.675, 1.1, 0.0035) }}>{header}</h3>
                  <p className='line-clamp-2 max-sm:w-[90%]' style={{ fontSize: getFluidFontSize(0.4, 0.785, 0.0025) }}>{desc}</p>
                </div>
              </div>
              <div className='flex items-center gap-4 justify-between pt-2 w-full overflow-hidden'>
                <div className='flex items-center gap-2 basis-4/5 truncate'>
                  <span className='!shrink-0'>

                    <BaseIcons value='marker-light-red' />
                  </span>
                  <span className='text-[#FFE6D5] truncate' style={{ fontSize: getFluidFontSize(0.4, 0.785, 0.0025) }}>
                    {address}
                  </span>
                </div>
                <div className='flex items-center justify-end gap-1 shrink-0 basis-1/5' style={{ fontSize: getFluidFontSize(0.625, 0.875, 0.0025) }}>
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
