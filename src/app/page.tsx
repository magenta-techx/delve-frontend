'use client';
import { BaseIcons } from '@/assets/icons/base/Icons';
import BlogCard from '@/app/(clients)/misc/components/BlogCard';
import CategoryCard from '@/app/(clients)/misc/components/CategoryCard';
// import LocationCard from '@/components/cards/LocationCard';
import { CLientsLandingFAQs } from '@/app/(clients)/misc/components';
import SectionHeader from '@/components/SectionHeader';
import ThisWeeksTrends from '@/app/(clients)/misc/components/ThisWeeksTrends';
// import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

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
  type CarouselApi,
} from '@/components/ui';
import ListingCardSkeleton from './(clients)/misc/components/ListingCardSkeleton';
import { useIsMobile } from '@/hooks';
import { useEffect, useState } from 'react';
import { LogoIcon } from '@/assets/icons';

export default function HomePage() {
  const { data: categoriesResp, isLoading: loadingCategories } =
    useBusinessCategories();
  const categories = categoriesResp?.data ?? [];
  const { data: approvedResp, isLoading: loadingApproved } =
    useApprovedBusinesses();
  const approved = approvedResp?.data ?? [];
  // const _isEmptyApproved = !loadingApproved && approved.length === 0;

  const { isMobile, isLoading: calculatingScreenWidth } = useIsMobile();
  const [sponsoredCarouselApi, setSponsoredCarouselApi] =
    useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!sponsoredCarouselApi) return;

    const updateScrollState = () => {
      setCanScrollPrev(sponsoredCarouselApi.canScrollPrev());
      setCanScrollNext(sponsoredCarouselApi.canScrollNext());
    };

    updateScrollState();
    sponsoredCarouselApi.on('select', updateScrollState);
    sponsoredCarouselApi.on('reInit', updateScrollState);

    return () => {
      sponsoredCarouselApi.off('select', updateScrollState);
      sponsoredCarouselApi.off('reInit', updateScrollState);
    };
  }, [sponsoredCarouselApi]);

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
      <section className='relative flex w-screen flex-col items-center bg-cover bg-no-repeat sm:h-[85vh] sm:bg-[url("/landingpage/landing-page-hero-image.jpg")]'>
        <LandingPageNavbar />
        <section />
        {/* Mobile hero  */}
        <div className='relative flex h-[756px] w-full rounded-2xl bg-[url("/landingpage/landing-pagemobile-hero.jpg")] bg-cover bg-no-repeat sm:hidden'>
          <div className='insert-0 absolute top-0 flex h-full w-full rounded-2xl bg-black/60 sm:rounded-none'></div>
        </div>

        {/* Desktop Hero  */}
        <div className='insert-0 absolute hidden w-full rounded-2xl bg-[#000000B8] sm:top-0 sm:flex sm:h-[85vh] sm:rounded-none'></div>

        {/* Hero section  */}
        <div className='absolute top-[20.5rem] flex w-full flex-col items-center sm:top-[22.8rem]'>
          <h1 className='text-balance text-center font-karma text-4xl font-bold text-white sm:text-5xl'>
            Great experiences start here.
          </h1>
          <p className='px-14 text-center font-inter text-[14px] text-white sm:-mt-2 sm:text-[19px]'>
            Delve helps you find reliable vendors who turn plans into beautiful
            memories.
          </p>
          <div className='mt-5'>
            <BusinessSearch />
          </div>
        </div>
      </section>

      <div className='flex w-full flex-col items-center pt-8 sm:pb-12 sm:pt-16'>
        <SectionHeader
          header='Whatever you’re looking for, find it here.'
          paragraph='category'
        />

        <div className='container mb-20 mt-10 flex w-full items-center gap-14 px-2 sm:px-0 lg:max-2xl:px-12'>
          <div className='relative w-full'>
            <Carousel opts={{ align: 'start', loop: false }} className='w-full'>
              <CarouselContent className='-ml-2'>
                {loadingCategories
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <CarouselItem
                        key={idx}
                        className='flex basis-[45vw] items-center justify-center pl-2 sm:basis-[320px] xl:basis-1/5'
                      >
                        <div className='flex flex-col items-center justify-center gap-2'>
                          <div className='mb-2 size-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 lg:size-40 xl:size-44'></div>
                        </div>
                      </CarouselItem>
                    ))
                  : categories.map(category => {
                      const iconName = category.name
                        ?.split(' ')[0]
                        ?.toLowerCase() as CategoryIconType;
                      return (
                        <CarouselItem
                          key={category.id}
                          className='flex basis-[29vw] items-center justify-center px-4 sm:px-6 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:px-10'
                        >
                          <CategoryCard
                            title={category.name}
                            imageSrc={`/categories/${iconName}.jpg`}
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
      <div className='flex w-full flex-col items-center pt-7 sm:pt-16'>
        <SectionHeader
          header='Trusted by dozens of happy clients. '
          paragraph='Featured Listing'
        />

        <div className='relative mt-3 flex w-full items-center justify-center xl:mt-9'>
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
              className='container mx-auto w-[90vw] max-xl:px-2 xl:w-[85vw] '
            >
              <CarouselContent className='-ml-2 gap-2 py-4'>
                {loadingApproved
                  ? Array.from({ length: 6 }).map((_, key) => (
                      <CarouselItem
                        key={key}
                        className='basis-[70vw] pl-2 sm:basis-[300px] xl:basis-[33%] xl:px-3.5'
                      >
                        <ListingCardSkeleton classStyle='w-full sm:w-[300px] xl:w-full !aspect-[342/427]' />
                      </CarouselItem>
                    ))
                  : approved.map((business, key) => (
                      <CarouselItem
                        key={business.id ?? key}
                        className='basis-[70vw] pl-2 sm:basis-[300px] xl:basis-[33%] xl:px-3.5'
                      >
                        <FeaturedListingCard business={business} isBigCard />
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious className='absolute -left-5 bottom-0 top-0 z-10 hidden h-full translate-y-0 flex-col items-center justify-center rounded-none border-none bg-white p-2 shadow-none sm:flex 2xl:-left-10' />
              <CarouselNext className='absolute -right-5 bottom-0 top-0 z-10 hidden h-full translate-y-0 flex-col items-center justify-center rounded-none border-none bg-white p-2 shadow-none sm:flex 2xl:-right-10' />
            </Carousel>
          </div>
        </div>

        {/* Serch By location  */}
        <div className='container mb-10 lg:max-xl:px-12'>
          <header className='flex items-center justify-between'>
            <h1 className='px-4 font-inter text-xl font-bold md:text-2xl'>
              Search by location
            </h1>

            <div className='flex items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link
                href={'/businesses/search'}
                className='text-[12px] uppercase sm:text-[16px]'
              >
                See all locations
              </Link>
            </div>
          </header>

          <div className='mb-4 flex w-full items-center gap-10 px-2 sm:mb-20 sm:px-0'>
            <div className='relative w-full'>
              <Carousel
                opts={{ align: 'start', loop: false }}
                className='w-full'
              >
                <CarouselContent className='-ml-2 p-2'>
                  {LOCATIONS.map((location, key) => (
                    <CarouselItem
                      key={key}
                      className='flex basis-36 items-center justify-center px-1.5 sm:basis-[25%]'
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
        <div className='container relative'>
          <SectionHeader header='Sponsored Picks' paragraph='Spotlight' />

          <header className='mb-4 mt-10 flex items-center justify-between font-semibold sm:flex md:text-lg xl:text-xl'>
            <h1>Hot deals and events you don&apos;t want to miss</h1>
            <div className='hidden items-center gap-2 sm:flex'>
              <button
                onClick={() => sponsoredCarouselApi?.scrollPrev()}
                className='rotate-180 rounded-none border-none bg-transparent p-2 disabled:opacity-50'
                disabled={!canScrollPrev}
              >
                <BaseIcons value='arrow-right-solid-black' />
              </button>
              <button
                onClick={() => sponsoredCarouselApi?.scrollNext()}
                className='rounded-none border-none bg-transparent p-2 disabled:opacity-50'
                disabled={!canScrollNext}
              >
                <BaseIcons value='arrow-right-solid-black' />
              </button>
            </div>
          </header>

          <div className='flex w-full items-center'>
            <Carousel
              opts={{ align: 'start', loop: false }}
              className='w-full max-w-full'
              setApi={setSponsoredCarouselApi}
            >
              <CarouselContent className='-ml-4 sm:gap-x-2'>
                {sponsoredAds?.data.map((sponsored, key) => {
                  return (
                    <CarouselItem
                      key={key}
                      className='basis-[90vw] pl-0 sm:basis-1/2'
                    >
                      <div className='flex w-full items-center justify-center'>
                        <SponsoredAdsCard ad={sponsored} />
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>

      <div className='container flex w-full flex-col items-center pt-8 pb-14'>
        <div className='flex items-center justify-between lg:justify-center gap-6 pb-6 mb-20 md:mt-24 md:mb-28 max-sm:px-5 lg:gap-72 w-full '>
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
          <header className='flex w-full items-center justify-between px-4 mb-3'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='stars-primary' />
              <h1 className='text-base font-semibold sm:text-2xl'>
                Listings around you
              </h1>
            </div>
            <div className='flex items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/businesss/explore'} className='text-[12px] uppercase sm:text-[16px]'>
                See all listings
              </Link>
            </div>
          </header>

          <div className='mb-20 flex w-full items-center'>
            <Carousel
              opts={{ align: 'start', loop: false }}
              className='w-full max-w-full px-2'
            >
              <CarouselContent className='-ml-2 w-full gap-1.5'>
                {loadingApproved
                  ? Array.from({ length: 6 }).map((_, key) => (
                      <CarouselItem
                        key={key}
                        className='basis-[70vw] pl-2 sm:basis-[300px] xl:basis-[380px] 2xl:px-4'
                      >
                        <ListingCardSkeleton classStyle='w-[70vw] sm:w-[300px] xl:w-[380px] !aspect-[342/427]' />
                      </CarouselItem>
                    ))
                  : approved.map((business, key) => (
                      <CarouselItem
                        key={business.id ?? key}
                        className='basis-[70vw] sm:basis-[300px] xl:basis-[25%] 2xl:px-2.5'
                      >
                        <FeaturedListingCard business={business} />
                      </CarouselItem>
                    ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      </div>

      <div className='container mb-20 flex w-full flex-col items-center px-4 sm:-mt-0 sm:mb-32 sm:px-0'>
        <h1 className='font-karma text-2xl max-sm:font-medium sm:text-[44px]'>
          Tips, Trends & Vendor Stories
        </h1>
        <p className='mb-10 font-inter text-[13px] sm:text-[18px]'>
          Explore expert tips, trending event ideas, beauty routines, and vendor
          success stories all curated for you.
        </p>

        <div className='flex w-full flex-col items-center gap-x-10 lg:flex-row'>
          <BlogCard
            imageUrl={'/landingpage/stories-1.jpg'}
            header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025'
            containerClassStyle='w-full h-[422px] sm:h-[740px]  lg:basis-[60%]'
            imageClassStyle=' sm:h-[440px] w-full'
          />
          <BlogCard
            imageUrl={'/landingpage/stories-2.jpg'}
            header='Skipping Sunscreen'
            containerClassStyle=' sm:flex hidden h-[740px]  lg:basis-[40%]'
            imageClassStyle='  h-[440px] w-full'
          />
        </div>
      </div>

        <ThisWeeksTrends />
  

      <div className='w-full pt-10' id='faqs'>
        <CLientsLandingFAQs />
      </div>

      <div className='relative mb-1 flex w-full flex-col items-center justify-center gap-6 py-10 sm:mt-32 sm:min-h-[543px] sm:py-16'>
        <div className='absolute inset-0'>
          <Image
            src={'/landingpage/prefooter-banner.jpg'}
            alt=''
            fill
            style={{ objectFit: 'cover' }}
            className='h-full w-full'
            quality={100}
          />
        </div>
        <div className='absolute inset-0 z-[2] bg-[#000000BF]' />

        <div className='z-20 flex flex-col items-center justify-center gap-1 px-4 text-center text-white'>
          <LogoIcon />
          <p className='text-sm sm:text-base'>Clients</p>
          <p className='mt-2 text-sm sm:mt-4 sm:text-lg xl:text-xl'>
            Built for businesses that serve with heart
          </p>
        </div>

        {/* Infinite Marquee */}
        <div className='z-10 w-full overflow-hidden'>
          <div className='flex w-max animate-marquee items-center'>
            {/* First set of logos */}
            {[
              "/logo-1.png",
              "/logo-2.png",
              "/logo-3.png",
              "/logo-4.png",
              "/logo-5.png",
            ]?.map((logo, idx) => (
              <div
                key={`first-${idx}`}
                className='relative mx-4 h-10 w-20 flex-shrink-0 sm:mx-8 sm:h-16 sm:w-32 md:mx-10 xl:mx-16'
              >
                <Image
                  src={logo!}
                  alt={'Business logo'}
                  fill
                  className='object-contain'
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {[
              "/logo-1.png",
              "/logo-2.png",
              "/logo-3.png",
              "/logo-4.png",
              "/logo-5.png",
            ]?.map((logo, idx) => (
              <div
                key={`first-${idx}`}
                className='relative mx-4 h-10 w-20 flex-shrink-0 sm:mx-8 sm:h-16 sm:w-32 md:mx-10 xl:mx-16'
              >
                <Image
                  src={logo!}
                  alt={'Business logo'}
                  fill
                  className='object-contain'
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
