'use client'
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

  ]




  return (
    <main className='relative flex flex-col items-center'>
      <div className='relative flex sm:h-[70vh] w-screen flex-col items-start sm:bg-[url("/explore/explore-hero.jpg")] bg-right bg-no-repeat sm:mb-52 mb-16'>
        <div className='absolute sm:h-[70vh] hidden sm:flex w-[100%] from-black to-transparent sm:bg-gradient-to-r bg-gradient-to-t via-black/95'></div>
        {/* New Navbar component  */}
        <NavbarLandingPage /> {/* Mobile hero  */}
        <div className='sm:hidden relative bg-black flex h-[786px] rounded-2xl w-full bg-[url("/explore/explore-hero-image-mobile.jpg")] bg-no-repeat '>
          <div className='insert-0 flex absolute rounded-bl-2xl rounded-br-2xl sm:rounded-none h-[100%] bottom-0 w-full bg-black/10'></div>
          <div className='absolute sm:hidden flex bottom-0 h-[88%] w-[100%] rounded-bl-2xl rounded-br-2xl from-black to-transparent bg-gradient-to-t via-black/100'></div>
        </div>

        {/* Desktop Hero section  */}
        <div className='absolute sm:top-[20.8rem] top-[24rem] sm:w-[1000px] w-full flex flex-col sm:px-28 pl-5 pr-12'>
          <div className='flex items-center gap-2 text-white mb-6'>
            <ExploreBaseIcons value='listing-white-and-gray-solid' />
            <p className='font-light text-[12px]'>LISTINGS</p>
          </div>
          <h1 className='font-karma sm:text-[54px] mb-6 text-[26px] font-bold text-white'>
            Discover services tailored to your needs, location, and style.
          </h1>
          <p className='-mt-2 font-inter sm:text-[19px] text-[14px] text-white'>
            From trending service providers to hidden gems, we’ve rounded up some of the best businesses on Delve to make your search smoother.
          </p>
        </div>

        <div className='absolute sm:-bottom-9 bottom-16 flex justify-center w-full px-5 sm:px-0'>
          <div>

            <SearchGroup searchType='All' />
          </div>
        </div>
      </div>


      {/* Listings around you  */}

      {/* Desktop  */}
      <div className='sm:flex flex-col items-center hidden'>
        <div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='stars-primary' />
              <h1 className='text-2xl font-bold'>Listings around you</h1>
            </div>
            <div className='flex items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/'} className='uppercase'>See all listings</Link>
            </div>
          </div>
          <div className='mt-5 grid grid-cols-4 gap-10 mb-20'>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} group={true} classStyle={'h-[477px] w-[370px]'} />
              )
            })}
          </div>
        </div>
      </div>

      {/* mobile  */}
      <div className='w-full flex flex-col sm:hidden items-center justify-center relative mt:px-0 px-4'>
        <div className='flex justify-between w-full px-4 sm:px-0'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='stars-primary' />
            <h1 className='sm:text-2xl text-[16px] font-bold'>Listings around you</h1>
          </div>
        </div>

        <div className='flex sm:-mt-0 -mt-4 items-center mb-20 sm:w-[1560px] w-[393px]'>
          <Swiper
            centerInsufficientSlides={false}
            navigation={{
              nextEl: ".listing-custom-next",
              prevEl: ".listing-custom-prev",
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            // modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={4}
            spaceBetween={7}

            scrollbar={false}
            onSwiper={(swiper) => console.log(swiper)}
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
            <div className="absolute left-5 bottom-0 z-10 -translate-y-1/2">
              <button className="listing-custom-prev transition-transform rotate-180">
                <BaseIcons value='arrow-right-solid-black' />
              </button>
            </div>
            <div className="absolute right-5 bottom-0 z-10 -translate-y-1/2">
              <button className="listing-custom-next">
                <BaseIcons value='arrow-right-solid-black' />
              </button>
            </div>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <SwiperSlide key={key} className='flex px-10 items-center pt-10 justify-center'>
                  <div className='w-full flex items-center sm:justify-center -ml-5 sm:-ml-0'>
                    <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} group={true} classStyle={'sm:h-[427px] sm:w-[340px] w-[252px] h-[237px]'} />
                  </div>
                </SwiperSlide>
              )
            })}

          </Swiper>
          <div className='absolute z-30 flex items-center justify-center w-full bottom-24'>
            <button className='border-primary border-[1px] rounded-lg px-5 py-2 text-[12px]'>Browse all</button>
          </div>
        </div>
      </div>


      {/* Featured  */}

      {/* Desktop  */}
      <div className='sm:flex flex-col hidden items-center'>
        <div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='flames-yellow' />
              <h1 className='text-2xl font-bold'>Featured</h1>
            </div>
            <div className='flex items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/'} className='uppercase'>See all listings</Link>
            </div>
          </div>
          <div className='mt-5 grid grid-cols-4 gap-10 mb-20'>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} group={true} classStyle={'h-[477px] w-[370px]'} />
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile  */}
      <div className='w-full flex flex-col sm:hidden items-center justify-center relative mt:px-0 px-4'>
        <div className='flex justify-between w-full px-4 sm:px-0'>
          <div className='flex items-center gap-2'>
            <BaseIcons value='flame-yellow-small' />
            <h1 className='text-[16px] font-bold'>Featured</h1>
          </div>
        </div>

        <div className='flex sm:-mt-0 -mt-4 items-center w-[393px]'>
          <Swiper
            centerInsufficientSlides={false}
            navigation={{
              nextEl: ".listing-custom-next",
              prevEl: ".listing-custom-prev",
            }}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            // modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={4}
            spaceBetween={7}

            scrollbar={false}
            onSwiper={(swiper) => console.log(swiper)}
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
                <SwiperSlide key={key} className='flex px-10 items-center pt-10 justify-center'>
                  <div className='w-full flex items-center sm:justify-center -ml-5 sm:-ml-0'>
                    <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} group={true} classStyle={'w-[320px] h-[237px]'} />

                  </div>
                </SwiperSlide>
              )
            })}

          </Swiper>
        </div>
      </div>


      {/* Explore   */}
      <div className='flex flex-col items-center'>
        <div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>

              <h1 className='text-[16px] sm:text-2xl font-bold'>Explore</h1>
            </div>
            <div className='sm:flex hidden items-center gap-2 text-primary'>
              <BaseIcons value='arrows-left-primary' />
              <Link href={'/'} className='uppercase'>See all listings</Link>
            </div>
          </div>
          <div className='mt-5 grid sm:grid-cols-4 grid-cols-1 sm:gap-10 gap-4 mb-10'>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} group={true} classStyle={'sm:h-[477px] sm:w-[370px] w-[352px] h-[237px]'} />
              )
            })}
          </div>
        </div>
      </div>
      <div className='mb-20 -mt-5'>
        <Button variant='neutral' size='lg' className='text-black sm:flex hidden hover:bg-primary/50 px-[38px] text-lg py-4'>
                  Show more
        </Button>
        <button className='text-black px-[38px] text-lg py-4 sm:hidden flex flex-col items-center justify-center'>
          More
          <BaseIcons value='arrow-long-down-black' />
        </button>
      </div>

      <UpComingEvents />


      <div className='w-full sm:h-[217px]'>
        <Image src={'/landingpage/second-banner.jpg'} alt='' width={700} height={400} className='w-full h-full sm:flex hidden' quality={100} />

        <Image src={'/landingpage/footer-image-mobile-2.jpg'} alt='' width={700} height={400} className='w-full h-full flex sm:hidden' quality={100} />
      </div>

      <BusinessFooter />

    </main>
  );
}
