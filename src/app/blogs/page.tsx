
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
      <div className='my-32 mb-42'>
        <h1 className='text-[52px] font-semibold font-karma'>Tips, Trends & Vendor Stories</h1>
        <p className='text-[18px] font-inter mb-10'>Explore expert tips, trending event ideas, beauty routines, and vendor success stories all curated for you.</p>

        <div className='grid grid-cols-4 gap-10'>
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
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
