'use client'
import { BaseIcons } from '@/assets/icons/base/Icons';
import BusinessFooter from '@/components/business/BusinessFooter';
import FeaturedListingCard from '@/components/cards/FeaturedListingCard';
import SearchGroup from '@/components/landing-page/SearchGroup';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import UpComingEvents from '@/components/UpComingEvents';
// import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


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
      <div className='relative flex h-[70vh] w-screen flex-col items-start bg-[url("/explore/explore-hero.jpg")] bg-right bg-no-repeat mb-52'>
              <div className='absolute h-[70vh] w-[100%] from-black to-transparent bg-gradient-to-r via-black/95'></div>
        <Navbar type='' authFormButtons={false} />

              
              {/* Hero section  */}
              <div className='absolute top-[20.8rem] w-[1000px] flex flex-col sm:px-28'>
                  <h1 className='font-karma text-[54px] font-bold text-white'>
                      Discover services tailored to your needs, location, and style.
                  </h1>
                  <p className='-mt-2 font-inter text-[19px] text-white'>
                      From trending service providers to hidden gems, we’ve rounded up some of the best businesses on Delve to make your search smoother.
                  </p>
              </div>
                  <div className='absolute -bottom-9 flex justify-center w-full'>
                      <SearchGroup searchType='All' />
                  </div>
      </div>

          
          {/* Listings around you  */}
      <div className='flex flex-col items-center'>  
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
          

          {/* Featured  */}
      <div className='flex flex-col items-center'>  
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
          

          {/* Explore   */}
      <div className='flex flex-col items-center'>  
        <div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
                         
              <h1 className='text-2xl font-bold'>Explore</h1>
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
          <div className='mb-20 -mt-5'>
              <Button variant='neutral' size='lg' className='text-black hover:bg-primary/50 px-[38px] text-lg py-4'>
                  Show more
              </Button>
         </div>
          
          <UpComingEvents />

    
      <div className='w-full h-[217px]'>
        <Image src={'/landingpage/second-banner.jpg'} alt='' width={700} height={400} className='w-full h-full' quality={100} />
      </div>

      <BusinessFooter />

    </main>
  );
}
