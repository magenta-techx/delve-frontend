'use client';
import { BaseIcons } from '@/assets/icons/base/Icons';
import FeaturedListingCard from '@/app/(clients)/misc/components/ListingCard';
import { useRouter } from 'next/navigation';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSavedBusinesses } from '@/app/(clients)/misc/api/user';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import type { BusinessSummary } from '@/types/api';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  EmptyState,
  LinkButton,
} from '@/components/ui';
import { EmptySavedBusinessesIcon } from '../../misc/icons';
import {
  BusinessCategoriesIconsType,
  BusinessCategoryIcons,
} from '@/assets/icons/business/BusinessCategoriesIcon';
import ListingCardSkeleton from '../../misc/components/ListingCardSkeleton';
import { convertToTitleCase } from '@/utils/strings';

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: savedBusinessesData, isLoading } = useSavedBusinesses(
    Boolean(session?.user?.accessToken || session?.user?.email)
  );
  const [searchText, setSearchText] = useState('');

  // Group saved businesses by category
  const businessesByCategory = useMemo(() => {
    const savedBusinesses = savedBusinessesData?.data ?? [];
    const grouped: Record<string, BusinessSummary[]> = {};

    savedBusinesses.forEach(business => {
      // Extract category name from business object
      const categoryName =
        (business as BusinessSummary & { category?: { name: string } }).category
          ?.name || 'Uncategorized';

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(business);
    });

    return grouped;
  }, [savedBusinessesData]);

  const categoriesWithBusinesses = useMemo(() => {
    return Object.entries(businessesByCategory)
      .filter(([_, businesses]) => businesses.length > 0)
      .map(([categoryName, businesses]) => ({
        name: categoryName,
        businesses,
      }));
  }, [businessesByCategory]);

  return (
    <main className='container relative mx-auto flex w-full flex-col items-center overflow-x-hidden lg:w-[80vw]'>
      {/* Header and Search */}
      <header className='z-10 mt-20 w-full px-4 sm:px-0 md:mt-28'>
        <div className='mb-6 flex w-full items-center justify-between'>
          <h1 className='font-inter text-lg sm:text-xl font-semibold text-[#0F0F0F] md:text-2xl'>
            Saved Businesses
          </h1>
          <LinkButton
            href='/business/collaboration'
            variant='light'
            className='flex items-center justify-center gap-2'
            size='dynamic_lg'
          >
            <svg
              width='17'
              height='14'
              viewBox='0 0 17 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M13.5457 10.7222C13.0011 10.8137 12.6337 11.3294 12.7252 11.874C12.8167 12.4187 13.3324 12.786 13.8771 12.6945L13.5457 10.7222ZM12.6793 6.15198C12.1271 6.15198 11.6793 6.59969 11.6793 7.15198C11.6793 7.70426 12.1271 8.15198 12.6793 8.15198V6.15198ZM11.9103 4.56888V5.56888C13.2325 5.56888 14.3038 4.49683 14.3038 3.17499H13.3038H12.3038C12.3038 3.39279 12.1274 3.56888 11.9103 3.56888V4.56888ZM10.5168 3.17499H9.51682C9.51682 4.49683 10.5882 5.56888 11.9103 5.56888V4.56888V3.56888C11.6933 3.56888 11.5168 3.39279 11.5168 3.17499H10.5168ZM11.9103 1.78111V0.781113C10.5882 0.781113 9.51682 1.85315 9.51682 3.17499H10.5168H11.5168C11.5168 2.95719 11.6933 2.78111 11.9103 2.78111V1.78111ZM13.3038 3.17499H14.3038C14.3038 1.85315 13.2325 0.781113 11.9103 0.781113V1.78111V2.78111C12.1274 2.78111 12.3038 2.95719 12.3038 3.17499H13.3038ZM16 9.47007H15C15 9.77519 14.9053 10.0129 14.7261 10.201C14.5379 10.3984 14.1841 10.6149 13.5457 10.7222L13.7114 11.7083L13.8771 12.6945C14.8233 12.5356 15.6138 12.1684 16.1738 11.5809C16.7427 10.9841 17 10.2358 17 9.47007H16ZM12.6793 7.15198V8.15198C13.4169 8.15198 14.0416 8.36229 14.455 8.6509C14.8718 8.94184 15 9.24707 15 9.47007H16H17C17 8.41283 16.3849 7.55901 15.5998 7.01096C14.8114 6.46058 13.7757 6.15198 12.6793 6.15198V7.15198ZM7.88544 3.02446H6.88544C6.88544 3.80677 6.38363 4.19224 5.90986 4.19224V5.19224V6.19224C7.61826 6.19224 8.88544 4.77663 8.88544 3.02446H7.88544ZM5.90986 5.19224V4.19224C5.43609 4.19224 4.93427 3.80677 4.93427 3.02446H3.93427H2.93427C2.93427 4.77663 4.20146 6.19224 5.90986 6.19224V5.19224ZM3.93427 3.02446H4.93427C4.93427 2.63408 5.06459 2.39542 5.21012 2.25388C5.36181 2.10635 5.59673 2 5.90986 2V1V0C5.13189 0 4.37902 0.272266 3.81569 0.820156C3.2462 1.37404 2.93427 2.14761 2.93427 3.02446H3.93427ZM5.90986 1V2C6.22298 2 6.4579 2.10635 6.60959 2.25388C6.75512 2.39542 6.88544 2.63408 6.88544 3.02446H7.88544H8.88544C8.88544 2.14761 8.57352 1.37404 8.00402 0.820155C7.44069 0.272266 6.68782 0 5.90986 0V1ZM11.0586 10.3066H10.0586C10.0586 10.4889 9.98035 10.7841 9.39607 11.0887C8.7787 11.4106 7.70424 11.6667 6.02928 11.6667V12.6667V13.6667C7.85957 13.6667 9.29975 13.3944 10.3207 12.8621C11.3747 12.3126 12.0586 11.4277 12.0586 10.3066H11.0586ZM6.02928 12.6667V11.6667C4.35432 11.6667 3.27985 11.4106 2.66248 11.0887C2.0782 10.7841 2 10.4889 2 10.3066H1H0C0 11.4277 0.683809 12.3126 1.73785 12.8621C2.75881 13.3944 4.19899 13.6667 6.02928 13.6667V12.6667ZM1 10.3066H2C2 10.2712 2.0688 9.93205 2.89786 9.54299C3.64758 9.19116 4.75362 8.94645 6.02928 8.94645V7.94645V6.94645C4.52734 6.94645 3.11874 7.23007 2.04822 7.73243C1.05704 8.19757 0 9.03848 0 10.3066H1ZM6.02928 7.94645V8.94645C7.30494 8.94645 8.41097 9.19116 9.16069 9.54299C9.98976 9.93205 10.0586 10.2712 10.0586 10.3066H11.0586H12.0586C12.0586 9.03848 11.0015 8.19757 10.0103 7.73243C8.93982 7.23007 7.53121 6.94645 6.02928 6.94645V7.94645Z'
                fill='#551FB9'
              />
            </svg>

            <span>Collaboration</span>
          </LinkButton>
        </div>

        {/* Search Bar */}
        <div className='mb-16 flex w-full items-center gap-0 overflow-hidden rounded-lg border border-[#CDD5DF] bg-white'>
          {/* Search Input */}
          <div className='flex flex-1 items-center gap-2 px-4 py-3'>
            <BaseIcons value='search-large-outlined-black' />
            <input
              type='text'
              placeholder='Search businesses'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className='flex-1 border-none bg-transparent text-[16px] outline-none placeholder:text-[#94A3B8]'
            />
          </div>

          {/* All Dropdown */}
          <button className='flex items-center gap-2 border-l border-[#E3E8EF] px-4 py-3 text-[16px] hover:bg-gray-50'>
            <span>All</span>
            <BusinessCategoryIcons value='arrow-down' />
          </button>

          {/* Category Dropdown */}
          <button className='flex items-center gap-2 border-l border-[#E3E8EF] px-4 py-3 text-[16px] hover:bg-gray-50'>
            <span>Category</span>
            <BusinessCategoryIcons value='arrow-down' />
          </button>

          {/* Search Button */}
          <button className='bg-primary px-8 py-3 text-[16px] font-medium text-white hover:bg-primary/90'>
            Search
          </button>
        </div>
      </header>

      <div className='mx-auto w-full'>
        {isLoading ? (
          <div className='mt:px-0 container relative flex min-h-[20vh] w-full items-center justify-center'>
            {Array.from({ length: 4 }).map((_, key) => (
              <div key={key} className='basis-[70vw] pl-2 sm:basis-[280px]'>
                <ListingCardSkeleton classStyle='w-[70vw] !aspect-[4/5]' />
              </div>
            ))}
          </div>
        ) : categoriesWithBusinesses.length === 0 ? (
          <div className='mt:px-0 container relative flex min-h-[45vh] w-full flex-col items-center justify-center'>
            <EmptyState
              title='You have no saved businesses yet'
              description=''
              className=''
              headerClassName=''
              mediaClassName=''
              media={<EmptySavedBusinessesIcon />}
            />
          </div>
        ) : (
          categoriesWithBusinesses.map(category => (
            <div
              key={category.name}
              className='mt:px-0 relative flex w-full flex-col items-center justify-center'
            >
              <div className='flex w-full justify-between px-4'>
                <div className='flex items-center gap-1.5'>
                  <BusinessCategoryIcons
                    value={
                      category.name.toLowerCase() as BusinessCategoriesIconsType
                    }
                    className='size-5 text-[#5F2EEA]'
                  />
                  <h1 className='text-base font-semibold sm:text-xl'>
                    {convertToTitleCase(category.name)}
                  </h1>
                </div>
              </div>

              <div className='mb-20 flex w-full items-center'>
                <Carousel
                  opts={{ align: 'start', loop: false }}
                  className='w-full max-w-full px-2'
                >
                  <CarouselContent className='-ml-2 gap-4 p-4'>
                    {category.businesses.map((business, key) => (
                      <CarouselItem
                        key={business.id ?? key}
                        className='basis-[70vw] pl-2 sm:basis-[280px]'
                      >
                        <FeaturedListingCard business={business} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className='absolute left-2 top-1/2 z-10 -translate-y-1/2 max-md:hidden' />
                  <CarouselNext className='absolute right-2 top-1/2 z-10 -translate-y-1/2 max-md:hidden' />
                </Carousel>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
