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
              <CarouselPrevious className='absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 bg-white p-2 sm:flex'>
                <BaseIcons value='arrow-right-line-curve-black' />
              </CarouselPrevious>
              <CarouselNext className='absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 bg-white p-2 sm:flex'>
                <BaseIcons value='arrow-right-line-curve-black' />
              </CarouselNext>
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
                        className='basis-[70vw] pl-2 sm:basis-[300px]'
                      >
                        <ListingCardSkeleton classStyle='w-[70vw] sm:w-[300px] !aspect-[5/6]' />
                      </CarouselItem>
                    ))
                  : approved.map((business, key) => (
                      <CarouselItem
                        key={business.id ?? key}
                        className='basis-[70vw] pl-2 sm:basis-[300px]'
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
                <CarouselPrevious className='absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 bg-white p-2 sm:flex'>
                  <span
                    style={{
                      display: 'inline-block',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    <BaseIcons value='arrow-right-line-curve-black' />
                  </span>
                </CarouselPrevious>
                <CarouselNext className='absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 bg-white p-2 sm:flex'>
                  <BaseIcons value='arrow-right-line-curve-black' />
                </CarouselNext>
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

          <h1 className='-mb-16 mt-10 hidden md:text-lg xl:text-xl font-semibold sm:flex'>
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
                        className='basis-[70vw] pl-2 sm:basis-[300px]'
                      >
                        <ListingCardSkeleton classStyle='w-[70vw] sm:w-[300px] !aspect-[5/6]' />
                      </CarouselItem>
                    ))
                  : approved.map((business, key) => (
                      <CarouselItem
                        key={business.id ?? key}
                        className='basis-[70vw] pl-2 sm:basis-[300px]'
                      >
                        <FeaturedListingCard business={business} />
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious className='absolute left-2 top-1/2 z-10 -translate-y-1/2' />
              <CarouselNext className='absolute right-2 top-1/2 z-10 -translate-y-1/2' />
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

      <div className='mb-24 xl:mb-32 w-full py-10 sm:mb-10 sm:py-0'>
        <ThisWeeksTrends />
      </div>

      <div className='w-full py-20'>
        <BusinessLandingFAQs />
      </div>

      <div className='mb-1 w-full sm:mt-32 sm:h-[543px]'>
        <Image
          src={'/landingpage/first-banner.jpg'}
          alt=''
          width={700}
          height={400}
          className='hidden h-full w-full sm:flex'
          quality={100}
        />
        <Image
          src={'/landingpage/footer-image-mobile-1.jpg'}
          alt=''
          width={700}
          height={400}
          className='flex h-full w-full sm:hidden'
          quality={100}
        />
      </div>

      <div className='w-full sm:mb-0 sm:h-[217px] md:mb-10'>
        <Image
          src={'/landingpage/second-banner.jpg'}
          alt=''
          width={700}
          height={400}
          className='hidden h-full w-full sm:flex'
          quality={100}
        />
        <Image
          src={'/landingpage/footer-image-mobile-2.jpg'}
          alt=''
          width={700}
          height={400}
          className='flex h-full w-full sm:hidden'
          quality={100}
        />
      </div>

      <Footer />
    </main>
  );
}
