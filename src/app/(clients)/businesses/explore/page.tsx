'use client';
import { ExploreBaseIcons } from '@/assets/icons/explore/Icons';
import { BaseIcons } from '@/assets/icons/base/Icons';
// import BusinessFooter from '@/components/business/BusinessFooter';
import FeaturedListingCard from '@/app/(clients)/misc/components/ListingCard';
// import Navbar from '@/components/Navbar';
// import type { Metadata } from 'next';
// import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import UpComingEvents from '@/components/UpComingEvents';
import Image from 'next/image';
import { useApprovedBusinesses } from '@/app/(clients)/misc/api';
import ListingCardSkeleton from '@/app/(clients)/misc/components/ListingCardSkeleton';
import { EmptyState } from '@/components/ui';
import { EmptyListingIcon } from '../../misc/icons';
import { cn } from '@/lib/utils';
import { BusinessSearch } from '../../misc/components';

export default function HomePage(): JSX.Element {
  const { data: approvedResp, isLoading: loadingApproved } =
    useApprovedBusinesses();

  const approved = approvedResp?.data ?? [];

  const isEmptyApproved = !loadingApproved && approved.length === 0;

  return (
    <main className='relative flex flex-col items-center'>
      <div className='relative mb-16 flex w-screen flex-col items-start bg-right bg-no-repeat sm:mb-52 sm:min-h-[80vh] sm:bg-[url("/explore/explore-hero.jpg")]'>
        <div className='absolute hidden w-full bg-gradient-to-t from-black via-black/95 to-transparent sm:flex sm:min-h-[80vh] sm:bg-gradient-to-r'></div>

        {/* Mobile hero  */}
        <div className='relative flex h-[786px] w-full rounded-2xl bg-black bg-[url("/explore/explore-hero-image-mobile.jpg")] bg-no-repeat sm:hidden'>
          <div className='insert-0 absolute bottom-0 flex h-[100%] w-full rounded-bl-2xl rounded-br-2xl bg-black/10 sm:rounded-none'></div>
          <div className='absolute bottom-0 flex h-[88%] w-[100%] rounded-bl-2xl rounded-br-2xl bg-gradient-to-t from-black via-black/100 to-transparent sm:hidden'></div>
        </div>
        {/* Desktop Hero section  */}
        <div className='absolute top-[24rem] flex w-full flex-col items-center px-4 sm:top-[20.8rem] sm:px-8 lg:px-20'>
          <div className='flex w-full max-w-[1620px] flex-col'>
            <div className='flex w-full flex-col sm:max-w-[1000px]'></div>
            <div className='mb-9 flex items-center gap-2 text-white'>
              <ExploreBaseIcons value='listing-white-and-gray-solid' />
              <p className='text-xs text-[#697586] sm:text-base'>LISTINGS</p>
            </div>
            <h1 className='mb-6 max-w-3xl text-balance pr-8 font-karma text-[clamp(2rem,4vw,2.8rem)] font-bold leading-tight text-white'>
              Discover services tailored to your needs, location, and style.
            </h1>
            <p className='-mt-2 max-w-3xl font-inter text-sm leading-relaxed text-white sm:text-base'>
              From trending service providers to hidden gems, we&apos;ve rounded
              up some of the best businesses on Delve to make your search
              smoother.
            </p>
          </div>
        </div>

        <section className='absolute bottom-16 mx-auto flex max-w-max justify-center px-5 sm:-bottom-9 sm:px-0 md:left-1/2 md:-translate-x-1/2'>
          <BusinessSearch />
        </section>
      </div>

      {/* Listings around you  */}
      {/* Desktop  */}
      <div className='container hidden w-full px-8 sm:block lg:px-12'>
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
        {isEmptyApproved ? (
          <div className='flex items-center justify-center md:py-6'>
            <EmptyState
              title='No listings to show'
              description='Try checking back later.'
              className=''
              headerClassName=''
              mediaClassName=''
              media={<EmptyListingIcon />}
            />
          </div>
        ) : (
          <div
            className={cn(
              'mb-20 mt-5 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 2xl:grid-cols-5',
              approved.length < 4
                ? 'grid-cols-[repeat(auto-fill,minmax(240px,1fr))]'
                : 'grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'
            )}
          >
            {loadingApproved
              ? Array.from({ length: 5 }).map((_, key) => (
                  <ListingCardSkeleton
                    key={key}
                    classStyle={'h-[350px] w-full'}
                  />
                ))
              : approved.map((business, key) => (
                  <FeaturedListingCard
                    key={business.id ?? key}
                    business={business}
                    group={true}
                  />
                ))}
          </div>
        )}
      </div>

      {/* mobile  */}
      <div className='mt:px-0 relative flex w-full flex-col items-center justify-center px-4 sm:hidden'>
        <div className='flex w-full justify-between px-4 sm:px-0'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='stars-primary' />
            <h1 className='font-inter text-[16px] font-bold sm:text-2xl'>
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
            {loadingApproved
              ? Array.from({ length: 4 }).map((_, key) => (
                  <SwiperSlide
                    key={key}
                    className='flex items-center justify-center px-10 pt-10'
                  >
                    <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                      <ListingCardSkeleton
                        classStyle={
                          'sm:h-[427px] sm:w-[340px] w-[252px] h-[237px]'
                        }
                      />
                    </div>
                  </SwiperSlide>
                ))
              : approved.map((business, key) => (
                  <SwiperSlide
                    key={business.id ?? key}
                    className='flex items-center justify-center px-10 pt-10'
                  >
                    <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                      <FeaturedListingCard business={business} group={true} />
                    </div>
                  </SwiperSlide>
                ))}
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
      <div className='container hidden w-full px-8 sm:block lg:px-12'>
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
        {isEmptyApproved ? (
          <div className='flex items-center justify-center md:py-6'>
            <EmptyState
              title='No listings to show'
              description='Try checking back later.'
              className=''
              headerClassName=''
              mediaClassName=''
              media={<EmptyListingIcon />}
            />
          </div>
        ) : (
          <div
            className={cn(
              'mb-20 mt-5 grid gap-6 2xl:grid-cols-5',
              approved.length < 4
                ? 'grid-cols-[repeat(auto-fill,minmax(240px,1fr))]'
                : 'grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'
            )}
          >
            {loadingApproved
              ? Array.from({ length: 5 }).map((_, key) => (
                  <ListingCardSkeleton key={key} />
                ))
              : approved.map((business, key) => (
                  <FeaturedListingCard
                    key={business.id ?? key}
                    business={business}
                    group={true}
                  />
                ))}
          </div>
        )}
      </div>

      {/* Mobile  */}
      <div className='mt:px-0 relative flex w-full flex-col items-center justify-center px-4 sm:hidden'>
        <div className='flex w-full justify-between px-4 sm:px-0'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='flame-yellow-small' />
            <h1 className='font-inter text-base font-bold'>Featured</h1>
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
            {loadingApproved
              ? Array.from({ length: 4 }).map((_, key) => (
                  <SwiperSlide
                    key={key}
                    className='flex items-center justify-center px-10 pt-10'
                  >
                    <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                      <ListingCardSkeleton classStyle={'w-[300px] h-[237px]'} />
                    </div>
                  </SwiperSlide>
                ))
              : approved.map((business, key) => (
                  <SwiperSlide
                    key={business.id ?? key}
                    className='flex items-center justify-center px-10 pt-10'
                  >
                    <div className='-ml-5 flex w-full items-center sm:-ml-0 sm:justify-center'>
                      <FeaturedListingCard business={business} group={true} />
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </div>

      <div className='container w-full px-8 lg:px-12'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <h1 className='font-inter text-base font-bold sm:text-2xl'>
              Explore
            </h1>
          </div>
        </div>
        {isEmptyApproved ? (
          <div className='flex items-center justify-center md:py-6'>
            <EmptyState
              title='No listings to show'
              description='Try checking back later.'
              className=''
              headerClassName=''
              mediaClassName=''
              media={<EmptyListingIcon />}
            />
          </div>
        ) : (
          <div
            className={cn(
              'mb-10 mt-5 grid gap-4 sm:gap-6 2xl:grid-cols-5',
              approved.length < 4
                ? 'grid-cols-[repeat(auto-fill,minmax(240px,1fr))]'
                : 'grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'
            )}
          >
            {loadingApproved
              ? Array.from({ length: 5 }).map((_, key) => (
                  <ListingCardSkeleton
                    key={key}
                    classStyle={'sm:h-[380px] w-full h-[237px]'}
                  />
                ))
              : approved.map((business, key) => (
                  <FeaturedListingCard
                    key={business.id ?? key}
                    business={business}
                  />
                ))}
          </div>
        )}
      </div>
      {/* <div className='-mt-5 mb-20'>
        <Button
          variant='neutral'
          size='lg'
          className='hidden px-[38px] py-4 text-lg text-black hover:bg-primary/50 sm:flex'
        >
          Show more
        </Button>
      </div>
      {/* <div className='-mt-5 mb-20'>
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
      </div> */}

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
    </main>
  );
}
