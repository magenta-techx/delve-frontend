'use client';
import { ExploreBaseIcons } from '@/assets/icons/explore/Icons';
import { BaseIcons } from '@/assets/icons/base/Icons';
// import BusinessFooter from '@/components/business/BusinessFooter';
import FeaturedListingCard from '@/components/cards/FeaturedListingCard';
import SearchGroup from '@/components/landing-page/SearchGroup';
// import Navbar from '@/components/Navbar';
import NavbarLandingPage from '@/components/navbar/NavbarLandingPage';
// import type { Metadata } from 'next';
// import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Button } from '@/components/ui/Button';
import UpComingEvents from '@/components/UpComingEvents';
import Image from 'next/image';
import BusinessFooter from '@/components/business/BusinessFooter';

// export const metadata: Metadata = {
//   title: 'Home',
//   description: 'Delve Landing page',
// };

export default function HomePage(): JSX.Element {
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
  ];

  return (
    <main className='relative flex flex-col items-center'>
      <div className='relative mb-16 flex w-screen flex-col items-start bg-right bg-no-repeat sm:mb-52 sm:h-[70vh] sm:bg-[url("/explore/explore-hero.jpg")]'>
        <div className='absolute hidden w-[100%] bg-gradient-to-t from-black via-black/95 to-transparent sm:flex sm:h-[70vh] sm:bg-gradient-to-r'></div>
        {/* New Navbar component  */}
        <NavbarLandingPage />

        {/* Mobile hero  */}
        <div className='relative flex h-[786px] w-full rounded-2xl bg-black bg-[url("/explore/explore-hero-image-mobile.jpg")] bg-no-repeat sm:hidden'>
          <div className='insert-0 absolute bottom-0 flex h-[100%] w-full rounded-bl-2xl rounded-br-2xl bg-black/10 sm:rounded-none'></div>
          <div className='absolute bottom-0 flex h-[88%] w-[100%] rounded-bl-2xl rounded-br-2xl bg-gradient-to-t from-black via-black/100 to-transparent sm:hidden'></div>
        </div>
        {/* Desktop Hero section  */}
        <div className='absolute top-[24rem] flex w-full flex-col pl-5 pr-12 sm:top-[20.8rem] sm:w-[1000px] sm:px-28'>
          <div className='mb-6 flex items-center gap-2 text-white'>
            <ExploreBaseIcons value='listing-white-and-gray-solid' />
            <p className='sm:text-[16px] text-[12px] font-light'>LISTINGS</p>
          </div>
          <h1 className='mb-6 font-karma text-[26px] font-bold text-white sm:text-[54px]'>
            Discover services tailored to your needs, location, and style.
          </h1>
          <p className='-mt-2 font-inter text-[14px] text-white sm:text-[19px]'>
            From trending service providers to hidden gems, we’ve rounded up
            some of the best businesses on Delve to make your search smoother.
          </p>
        </div>
        <div className='absolute bottom-16 flex w-full justify-center px-5 sm:-bottom-9 sm:px-0'>
          <div>
            <SearchGroup searchType='All' />
          </div>
        </div>
      </div>

      {/* Listings around you  */}

      {/* Desktop  */}
      <div className='hidden flex-col items-center sm:flex'>
        <div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='stars-primary' />
              <h1 className='text-2xl font-bold'>Listings around you</h1>
            </div>
            <div className='flex items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/'} className='uppercase'>
                See all listings
              </Link>
            </div>
          </div>
          <div className='mb-20 mt-5 grid grid-cols-4 gap-10'>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <FeaturedListingCard
                  key={key}
                  header={listing.header}
                  desc={listing.desc}
                  imageUrl={listing.imageUrl}
                  logoUrl={listing.logoUrl}
                  address={listing.address}
                  rating={listing.rating}
                  group={true}
                  classStyle={'h-[477px] w-[370px]'}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* mobile  */}
      <div className='mt:px-0 relative flex w-full flex-col items-center justify-center px-4 sm:hidden'>
        <div className='flex w-full justify-between px-4 sm:px-0'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='stars-primary' />
            <h1 className='text-[16px] font-bold sm:text-2xl'>
              Listings around you
            </h1>
          </div>
        </div>

        <div className='-mt-4 mb-20 flex w-[393px] items-center sm:-mt-0 sm:w-[1560px]'>
          <Swiper
            centerInsufficientSlides={false}
            navigation={{
              nextEl: '.listing-custom-next',
              prevEl: '.listing-custom-prev',
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            // modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={4}
            spaceBetween={7}
            scrollbar={false}
            onSwiper={swiper => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            className='relative h-[370px]'
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
            <div className='absolute bottom-0 left-5 z-10 -translate-y-1/2'>
              <button className='listing-custom-prev rotate-180 transition-transform'>
                <BaseIcons value='arrow-right-solid-black' />
              </button>
            </div>
            <div className='absolute bottom-0 right-5 z-10 -translate-y-1/2'>
              <button className='listing-custom-next'>
                <BaseIcons value='arrow-right-solid-black' />
              </button>
            </div>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <SwiperSlide
                  key={key}
                  className='flex items-center justify-center px-10 pt-10'
                >
                  <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                    <FeaturedListingCard
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
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className='absolute bottom-24 z-30 flex w-full items-center justify-center'>
            <button className='rounded-lg border-[1px] border-primary px-5 py-2 text-[12px]'>
              Browse all
            </button>
          </div>
        </div>
      </div>

      {/* Featured  */}

      {/* Desktop  */}
      <div className='hidden flex-col items-center sm:flex'>
        <div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='flames-yellow' />
              <h1 className='text-2xl font-bold'>Featured</h1>
            </div>
            <div className='flex items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/'} className='uppercase'>
                See all listings
              </Link>
            </div>
          </div>
          <div className='mb-20 mt-5 grid grid-cols-4 gap-10'>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <FeaturedListingCard
                  key={key}
                  header={listing.header}
                  desc={listing.desc}
                  imageUrl={listing.imageUrl}
                  logoUrl={listing.logoUrl}
                  address={listing.address}
                  rating={listing.rating}
                  group={true}
                  classStyle={'h-[477px] w-[370px]'}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile  */}
      <div className='mt:px-0 relative flex w-full flex-col items-center justify-center px-4 sm:hidden'>
        <div className='flex w-full justify-between px-4 sm:px-0'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='flame-yellow-small' />
            <h1 className='text-[16px] font-bold'>Featured</h1>
          </div>
        </div>

        <div className='-mt-4 flex w-[393px] items-center sm:-mt-0'>
          <Swiper
            centerInsufficientSlides={false}
            navigation={{
              nextEl: '.listing-custom-next',
              prevEl: '.listing-custom-prev',
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            // modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={4}
            spaceBetween={7}
            scrollbar={false}
            onSwiper={swiper => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            className='relative h-[370px]'
            breakpoints={{
              300: {
                slidesPerView: 1,
                spaceBetween: -36,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 7,
              },
            }}
          >
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <SwiperSlide
                  key={key}
                  className='flex items-center justify-center px-10 pt-10'
                >
                  <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                    <FeaturedListingCard
                      key={key}
                      header={listing.header}
                      desc={listing.desc}
                      imageUrl={listing.imageUrl}
                      logoUrl={listing.logoUrl}
                      address={listing.address}
                      rating={listing.rating}
                      group={true}
                      classStyle={'w-[320px] h-[237px]'}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      {/* Explore   */}
      <div className='flex flex-col items-center'>
        <div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <h1 className='text-[16px] font-bold sm:text-2xl'>Explore</h1>
            </div>
            <div className='hidden items-center gap-2 text-primary sm:flex'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/'} className='uppercase'>
                See all listings
              </Link>
            </div>
          </div>
          <div className='mb-10 mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-10'>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <FeaturedListingCard
                  key={key}
                  header={listing.header}
                  desc={listing.desc}
                  imageUrl={listing.imageUrl}
                  logoUrl={listing.logoUrl}
                  address={listing.address}
                  rating={listing.rating}
                  group={true}
                  classStyle={'sm:h-[477px] sm:w-[370px] w-[352px] h-[237px]'}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className='-mt-5 mb-20'>
        <Button
          variant='neutral'
          size='lg'
          className='hidden px-[38px] py-4 text-lg text-black hover:bg-primary/50 sm:flex'
        >
          Show more
        </Button>
        <button className='flex flex-col items-center justify-center px-[38px] py-4 text-lg text-black sm:hidden'>
          More
          <BaseIcons value='arrow-long-down-black' />
        </button>
      </div>

      <UpComingEvents />

      <div className='w-full sm:h-[217px]'>
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

      <BusinessFooter />
    </main>
  );
}
