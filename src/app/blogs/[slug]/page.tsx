
import { BaseIcons } from '@/assets/icons/base/Icons';
import BusinessFooter from '@/components/business/BusinessFooter';
import BlogCards from '@/components/cards/BlogsCard';

import Navbar from '@/components/Navbar';
// import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';


export default function HomePage(): JSX.Element {

  return (
    <main className='relative flex flex-col items-center'>
        <Navbar type='blog' authFormButtons={false} />
     

      {/* Blog detail  */}
      <div className='my-32 w-[1488px]'>
        <div className='flex items-center justify-between mb-5'>
          <h1 className='text-[40px] font-semibold font-karma'> Top 5 Wedding Decor Trends Nigerians Are Loving in 2025</h1>
          <small>By Delve Editorial</small>
        </div>

        {/* image  */}
        <div className='w-full h-[820px] mb-10'><Image src={'/blog/blog-image-slug.jpg'} alt='' width={400} height={100} className='w-full h-full object-fill' quality={100} /></div>

        {/* Content  */}
        <div className="w-full flex justify-between items-start">
          <div className='w-[751px] flex flex-col gap-5'>

            <p>Planning a wedding this year? Whether you’re a bride-to-be, a planner, or just helping a loved one prepare for their big day, one thing’s for sure: 2025 is all about statement decor with intentional meaning. From Lagos rooftops to garden weddings in Port Harcourt, Nigerian couples are embracing looks that blend tradition, personality, and modern elegance.
            </p>
            <p className='mb-10'> We rounded up 5 of the most talked-about decor trends on Delve right now, inspired by real weddings, top decorators, and what our vendors are booking the most.</p>
            <div>
              <h3 className='font-semibold text-[18px]'>Minimal Luxe</h3>
              <p>Forget overstuffed setups. Nigerian weddings are moving toward clean lines, curated florals, and intentional accents. Think:</p>
            </div>

            <ul className='list-disc list-inside leading-10'>
              <li>
                White + neutral palettes
              </li>
              <li>
                Transparent chairs and tables
              </li>
              <li>
                Custom gold nameplates
              </li>
              <li>
                Soft lighting instead of bold colors
              </li>
            </ul>
            {/* image  */}
            <div className='w-full h-[514px]'><Image src={'/blog/blog-image-sub.jpg'} alt='' width={400} height={100} className='w-full h-full object-contain' /></div>

            <p className='-mb-3'> This look works beautifully for engagements, receptions, or civil ceremonies, especially when paired with lush greenery or natural backdrops.</p>
            <p className='mb-10'>Ceiling decor has officially taken over. Floating florals, light drapes, chandeliers wrapped in vines,  decorators are transforming tent tops and reception halls into dreamy canopies.</p>

            {/* Why it's trending:  */}
            <div>
              <h3 className='font-semibold text-[18px]'>Why it&apos;s trending:</h3>
              <p>Forget overstuffed setups. Nigerian weddings are moving toward clean lines, curated florals, and intentional accents. Think:</p>
            </div>

            <ul className='list-disc list-inside leading-10'>
              <li>
                It photographs beautifully from every angle
              </li>
              <li>
                It adds drama without cluttering the floor
              </li>
              <li>
                Works well with romantic or garden themes
              </li>

            </ul>
          </div>

          {/* content info  */}
          <div className='w-[330px]'>
            <div className='border-b-[1px] mb-4 border-[#9AA4B2] pb-4'>
              <h2 className='font-semibold mb-1'>(PUBLISHED)</h2>
              <small>25th June, 2025</small>
            </div>
            <div className='border-b-[1px] border-[#9AA4B2] pb-4 mb-4'>
              <h2 className='font-semibold mb-1'>(CATEGORY)</h2>
              <small>Events</small>
            </div>

            <div className='flex gap-3 items-center'>
              <p>Share</p>
              <div className='flex items-center gap-4'>
                <Link href={'/'} className='rounded-full flex items-center justify-center h-[30px] w-[30px] border-[1px] border-gray-200'>
                  <BaseIcons value='facebook-outlined-black'/>
                  </Link>
                <Link href={'/'} className='rounded-full flex items-center justify-center h-[30px] w-[30px] border-[1px] border-gray-200'>
                  <BaseIcons value='linkedin-outlined-black'/>
                  </Link>
                <Link href={'/'} className='rounded-full flex items-center justify-center h-[30px] w-[30px] border-[1px] border-gray-200'>
                  <BaseIcons value='whatsapp-outlined-black'/>
                  </Link>
                <Link href={'/'} className='rounded-full flex items-center justify-center h-[30px] w-[30px] border-[1px] border-gray-200'>
                  <BaseIcons value='telegram-outlined-black'/>
                  </Link>
                <Link href={'/'} className='rounded-full flex items-center justify-center h-[30px] w-[30px] border-[1px] border-gray-200'>
                  <BaseIcons value='x-outlined-black'/>
                  </Link>
              </div>
            </div>
          </div>
      </div>
      </div>

      {/* Tips, trends, vendor stories  */}
      <div className=' mb-52'>
        <h1 className='text-[36px] font-semibold font-inter mb-5'>Tips, Trends & Vendor Stories</h1>
     
        <div className='grid grid-cols-4 gap-10'>
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
          <BlogCards imageUrl={'/blog/blog-image.jpg'} header='Top 5 Wedding Decor Trends Nigerians Are Loving in 2025' containerClassStyle='w-[345px] h-[480px]' imageClassStyle='w-full h-[246px] ' />
        
        </div>

      </div>

    
      <div className='w-full h-[217px]'>
        <Image src={'/landingpage/second-banner.jpg'} alt='' width={700} height={400} className='w-full h-full' quality={100} />
      </div>

      <BusinessFooter />

    </main>
  );
}
