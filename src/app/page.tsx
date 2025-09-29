import { BaseIcons } from '@/assets/icons/base/Icons';
import BusinessFooter from '@/components/business/BusinessFooter';
import BlogCard from '@/components/cards/BlogCard';
import FeaturedListingCard from '@/components/cards/FeaturedListingCard';
import LocationCard from '@/components/cards/LocationCard';
import SponsoredCard from '@/components/cards/SponsoredCard';
import SearchGroup from '@/components/landing-page/SearchGroup';
import SectionHeader from '@/components/landing-page/SectionHeader';
import ThisWeeksTrends from '@/components/landing-page/ThisWeeksTrends';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Delve Landing page',
};

export default function HomePage(): JSX.Element {

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

  ]
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

  ]

  const LOACTIONS = [
    { name: 'Lagos', imageUrl: '/landingpage/lagos.png' },
    { name: 'Abuja', imageUrl: '/landingpage/lagos.png' },
    { name: 'Ibadan', imageUrl: '/landingpage/lagos.png' },
    { name: 'Port-harcourt', imageUrl: '/landingpage/lagos.png' },
  ]

  const SPONSORED_LIST = [
    {
      imageUrl: '/landingpage/sponsored-2.jpg',
      href: '/'

    },
    {
      imageUrl: '/landingpage/sponsored-1.jpg',
      href: '/'

    }
  ]

  const STATS = [
    {
      count: '72+',
      desc: 'Business visits'
    },
    {
      count: '612+',
      desc: 'Message sent'
    },
    {
      count: '72+',
      desc: 'Business rating'
    },
  ]
  return (
    <main className='relative flex flex-col items-center'>
      <div className='relative flex h-[83.6vh] w-screen flex-col items-center bg-[url("/landingpage/landing-page-hero-image.jpg")] bg-cover bg-no-repeat'>
        <div className='insert-0 absolute h-[83.6vh] w-full bg-black/70'></div>
        <Navbar type='' authFormButtons={false} />


        {/* Hero section  */}
        <div className='absolute top-[27.8rem] flex h-full w-full flex-col items-center'>
          <h1 className='font-karma text-[54px] font-bold text-white'>
            Great experiences start here.
          </h1>
          <p className='-mt-2 font-inter text-[19px] text-white'>
            Delve helps you find reliable vendors who turn plans into beautiful
            memories.
          </p>
          <div className='mt-16'>
            <SearchGroup />
          </div>
        </div>

      </div>


      <div className='bg-[#FFF4ED] w-full flex flex-col items-center py-20'>

        <SectionHeader iconValue='listing-yellow' header='Trusted by dozens of happy clients. ' paragraph='Featured Listing' />

        {/* featured listings  */}
        <div className='mt-10 flex items-center gap-10 mb-20'>
          {FEATURED_LISTINGS.map((listing, key) => {
            return (
              <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} classStyle={'h-[548px] w-[412px]'} />
            )
          })}
        </div>
        {/* Serch By location  */}
        <div className='mb-44'>
          <h1 className='text-2xl font-bold mb-5'>Search by location</h1>

          <div className='flex items-center gap-5'>
            {LOACTIONS.map((location, key) => {
              return <LocationCard key={key} name={location.name} imageUrl={location.imageUrl} />
            })}
          </div>
        </div>

        {/* Sponsored picks  */}
        <div>
          <SectionHeader iconValue='listing-yellow' header='Sponsored Picks' paragraph='Spotlight' />

          <h1 className='text-2xl font-bold mb-5 mt-10'>Hot deals and events you don’t want to miss</h1>
          <div className='flex items-center gap-3'>
            {SPONSORED_LIST.map((sponsored, key) => {
              return <SponsoredCard key={key} imageUrl={sponsored.imageUrl} href={sponsored.href} />
            })}
          </div>

        </div>
      </div>



      {/* Stats  */}
      <div className='py-14 flex flex-col items-center'>
        <div className='flex items-center gap-72 mb-40'>
          {STATS.map((stat, key) => {
            return <div key={key} className='flex flex-col items-center'>
              <h1 className='font-karma font-semibold text-[48px] -mb-5'>{stat.count}</h1>
              <small className='text-[#697586]'>{stat.desc}</small>
            </div>
          })}

        </div>
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
          <div className='mt-10 flex items-center gap-7 mb-20'>
            {LISTINGS_AROUND.map((listing, key) => {
              return (
                <FeaturedListingCard key={key} header={listing.header} desc={listing.desc} imageUrl={listing.imageUrl} logoUrl={listing.logoUrl} address={listing.address} rating={listing.rating} group={true} classStyle={'h-[427px] w-[340px]'} />
              )
            })}
          </div>
        </div>
      </div>

      {/* Tips, trends, vendor stories  */}
      <div className='mb-32'>
        <h1 className='text-[52px] font-semibold font-karma'>Tips, Trends & Vendor Stories</h1>
        <p className='text-[18px] font-inter mb-10'>Explore expert tips, trending event ideas, beauty routines, and vendor success stories all curated for you.</p>

        <div className='flex items-center gap-10'>
          <BlogCard imageUrl={'/landingpage/stories-1.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[816px] h-[740px]' imageClassStyle='w-[752px] h-[440px] ' />
          <BlogCard imageUrl={'/landingpage/stories-2.jpg'} header='Skipping Sunscreen' containerClassStyle='w-[647px] h-[740px]' imageClassStyle='w-[583px] h-[440px] ' />
        </div>

      </div>

      {/* This weeks trends  */}
      <div className="mb-10 w-full">
        <ThisWeeksTrends />
      </div>

      <div className='w-full h-[543px] mt-32 mb-1'>
        <Image src={'/landingpage/first-banner.jpg'} alt='' width={700} height={400} className='w-full h-full' quality={100} />
      </div>
      <div className='w-full h-[217px]'>
        <Image src={'/landingpage/second-banner.jpg'} alt='' width={700} height={400} className='w-full h-full' quality={100} />
      </div>

      <BusinessFooter />


    </main>
  );
}
