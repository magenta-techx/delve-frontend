'use client';
import { BaseIcons } from '@/assets/icons/base/Icons';
import BlogCard from '@/components/cards/BlogCard';
import CategoryCard from '@/components/cards/CategoryCard';
// import LocationCard from '@/components/cards/LocationCard';
import { BusinessLandingFAQs } from '@/app/(clients)/misc/components';
import SectionHeader from '@/components/SectionHeader';
import ThisWeeksTrends from '@/components/landing-page/ThisWeeksTrends';
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
import { useEvents } from './(clients)/misc/api';
import SponsoredAdsCard from './(clients)/misc/components/SponsoredCard';

export default function HomePage(): JSX.Element {
  // Fetch categories from backend
  const { data: categoriesResp, isLoading: loadingCategories } =
    useBusinessCategories();
  const categories = categoriesResp?.data ?? [];

  const FEATURED_LISTINGS = [
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
  ];
  const LISTINGS_AROUND = [
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
    {
      header: 'Aura Bloom Spa',
      desc: 'At Aura Bloom Spa, we believe relaxation is more than a luxury, it’s a lifestyle.',
      imageUrl: '/landingpage/feature-listing-2.jpg',
      logoUrl: '/landingpage/logo.jpg',
      address: '123 Main St, Cityville',
      rating: 4.8,
    },
  ];

  // Mock locations used by the "Search by location" slider
  const LOCATIONS = [
    { name: 'Lagos', imageUrl: '/landingpage/feature-listing-2.jpg' },
    { name: 'Abuja', imageUrl: '/landingpage/feature-listing-2.jpg' },
    { name: 'Port Harcourt', imageUrl: '/landingpage/feature-listing-2.jpg' },
    { name: 'Ibadan', imageUrl: '/landingpage/feature-listing-2.jpg' },
    { name: 'Kano', imageUrl: '/landingpage/feature-listing-2.jpg' },
    { name: 'Enugu', imageUrl: '/landingpage/feature-listing-2.jpg' },
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

const {data:sponsoredAds} = useSponsoredAds()
const {} = useEvents('Lagos')

  return (
    <main className='relative flex flex-col items-center overflow-x-hidden'>
      <section className='relative flex h-[110vh] w-screen flex-col items-center bg-cover bg-no-repeat sm:h-[90.5vh] sm:bg-[url("/landingpage/landing-page-hero-image.jpg")]'>
        <LandingPageNavbar />
        <section></section>
        {/* Mobile hero  */}
        <div className='relative flex h-[756px] w-full rounded-2xl bg-[url("/landingpage/landing-pagemobile-hero.jpg")] bg-cover bg-no-repeat sm:hidden'>
          <div className='insert-0 absolute top-0 flex h-full w-full rounded-2xl bg-black/60 sm:rounded-none'></div>
        </div>

        {/* Desktop Hero  */}
        <div className='insert-0 absolute hidden w-full rounded-2xl bg-[#000000B8] sm:top-0 sm:flex sm:h-[90.5vh] sm:rounded-none'></div>

        {/* Hero section  */}
        <div className='absolute top-[20.5rem] flex w-full flex-col items-center sm:top-[27.8rem]'>
          <h1 className='text-balance text-center font-karma text-4xl font-bold text-white sm:text-5xl lg:text-6xl'>
            Great experiences start here.
          </h1>
          <p className='px-14 text-center font-inter text-[14px] text-white sm:-mt-2 sm:text-[19px]'>
            Delve helps you find reliable vendors who turn plans into beautiful
            memories.
          </p>
          <div className='mt-20'>
            <BusinessSearch />
          </div>
        </div>
      </section>

      <div className='flex w-full flex-col items-center pt-10 sm:py-20'>
        <SectionHeader
          iconValue='category-yellow'
          header='Whatever you’re looking for, find it here.'
          paragraph='category'
        />

        <div className='mb-20 mt-10 flex w-full items-center gap-14 px-2 sm:w-[85vw] sm:max-w-[1485px] sm:px-0'>
          <Swiper
            centerInsufficientSlides={false}
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={5}
            breakpoints={{
              300: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              875: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1360: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1560: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
            scrollbar={false}
            onSwiper={swiper => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
      
            className='flex w-full items-center justify-center sm:h-[300px] sm:px-[4rem]'
          >
            <div className='absolute left-0 top-36 z-10 hidden h-full -translate-y-1/2 bg-white sm:flex'>
              <button className='custom-prev rotate-180 bg-white p-2 transition-transform'>
                <BaseIcons value='arrow-right-line-curve-black' />
              </button>
            </div>
            <div className='absolute right-0 top-36 z-10 hidden h-full -translate-y-1/2 bg-white sm:flex'>
              <button className='custom-next bg-white p-2'>
                <BaseIcons value='arrow-right-line-curve-black' />
              </button>
            </div>
            {loadingCategories
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <SwiperSlide key={idx} className='flex items-center justify-center'>
                    <div className='flex w-full items-center justify-center'>
                      {/* Skeleton for CategoryCard */}
                      <div className='flex flex-col items-center justify-center gap-2'>
                        <div className='animate-pulse rounded-full bg-gray-200 dark:bg-gray-700 size-24 lg:size-36 mb-2'></div>
                        {/* <div className='animate-pulse h-4 w-24 rounded bg-gray-200 dark:bg-gray-700'></div> */}
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              : categories.map(category => {
                  const iconName = category.name
                    ?.split(' ')[0]
                    ?.toLowerCase() as CategoryIconType;
                  return (
                    <SwiperSlide
                      key={category.id}
                      className='flex items-center justify-center'
                    >
                      <div className='flex w-full items-center justify-center'>
                        <CategoryCard
                          title={category.name}
                          icon={
                            <BusinessCategoryIcons
                              className='size-12 text-white'
                              value={iconName}
                            />
                          }
                          hoverIcon={<BusinessCategoryIcons value={iconName} />}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
          </Swiper>
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
          <div className='mb-20 mt-10 flex w-full items-center gap-10 sm:max-w-[1490px]'>
            <Swiper
              centerInsufficientSlides={false}
              navigation={{
                nextEl: '.FeaturedListingCard-next',
                prevEl: '.FeaturedListingCard-prev',
              }}
              // install Swiper modules
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              slidesPerView={3}
              spaceBetween={10}
              scrollbar={false}
              onSwiper={swiper => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
              className='relative'
              breakpoints={{
                300: {
                  slidesPerView: 1,
                  spaceBetween: -50,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: -45,
                },
              }}
            >
              <div className='absolute top-1/2 z-50 hidden -translate-y-1/2 sm:flex'>
                <button className='FeaturedListingCard-prev rotate-180 transition-transform'>
                  <BaseIcons value='arrow-right-line-curve-black' />
                </button>
              </div>
              <div className='absolute right-0 top-1/2 z-40 hidden -translate-y-1/2 sm:flex'>
                <button className='FeaturedListingCard-next'>
                  <BaseIcons value='arrow-right-line-curve-black' />
                </button>
              </div>
              {FEATURED_LISTINGS.map((listing, key) => {
                return (
                  <SwiperSlide
                    key={key}
                    className='flex items-center justify-center px-10'
                  >
                    <div className='flex w-full items-center justify-center'>
                      {/* Construct a mock BusinessSummary object from the listing data
                            and pass it to the FeaturedListingCard as the `business` prop */}
                      {(() => {
                        const mockBusiness = {
                          id: `mock-${key}`,
                          name: listing.header,
                          description: listing.desc,
                          thumbnail: listing.imageUrl,
                          logo: listing.logoUrl,
                          address: listing.address,
                          average_review_rating: listing.rating,
                        } as const;

                        return (
                          <FeaturedListingCard
                            business={mockBusiness as any}
                            classStyle={
                              'sm:h-[548px] sm:w-[412px] w-[306px] h-[401px]'
                            }
                          />
                        );
                      })()}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>

        {/* Serch By location  */}
        <div className='container mb-10'>
          <h1 className='text-2xl font-bold'>Search by location</h1>

          <div className='mb-20 flex w-full items-center gap-10 sm:w-[1490px]'>
            <Swiper
              centerInsufficientSlides={false}
              slidesPerView={4}
              spaceBetween={10}
              scrollbar={false}
              onSwiper={swiper => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
              className='relative'
              breakpoints={{
                300: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
              }}
            >
              {LOCATIONS.map((location, key) => {
                return (
                  <SwiperSlide
                    key={key}
                    className='flex items-center justify-center pt-5 sm:pt-10'
                  >
                    <LocationCard
                      key={key}
                      name={location.name}
                      imageUrl={location.imageUrl}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>

        {/* Sponsored picks  */}
        <div className='relative container lg:px-10'>
          <SectionHeader
            iconValue='listing-yellow'
            header='Sponsored Picks'
            paragraph='Spotlight'
          />

          <h1 className='-mb-16 mt-10 hidden text-2xl font-bold sm:flex'>
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
                      <SponsoredAdsCard
                        key={key}
                        ad={sponsored}
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Stats  */}
      <div className='flex flex-col items-center py-14'>
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

        <div className='mt:px-0 relative flex w-full flex-col items-center justify-center px-4'>
          <div className='flex w-full justify-between px-4 sm:px-0'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='stars-primary' />
              <h1 className='text-[16px] font-bold sm:text-2xl'>
                Listings around you
              </h1>
            </div>
            <div className='flex items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/'} className='text-[12px] uppercase sm:text-[16px]'>
                See all listings
              </Link>
            </div>
          </div>

          <div className='-mt-4 mb-20 flex w-[393px] items-center sm:-mt-0 sm:w-[1560px]'>
            <Swiper
              centerInsufficientSlides={false}
              // modules={[Navigation, Pagination, Scrollbar, A11y]}
              slidesPerView={4}
              spaceBetween={7}
              scrollbar={false}
              onSwiper={swiper => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
              className='relative'
              breakpoints={{
                300: {
                  slidesPerView: 1,
                  spaceBetween: -100,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 7,
                },
              }}
            >
              {LISTINGS_AROUND.map((_, key) => {
                return (
                  <SwiperSlide
                    key={key}
                    className='flex items-center justify-center px-10 pt-10'
                  >
                    <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                      {/* <FeaturedListingCard
                        key={key}
                        header={listing.header}
                        desc={listing.desc}
                        imageUrl={listing.imageUrl}
                        logoUrl={listing.logoUrl}
                        address={listing.address}
                        rating={listing.rating}
                        group={true}
                        classStyle={
                          'sm:h-[427px] sm:w-[340px] w-[252px] h-[237px]'
                        }
                      /> */}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Tips, trends, vendor stories  */}
      <div className='-mt-20 mb-20 px-4 sm:-mt-0 sm:mb-32 sm:px-0'>
        <h1 className='font-karma text-[24px] font-semibold sm:text-[52px]'>
          Tips, Trends & Vendor Stories
        </h1>
        <p className='mb-10 font-inter text-[13px] sm:text-[18px]'>
          Explore expert tips, trending event ideas, beauty routines, and vendor
          success stories all curated for you.
        </p>

        <div className='flex items-center gap-10'>
          <BlogCard
            imageUrl={'/landingpage/stories-1.jpg'}
            header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025'
            containerClassStyle='w-full h-[422px] sm:w-[816px] sm:h-[740px]'
            imageClassStyle='sm:w-[752px] sm:h-[440px] w-full'
          />
          <BlogCard
            imageUrl={'/landingpage/stories-2.jpg'}
            header='Skipping Sunscreen'
            containerClassStyle='w-[647px] sm:flex hidden h-[740px]'
            imageClassStyle='w-[583px] h-[440px] '
          />
        </div>
      </div>

      {/* This weeks trends  */}
      <div className='mb-80 w-full py-10 sm:mb-10 sm:w-[2000px] sm:py-0'>
        <ThisWeeksTrends />
      </div>

      {/* FAQS  */}
      <div className='w-full pb-20 sm:w-[1244px] sm:py-32'>
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
