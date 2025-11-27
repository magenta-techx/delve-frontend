'use client';
import { BaseIcons } from '@/assets/icons/base/Icons';
import BlogCard from '@/components/cards/BlogCard';
import CategoryCard from '@/app/(clients)/misc/components/CategoryCard';
// import LocationCard from '@/components/cards/LocationCard';
import { BusinessLandingFAQs } from '@/app/(clients)/misc/components';
import SectionHeader from '@/components/SectionHeader';
import ThisWeeksTrends from '@/app/(clients)/misc/components/ThisWeeksTrends';
// import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import {
  BusinessSearch,
  Footer,
  LandingPageNavbar,
  FeaturedListingCard,
} from './(clients)/misc/components';
import { useBusinessCategories } from '@/app/(clients)/misc/api/metadata';
import {
  BusinessCategoryIcons,
  BusinessCategoriesIconsType as CategoryIconType,
} from '@/assets/icons/business/BusinessCategoriesIcon';
import LocationCard from '@/components/cards/LocationCard';
import { useSponsoredAds } from './(clients)/misc/api/sponsored';
import { useApprovedBusinesses, useEvents } from './(clients)/misc/api';
import SponsoredAdsCard from './(clients)/misc/components/SponsoredCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui';
import ListingCardSkeleton from './(clients)/misc/components/ListingCardSkeleton';
import { useIsMobile } from '@/hooks';
import { CarouselArrowIcon } from './(clients)/misc/icons';

export default function HomePage() {
  const { data: categoriesResp, isLoading: loadingCategories } =
    useBusinessCategories();
  const categories = categoriesResp?.data ?? [];
  const { data: approvedResp, isLoading: loadingApproved } =
    useApprovedBusinesses();
  const approved = approvedResp?.data ?? [];
  // const _isEmptyApproved = !loadingApproved && approved.length === 0;

  const { isMobile, isLoading: calculatingScreenWidth } = useIsMobile();

  const LOCATIONS = [
    { name: 'Lagos', imageUrl: '/locations/Lagos.jpg' },
    { name: 'Abuja', imageUrl: '/locations/Abuja.jpg' },
    { name: 'Ibadan', imageUrl: '/locations/Ibadan.jpg' },
    { name: 'Port Harcourt', imageUrl: '/locations/Lagos.jpg' },
  ];

  const STATS = [
    {
      count: '72+',
      desc: 'Business visits',
    },
    {
      count: '612+',
      desc: 'Message sent',
    },
    {
      count: '72+',
      desc: 'Business rating',
    },
  ];

  const { data: sponsoredAds } = useSponsoredAds();
  const {} = useEvents('Lagos');

  return (
    <main className='relative flex flex-col items-center overflow-x-hidden'>
      <section className='relative flex h-[110vh] w-screen flex-col items-center bg-cover bg-no-repeat sm:h-[90.5vh] sm:bg-[url("/landingpage/landing-page-hero-image.jpg")]'>
        <LandingPageNavbar />
        <section />
        {/* Mobile hero  */}
        <div className='relative flex h-[756px] w-full rounded-2xl bg-[url("/landingpage/landing-pagemobile-hero.jpg")] bg-cover bg-no-repeat sm:hidden'>
          <div className='insert-0 absolute top-0 flex h-full w-full rounded-2xl bg-black/60 sm:rounded-none'></div>
        </div>

        {/* Desktop Hero  */}
        <div className='insert-0 absolute hidden w-full rounded-2xl bg-[#000000B8] sm:top-0 sm:flex sm:h-[90.5vh] sm:rounded-none'></div>

        {/* Hero section  */}
        <div className='absolute top-[20.5rem] flex w-full flex-col items-center sm:top-[22.8rem]'>
          <h1 className='text-balance text-center font-karma text-4xl font-bold text-white sm:text-5xl lg:text-6xl'>
            Great experiences start here.
          </h1>
          <p className='px-14 text-center font-inter text-[14px] text-white sm:-mt-2 sm:text-[19px]'>
            Delve helps you find reliable vendors who turn plans into beautiful
            memories.
          </p>
          <div className='mt-12'>
            <BusinessSearch />
          </div>
        </div>
      </section>

      <div className='flex w-full flex-col items-center pt-8 sm:py-20'>
        <SectionHeader
          iconValue='category-yellow'
          header='Whatever you’re looking for, find it here.'
          paragraph='category'
        />

        <div className='mb-20 mt-10 flex w-full items-center gap-14 px-2 sm:w-[85vw] sm:max-w-[1485px] sm:px-0'>
          <div className='relative w-full'>
            <Carousel opts={{ align: 'start', loop: false }} className='w-full'>
              <CarouselContent className='-ml-2'>
                {loadingCategories
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <CarouselItem
                        key={idx}
                        className='flex basis-[60vw] items-center justify-center pl-2 sm:basis-[320px]'
                      >
                        <div className='flex flex-col items-center justify-center gap-2'>
                          <div className='mb-2 size-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 lg:size-40'></div>
                        </div>
                      </CarouselItem>
                    ))
                  : categories.map(category => {
                      const iconName = category.name
                        ?.split(' ')[0]
                        ?.toLowerCase() as CategoryIconType;
                      return (
                        <div
                          className='px-4 sm:px-10 md:px-12 xl:px-16'
                          key={category.id}
                        >
                          <CarouselItem className='flex basis-32 items-center justify-center sm:basis-48'>
                            <CategoryCard
                              title={category.name}
                              icon={
                                <BusinessCategoryIcons
                                  className='size-12 text-white'
                                  value={iconName}
                                />
                              }
                              hoverIcon={
                                <BusinessCategoryIcons value={iconName} />
                              }
                            />
                          </CarouselItem>
                        </div>
                      );
                    })}
              </CarouselContent>
              <CarouselPrevious className='absolute bottom-0 left-0 top-0 z-10 hidden h-full translate-y-0 flex-col items-center justify-center rounded-none border-none bg-white p-2 shadow-none sm:flex' />
              <CarouselNext className='absolute bottom-0 right-0 top-0 z-10 hidden h-full translate-y-0 flex-col items-center justify-center rounded-none border-none bg-white p-2 shadow-none sm:flex' />
            </Carousel>
          </div>
        </div>
      </div>

      {/* featured listings  */}
      <div className='flex w-full flex-col items-center bg-[#FFF4ED] py-7 sm:py-20'>
        <SectionHeader
          iconValue='listing-yellow'
          header='Trusted by dozens of happy clients. '
          paragraph='Featured Listing'
        />

        <div className='relative flex w-full items-center justify-center'>
          <div className='mb-20 flex w-full items-center'>
            <Carousel
              opts={{
                align: calculatingScreenWidth
                  ? 'start'
                  : !isMobile
                    ? 'center'
                    : 'start',
                loop: false,
              }}
              className='container mx-auto w-[90vw] px-2'
            >
              <CarouselContent className='-ml-2 gap-4 py-4'>
                {loadingApproved
                  ? Array.from({ length: 6 }).map((_, key) => (
                      <CarouselItem
                        key={key}
                        className='basis-[70vw] px-2 sm:basis-[300px] xl:basis-[380px] 2xl:basis-[420px] 2xl:px-4'
                      >
                        <ListingCardSkeleton classStyle='w-[70vw] sm:w-[300px] xl:w-[380px] 2xl:w-[420px] !aspect-[5/6]' />
                      </CarouselItem>
                    ))
                  : approved.map((business, key) => (
                      <CarouselItem
                        key={business.id ?? key}
                        className='basis-[70vw] pl-2 sm:basis-[300px] xl:basis-[380px] 2xl:basis-[420px] 2xl:px-4'
                      >
                        <FeaturedListingCard business={business} />
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious className='absolute -left-5 2xl:-left-10 bottom-0 top-0 z-10 hidden h-full translate-y-0 flex-col items-center justify-center rounded-none border-none bg-[#FFF4ED] p-2 shadow-none sm:flex' />
              <CarouselNext className='absolute -right-5 2xl:-right-10 bottom-0 top-0 z-10 hidden h-full translate-y-0 flex-col items-center justify-center rounded-none border-none bg-[#FFF4ED] p-2 shadow-none sm:flex' />
            </Carousel>
          </div>
        </div>

        {/* Serch By location  */}
        <div className='container mb-10'>
          <h1 className='px-4 font-inter text-xl font-bold md:text-2xl'>
            Search by location
          </h1>

          <div className='container mb-20 flex w-full items-center gap-10 px-2 sm:px-0'>
            <div className='relative w-full'>
              <Carousel
                opts={{ align: 'start', loop: false }}
                className='w-full'
              >
                <CarouselContent className='-ml-2 p-2'>
                  {LOCATIONS.map((location, key) => (
                    <CarouselItem
                      key={key}
                      className='flex basis-36 items-center justify-center px-1.5 lg:basis-[25%]'
                    >
                      <LocationCard
                        key={key}
                        name={location.name}
                        imageUrl={location.imageUrl}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>

        {/* Sponsored picks  */}
        <div className='container relative lg:px-10'>
          <SectionHeader
            iconValue='listing-yellow'
            header='Sponsored Picks'
            paragraph='Spotlight'
          />

          <h1 className='-mb-16 mt-10 hidden font-semibold sm:flex md:text-lg xl:text-xl'>
            Hot deals and events you don’t want to miss
          </h1>
          <div className='flex items-center gap-3 px-4 sm:px-0'>
            <Swiper
              centerInsufficientSlides={false}
              navigation={{
                nextEl: '.sponsored-next',
                prevEl: '.sponsored-prev',
              }}
              // install Swiper modules
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={10}
              slidesPerView={2}
              breakpoints={{
                300: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
              }}
              scrollbar={false}
              onSwiper={swiper => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
              // className='h-[700px] bg-green-300'
              className='-mt-5 flex h-full w-[354px] items-center justify-center pb-20 sm:mt-3 sm:h-[589px] sm:w-[1485px]'
            >
              <div className='absolute top-16 z-10 -translate-y-1/2 sm:right-14 sm:top-[37px]'>
                <button className='sponsored-prev rotate-180 transition-transform'>
                  <BaseIcons value='arrow-right-solid-black' />
                </button>
              </div>
              {/* <div className="absolute left-0 sm:left-32 z-10 sm:top-14 top-16 -translate-y-1/2">
                <button className="sponsored-prev transition-transform rotate-180">
                  <BaseIcons value='arrow-right-solid-black' />
                </button>
              </div> */}
              <div className='absolute right-0 top-16 z-10 -mt-[2px] -translate-y-1/2 sm:top-[37px]'>
                <button className='sponsored-next rounded-full px-4 py-2'>
                  <BaseIcons value='arrow-right-solid-black' />
                </button>
              </div>
              {sponsoredAds?.data.map((sponsored, key) => {
                return (
                  <SwiperSlide
                    key={key}
                    className='flex items-center justify-center pt-20'
                  >
                    <div className='flex w-full items-center justify-center'>
                      <SponsoredAdsCard key={key} ad={sponsored} />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>

      <div className='container flex w-full flex-col items-center py-14'>
        <div className='mb-20 flex items-center gap-6 sm:mb-40 sm:gap-72'>
          {STATS.map((stat, key) => {
            return (
              <div key={key} className='flex flex-col items-center'>
                <h1 className='font-karma text-[30px] font-semibold sm:-mb-5 sm:text-[48px]'>
                  {stat.count}
                </h1>
                <small className='text-[#697586]'>{stat.desc}</small>
              </div>
            );
          })}
        </div>

        <section className='mt:px-0 container relative flex w-full flex-col items-center justify-between'>
          <header className='flex w-full items-center justify-between px-4'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='stars-primary' />
              <h1 className='text-base font-semibold sm:text-2xl'>
                Listings around you
              </h1>
            </div>
            <div className='flex items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/'} className='text-[12px] uppercase sm:text-[16px]'>
                See all listings
              </Link>
            </div>
          </header>

          <div className='mb-20 flex w-full items-center'>
            <Carousel
              opts={{ align: 'start', loop: false }}
              className='w-full max-w-full px-2'
            >
              <CarouselContent className='-ml-2 w-full gap-4 p-4'>
                {loadingApproved
                  ? Array.from({ length: 6 }).map((_, key) => (
                      <CarouselItem
                        key={key}
                        className='basis-[70vw] pl-2 sm:basis-[300px] xl:basis-[380px] 2xl:px-4'
                      >
                        <ListingCardSkeleton classStyle='w-[70vw] sm:w-[300px] xl:w-[380px] !aspect-[5/6]' />
                      </CarouselItem>
                    ))
                  : approved.map((business, key) => (
                      <CarouselItem
                        key={business.id ?? key}
                        className='basis-[70vw] pl-2 sm:basis-[300px] xl:basis-[380px] 2xl:px-4'
                      >
                        <FeaturedListingCard business={business} />
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious className='absolute -left-5 2xl:-left-10 bottom-0 top-0 z-10 hidden h-full translate-y-0 flex-col items-center justify-center rounded-none border-none bg-white p-2 shadow-none sm:flex' />
              <CarouselNext className='absolute -right-5 2xl:-right-10 bottom-0 top-0 z-10 hidden h-full translate-y-0 flex-col items-center justify-center rounded-none border-none bg-white p-2 shadow-none sm:flex' />
            </Carousel>
          </div>
        </section>
      </div>

      <div className='container -mt-20 mb-20 flex w-full flex-col items-center px-4 sm:-mt-0 sm:mb-32 sm:px-0'>
        <h1 className='font-karma text-[24px] font-semibold sm:text-[52px]'>
          Tips, Trends & Vendor Stories
        </h1>
        <p className='mb-10 font-inter text-[13px] sm:text-[18px]'>
          Explore expert tips, trending event ideas, beauty routines, and vendor
          success stories all curated for you.
        </p>

        <div className='flex w-full items-center gap-10'>
          <BlogCard
            imageUrl={'/landingpage/stories-1.jpg'}
            header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025'
            containerClassStyle='w-full h-[422px] sm:w-[816px] sm:h-[740px]'
            imageClassStyle=' sm:h-[440px] w-full'
          />
          <BlogCard
            imageUrl={'/landingpage/stories-2.jpg'}
            header='Skipping Sunscreen'
            containerClassStyle='w-[647px] sm:flex hidden h-[740px]'
            imageClassStyle='  h-[440px] '
          />
        </div>
      </div>

      <div className='mb-24 w-full py-10 sm:mb-10 sm:py-0 xl:mb-32'>
        <ThisWeeksTrends />
      </div>

      <div className='w-full py-20'>
        <BusinessLandingFAQs />
      </div>

      <div className='relative mb-1 flex w-full flex-col items-center justify-evenly sm:mt-32 sm:h-[543px]'>
        <div className='absolute inset-0 top-0'>
          <Image
            src={'/landingpage/prefooter-banner.jpg'}
            alt=''
            fill
            objectFit='cover'
            className='h-full w-full'
            quality={100}
          />
        </div>
        <div className='absolute inset-0 top-0 z-[2] bg-[#000000BF]' />

        <div className='z-20 mb-8 flex flex-col items-center justify-center gap-1 text-white'>
          <svg
            width='31'
            height='34'
            viewBox='0 0 31 34'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M13.3333 16.6667C17.9357 16.6667 21.6667 12.9357 21.6667 8.33333C21.6667 3.73096 17.9357 0 13.3333 0C8.73096 0 5 3.73096 5 8.33333C5 12.9357 8.73096 16.6667 13.3333 16.6667ZM13.3333 14.1667C16.555 14.1667 19.1667 11.555 19.1667 8.33333C19.1667 5.11167 16.555 2.5 13.3333 2.5C10.1117 2.5 7.5 5.11167 7.5 8.33333C7.5 11.555 10.1117 14.1667 13.3333 14.1667Z'
              fill='#FEC601'
            />
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M13.3333 33.3333C20.6971 33.3333 26.6667 29.9755 26.6667 25.8333C26.6667 21.6912 20.6971 18.3333 13.3333 18.3333C5.96954 18.3333 0 21.6912 0 25.8333C0 29.9755 5.96954 33.3333 13.3333 33.3333ZM21.5358 28.9577C23.5878 27.8034 24.1667 26.6001 24.1667 25.8333C24.1667 25.0666 23.5878 23.8632 21.5358 22.709C19.5621 21.5988 16.6672 20.8333 13.3333 20.8333C9.99948 20.8333 7.10456 21.5988 5.1309 22.709C3.07888 23.8632 2.5 25.0666 2.5 25.8333C2.5 26.6001 3.07888 27.8034 5.1309 28.9577C7.10456 30.0679 9.99948 30.8333 13.3333 30.8333C16.6672 30.8333 19.5621 30.0679 21.5358 28.9577Z'
              fill='#FEC601'
            />
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M20.1914 16.2588C19.7536 14.4414 20.8543 12.5535 22.7254 12.5016L22.7632 12.5009C22.8023 12.5003 22.8419 12.5 22.8822 12.5C23.4712 12.5 24.0114 12.7228 24.4107 12.9514C24.6204 13.0716 24.8989 13.1494 25.1406 13.1494C25.3824 13.1494 25.5708 13.0716 25.7806 12.9514C26.1798 12.7228 26.72 12.5 27.309 12.5C27.3493 12.5 27.389 12.5003 27.4281 12.5009C29.3221 12.5282 30.4406 14.4292 29.9999 16.2588C29.5118 18.285 26.6566 20.0811 25.5415 20.7146C25.263 20.8729 24.9283 20.8729 24.6497 20.7146C23.5347 20.0811 20.6794 18.285 20.1914 16.2588ZM23.1684 15.1209C23.7352 15.4455 24.4394 15.6494 25.1406 15.6494C26.0054 15.6494 26.6398 15.3403 27.0229 15.1209C27.1088 15.0717 27.1864 15.0371 27.2484 15.0169C27.2878 15.0041 27.3095 15.0007 27.3149 15C27.3413 15 27.3669 15.0002 27.392 15.0006C27.4201 15.001 27.436 15.0052 27.436 15.0052L27.4387 15.0061C27.4387 15.0061 27.4458 15.0102 27.4551 15.0192C27.4647 15.0285 27.479 15.0445 27.4954 15.0695C27.569 15.1825 27.6337 15.4062 27.5694 15.6734C27.5193 15.8813 27.2098 16.4005 26.3814 17.1087C25.9567 17.4717 25.5004 17.7963 25.0956 18.06C24.6908 17.7963 24.2346 17.4717 23.8099 17.1087C22.9815 16.4005 22.672 15.8813 22.6219 15.6734C22.5575 15.4062 22.6222 15.1825 22.6958 15.0695C22.7122 15.0445 22.7265 15.0285 22.7361 15.0192C22.7455 15.0102 22.7517 15.0065 22.7517 15.0065L22.7553 15.0052C22.7553 15.0052 22.7712 15.001 22.7992 15.0006C22.8243 15.0002 22.85 15 22.8763 15C22.8818 15.0007 22.9035 15.0041 22.9429 15.0169C23.0049 15.0371 23.0824 15.0717 23.1684 15.1209Z'
              fill='#FEC601'
            />
          </svg>
          <p>Clients</p>
          <p className='mt-4 text-lg xl:text-xl'>
            Built for businesses that serve with heart
          </p>
        </div>
        <div className='z-10 flex items-center justify-center gap-4 md:gap-10 xl:gap-20'>
          {approved?.map((business, idx) => (
            <div key={idx} className='relative h-16 w-32'>
              <Image
                src={business.logo!}
                alt=''
                fill
                className='object-contain'
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
