
import BusinessFooter from '@/components/business/BusinessFooter';
import BlogCards from '@/components/cards/BlogsCard';

import Navbar from '@/components/Navbar';
import UpComingEvents from '@/components/UpComingEvents';
// import type { Metadata } from 'next';
import Image from 'next/image';


export default function HomePage(): JSX.Element {

  return (
    <main className='relative flex flex-col items-center'>
        <Navbar type='blog' authFormButtons={false}  />
     

      {/* Tips, trends, vendor stories  */}
      <div className='sm:my-32 sm:mb-42 my-14 flex flex-col sm:items-start items-center px-4 sm;px-0'>

        <div>
          <h1 className='sm:text-[52px] text-[24px] font-semibold font-karma'>Tips, Trends & Vendor Stories</h1>
          <p className='sm:text-[18px] font-inter mb-10 text-[12px]'>Explore expert tips, trending event ideas, beauty routines, and vendor success stories all curated for you.</p>

        </div>
        <div className='grid sm:grid-cols-4 grid-cols-1 sm:gap-10 gap-4'>
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='sm:w-[345px] w-full sm:h-[420px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='sm:w-[345px] w-full sm:h-[420px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='sm:w-[345px] w-full sm:h-[420px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='sm:w-[345px] w-full sm:h-[420px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='sm:w-[345px] w-full sm:h-[420px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='sm:w-[345px] w-full sm:h-[420px]' imageClassStyle='w-full h-[246px] ' />
        </div>

      </div>

      <UpComingEvents />
      <div className='w-full h-[217px]'>
        <Image src={'/landingpage/second-banner.jpg'} alt='' width={700} height={400} className='w-full h-full' quality={100} />
      </div>

      <BusinessFooter />

    </main>
  );
}
