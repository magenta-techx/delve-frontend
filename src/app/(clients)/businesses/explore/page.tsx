'use client';
import { ExploreBaseIcons } from '@/assets/icons/explore/Icons';
import { BaseIcons } from '@/assets/icons/base/Icons';
// import BusinessFooter from '@/components/business/BusinessFooter';
import FeaturedListingCard from '@/app/(clients)/misc/components/ListingCard';
// import Navbar from '@/components/Navbar';
// import type { Metadata } from 'next';
// import Image from 'next/image';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui';
import UpComingEvents from '@/components/UpComingEvents';
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
      <div className='relative mb-16 flex w-screen flex-col items-start bg-right bg-no-repeat sm:mb-52 sm:min-h-[70vh] sm:bg-[url("/explore/explore-hero.jpg")]'>
        <div className='absolute hidden w-full bg-gradient-to-t from-black via-black/95 to-transparent sm:flex sm:min-h-[70vh] sm:bg-gradient-to-r'></div>

        {/* Mobile hero  */}
        <div className='relative flex h-[786px] w-full rounded-2xl bg-black bg-[url("/explore/explore-hero-image-mobile.jpg")] bg-no-repeat sm:hidden'>
          <div className='insert-0 absolute bottom-0 flex h-[100%] w-full rounded-bl-2xl rounded-br-2xl bg-black/10 sm:rounded-none'></div>
          <div className='absolute bottom-0 flex h-[88%] w-[100%] rounded-bl-2xl rounded-br-2xl bg-gradient-to-t from-black via-black/100 to-transparent sm:hidden'></div>
        </div>
        {/* Desktop Hero section  */}
        <div className='absolute top-[8rem] flex w-full flex-col items-center px-4 sm:top-[14rem] sm:px-8 md:top-[18rem] lg:px-20'>
          <div className='flex w-full max-w-[1620px] flex-col'>
            <div className='flex w-full flex-col sm:max-w-[1000px]'></div>
            <div className='mb-9 flex items-center gap-2 text-white'>
              <ExploreBaseIcons value='listing-white-and-gray-solid' />
              <p className='text-xs text-white sm:text-base md:text-[#697586]'>
                LISTINGS
              </p>
            </div>
            <h1 className='mb-6 max-w-3xl text-balance pr-8 font-karma text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight text-white'>
              Discover services tailored to your needs, location, and style.
            </h1>
            <p className='-mt-2 max-w-3xl font-inter text-sm leading-relaxed text-white sm:text-base'>
              From trending service providers to hidden gems, we&apos;ve rounded
              up some of the best businesses on Delve to make your search
              smoother.
            </p>
          </div>
        </div>

        <section className='absolute bottom-16 left-1/2 mx-auto flex w-[90vw] max-w-4xl -translate-x-1/2 justify-center px-5 sm:-bottom-9 sm:px-0 lg:w-full'>
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
              'mb-20 mt-5 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 2xl:grid-cols-4',
              approved.length < 4
                ? 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]'
                : 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]'
            )}
          >
            {loadingApproved
              ? Array.from({ length: 5 }).map((_, key) => (
                  <ListingCardSkeleton
                    key={key}
                    classStyle={'!aspect-[5/6] w-full'}
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
      <div className='mt:px-0 relative flex w-screen flex-col items-center justify-center overflow-x-hidden px-4 sm:hidden'>
        <div className='mb-2 flex w-full items-center gap-2 px-4 sm:px-0'>
          <h1 className='flex items-center gap-2 font-inter text-[16px] font-bold sm:text-2xl'>
            <BaseIcons value='stars-primary' />
            Listings around you
          </h1>
        </div>
        <div className='mb-20 flex w-full items-center'>
          <Carousel
            opts={{ align: 'start', loop: false }}
            className='w-full max-w-full px-2'
          >
            <CarouselContent className='-ml-2 gap-4 p-4'>
              {loadingApproved
                ? Array.from({ length: 4 }).map((_, key) => (
                    <CarouselItem
                      key={key}
                      className='basis-[70vw] pl-2 sm:basis-[340px]'
                    >
                      <ListingCardSkeleton classStyle='w-[70vw] !aspect-[5/6]' />
                    </CarouselItem>
                  ))
                : approved.map((business, key) => (
                    <CarouselItem
                      key={business.id ?? key}
                      className='basis-[70vw] pl-2 sm:basis-[340px]'
                    >
                      <FeaturedListingCard business={business} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className='absolute left-2 top-1/2 z-10 -translate-y-1/2' />
            <CarouselNext className='absolute right-2 top-1/2 z-10 -translate-y-1/2' />
          </Carousel>
        </div>
      </div>

      {/*/////////////////////////  Featured  ///////////////////////////////*/}
      {/*/////////////////////////  Featured  ///////////////////////////////*/}
      {/*/////////////////////////  Featured  ///////////////////////////////*/}
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
              'mb-20 mt-5 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 2xl:grid-cols-4',
              approved.length < 4
                ? 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]'
                : 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]'
            )}
          >
            {loadingApproved
              ? Array.from({ length: 5 }).map((_, key) => (
                  <ListingCardSkeleton
                    key={key}
                    classStyle={'!aspect-[5/6] w-full'}
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
      <div className='mt:px-0 relative flex w-screen flex-col items-center justify-center overflow-x-hidden px-4 sm:hidden'>
        <div className='mb-2 flex w-full items-center gap-2 px-4 sm:px-0'>
          <h1 className='flex items-center gap-2 font-inter text-[16px] font-bold sm:text-2xl'>
            <BaseIcons value='flames-yellow' />
            Featured
          </h1>
        </div>
        <div className='mb-20 flex w-full items-center'>
          <Carousel
            opts={{ align: 'start', loop: false }}
            className='w-full max-w-full px-2'
          >
            <CarouselContent className='-ml-2 gap-4 p-4'>
              {loadingApproved
                ? Array.from({ length: 4 }).map((_, key) => (
                    <CarouselItem
                      key={key}
                      className='basis-[70vw] pl-2 sm:basis-[340px]'
                    >
                      <ListingCardSkeleton classStyle='w-[70vw] !aspect-[5/6]' />
                    </CarouselItem>
                  ))
                : approved.map((business, key) => (
                    <CarouselItem
                      key={business.id ?? key}
                      className='basis-[70vw] pl-2 sm:basis-[340px]'
                    >
                      <FeaturedListingCard business={business} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className='absolute left-2 top-1/2 z-10 -translate-y-1/2' />
            <CarouselNext className='absolute right-2 top-1/2 z-10 -translate-y-1/2' />
          </Carousel>
        </div>
      </div>

      {/*/////////////////////////  Explore  ///////////////////////////////*/}
      {/*/////////////////////////  Explore  ///////////////////////////////*/}
      {/*/////////////////////////  Explore  ///////////////////////////////*/}
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
              'mb-20 mt-5 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 2xl:grid-cols-4',
              approved.length < 4
                ? 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]'
                : 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]'
            )}
          >
            {loadingApproved
              ? Array.from({ length: 5 }).map((_, key) => (
                  <ListingCardSkeleton
                    key={key}
                    classStyle={'!aspect-[5/6] w-full'}
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
      <div className='mt:px-0 relative flex w-screen flex-col items-center justify-center overflow-x-hidden px-4 sm:hidden'>
        <div className='mb-2 flex w-full items-center gap-2 px-4 sm:px-0'>
          <h1 className='flex items-center gap-2 font-inter text-[16px] font-bold sm:text-2xl'>
            <BaseIcons value='stars-primary' />
            Explore
          </h1>
        </div>
        <div className='mb-20 flex w-full items-center'>
          <Carousel
            opts={{ align: 'start', loop: false }}
            className='w-full max-w-full px-2'
          >
            <CarouselContent className='-ml-2 gap-4 p-4'>
              {loadingApproved
                ? Array.from({ length: 4 }).map((_, key) => (
                    <CarouselItem
                      key={key}
                      className='basis-[70vw] pl-2 sm:basis-[340px]'
                    >
                      <ListingCardSkeleton classStyle='w-[70vw] !aspect-[5/6]' />
                    </CarouselItem>
                  ))
                : approved.map((business, key) => (
                    <CarouselItem
                      key={business.id ?? key}
                      className='basis-[70vw] pl-2 sm:basis-[340px]'
                    >
                      <FeaturedListingCard business={business} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className='absolute left-2 top-1/2 z-10 -translate-y-1/2' />
            <CarouselNext className='absolute right-2 top-1/2 z-10 -translate-y-1/2' />
          </Carousel>
        </div>
      </div>
      <UpComingEvents />

      {/* <div className='w-full sm:h-[217px]'>
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
      </div> */}
    </main>
  );
}
