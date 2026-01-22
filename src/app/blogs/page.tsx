import BlogCards from '@/app/(clients)/misc/components/BlogsCard';

import UpComingEvents from '@/components/UpComingEvents';
// import type { Metadata } from 'next';
import Image from 'next/image';
import { Footer, LandingPageNavbar } from '../(clients)/misc/components';

export default function HomePage(): JSX.Element {
  return (
    <main className='relative flex flex-col items-center'>
      <LandingPageNavbar />

      {/* Tips, trends, vendor stories  */}
      <div className='sm:mb-42 sm;px-0 my-14 flex flex-col items-center px-4 sm:my-32 sm:items-start'>
        <div>
          <h1 className='font-karma text-[24px] font-semibold sm:text-[52px]'>
            Tips, Trends & Vendor Stories
          </h1>
          <p className='mb-10 font-inter text-[12px] sm:text-[18px]'>
            Explore expert tips, trending event ideas, beauty routines, and
            vendor success stories all curated for you.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-10'>
          <BlogCards
            imageUrl={'/blog/blog-image.jpg'}
            header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025'
            containerClassStyle='sm:w-[345px] w-full sm:h-[400px]'
            imageClassStyle='w-full h-[246px] '
          />
          <BlogCards
            imageUrl={'/blog/blog-image.jpg'}
            header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025'
            containerClassStyle='sm:w-[345px] w-full sm:h-[417px]'
            imageClassStyle='w-full h-[246px] '
          />
          <BlogCards
            imageUrl={'/blog/blog-image.jpg'}
            header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025'
            containerClassStyle='sm:w-[345px] w-full sm:h-[417px]'
            imageClassStyle='w-full h-[246px] '
          />
          <BlogCards
            imageUrl={'/blog/blog-image.jpg'}
            header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025'
            containerClassStyle='sm:w-[345px] w-full sm:h-[417px]'
            imageClassStyle='w-full h-[246px] '
          />
          <BlogCards
            imageUrl={'/blog/blog-image.jpg'}
            header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025'
            containerClassStyle='sm:w-[345px] w-full sm:h-[417px]'
            imageClassStyle='w-full h-[246px] '
          />
          <BlogCards
            imageUrl={'/blog/blog-image.jpg'}
            header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025'
            containerClassStyle='sm:w-[345px] w-full sm:h-[417px]'
            imageClassStyle='w-full h-[246px] '
          />
        </div>
      </div>

      <UpComingEvents />
      <div className='h-[217px] w-full'>
        <Image
          src={'/landingpage/second-banner.jpg'}
          alt=''
          width={700}
          height={400}
          className='h-full w-full'
          quality={100}
        />
      </div>

      <Footer />
    </main>
  );
}
