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
import { EmptyState } from '@/components/ui';
import { EmptySavedBusinessesIcon } from '../../misc/icons';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: savedBusinessesData, isLoading } = useSavedBusinesses(Boolean(session?.user?.accessToken || session?.user?.email));
  const [searchText, setSearchText] = useState('');
  
  // Group saved businesses by category
  const businessesByCategory = useMemo(() => {
    const savedBusinesses = savedBusinessesData?.data ?? [];
    const grouped: Record<string, BusinessSummary[]> = {};
    
    savedBusinesses.forEach((business) => {
      // Extract category name from business object
      const categoryName = (business as BusinessSummary & { category?: { name: string } }).category?.name || 'Uncategorized';
      
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
    <main className='relative flex flex-col items-center overflow-x-hidden'>
   
      {/* Header and Search */}
      <header className='z-10 mt-20 md:mt-28 w-full px-4 sm:max-w-[1540px] sm:px-0'>
        <div className='mb-6 flex w-full items-center justify-between'>
          <h1 className='font-inter text-xl font-semibold text-black sm:text-2xl'>
            Saved Businesses
          </h1>
          <button
            className='flex items-center justify-center gap-2 rounded-lg border-[1px] border-[#D9D6FE] bg-primary/10 px-4 py-3 text-[14px] font-semibold text-primary transition-colors hover:bg-primary/20 sm:h-[52px] sm:w-[167px] sm:text-[16px]'
            onClick={() => router.push('/business/collaboration')}
          >
            <BaseIcons value='people-outlined-primary' />
            <span>Collaboration</span>
          </button>
        </div>
        
        {/* Search Bar */}
        <div className='mb-16 flex w-full items-center gap-0 rounded-lg border border-[#CDD5DF] bg-white overflow-hidden'>
          {/* Search Input */}
          <div className='flex flex-1 items-center gap-2 px-4 py-3'>
            <BaseIcons value='search-large-outlined-black' />
            <input
              type='text'
              placeholder='Search businesses'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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

      {/* Dynamically render categories with saved businesses */}
      {isLoading ? (
        <div className='container mt:px-0 relative flex w-full flex-col items-center justify-center min-h-[45vh] '>
          <p className='text-center text-gray-500'>Loading saved businesses...</p>
        </div>
      ) : categoriesWithBusinesses.length === 0 ? (
        <div className='container mt:px-0 relative flex w-full flex-col items-center justify-center min-h-[45vh]'>
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
        categoriesWithBusinesses.map((category, categoryIndex) => (
          <div key={category.name} className='mt:px-0 relative flex w-full flex-col items-center justify-center sm:w-[1540px]'>
            <div className='flex w-full justify-between'>
              <div className='flex items-center gap-2'>
                <BaseIcons value='beauty-outlined-primary' />
                <h1 className='text-[16px] font-bold sm:text-2xl'>
                  {category.name}
                </h1>
              </div>
            </div>

            <div className='-mt-14 flex w-[393px] items-center sm:w-[1560px]'>
              <Swiper
                centerInsufficientSlides={false}
                navigation={{
                  nextEl: `.category-${categoryIndex}-next`,
                  prevEl: `.category-${categoryIndex}-prev`,
                }}
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                slidesPerView={4}
                spaceBetween={7}
                scrollbar={false}
                className='relative h-[599px]'
                breakpoints={{
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 7,
                  },
                }}
              >
                <div className='absolute top-0 z-10 -translate-y-1/2 sm:right-14 sm:top-[57px]'>
                  <button className={`category-${categoryIndex}-prev rotate-180 transition-transform`}>
                    <BaseIcons value='arrow-long-right-black' />
                  </button>
                </div>

                <div className='absolute right-0 z-10 -translate-y-1/2 sm:top-14'>
                  <button className={`category-${categoryIndex}-next rounded-full px-4 py-2`}>
                    <BaseIcons value='arrow-long-right-black' />
                  </button>
                </div>
                
                {category.businesses.map((business) => (
                  <SwiperSlide
                    key={business.id}
                    className='flex items-center justify-center px-10 pt-10'
                  >
                    <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                      <FeaturedListingCard
                        business={business}
                        group={true}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ))
      )}

    </main>
  );
}
