import type { Metadata } from 'next';
import Image from 'next/image';

import RoadMapIconsMobile from '@/assets/icons/business/RoadMapIconMobile';
import RoadMapIcons from '@/assets/icons/business/RoadMapIcons';
import { LinkButton } from '@/components/ui';
import {
  BusinessLandingTestimonies,
  BusinessLandingPricingList,
  BusinessLandingFAQs,
} from '@/app/(clients)/misc/components';

export const metadata: Metadata = {
  title: 'Delve Businesses ',
  description:
    'List your business on Delve and connect with customers who need what you offer.',
};

export default function DashboardPage(): JSX.Element {
  const TESTIMONIES = [
    {
      count: '72+',
      text: 'Verified businesses',
    },
    {
      count: '612+',
      text: 'Message sent',
    },
    {
      count: '90%',
      text: 'Business growth',
    },
  ];

  return (
    <div className='flex flex-col justify-center overflow-y-hidden'>
      <section className='flex lg:flex-row max-w-[1488px] flex-col items-start justify-between p-6 pt-36 sm:flex-row sm:px-20 sm:pb-20 xl:pt-60'>
          <h1 className='text-balance font-karma font-medium leading-tight text-[2rem] sm:text-4xl md:text-5xl xl:text-6xl'>
            Because Your Business Deserves to Be Seen
          </h1>
          <div className={`font-inter text-gray-600 md:pr-4`}>
            <p
              className={`max-w-md text-balance text-sm font-medium max-lg:my-4 md:mb-6 md:text-base lg:leading-relaxed`}
            >
              Reach the right customers, build trust, and get discovered by
              thousands all in one easy-to-use platform.
            </p>
            <div className='w-[52%] lg:w-[55%]'>
              <LinkButton href={'/businesses/create-listing'}>
                Get started now
              </LinkButton>
            </div>
          </div>{' '}
      </section>

      <div className='mb-20 hidden w-full justify-center lg:flex'>
        <RoadMapIcons />
      </div>
      <div className='mb-10 flex w-full justify-start px-7 lg:hidden lg:px-20'>
        <RoadMapIconsMobile />
      </div>
      <div className='mb-32 hidden w-full justify-center px-5 sm:flex lg:flex'>
        <Image
          src={'/business/business-man.jpg'}
          alt='Delveng business'
          width={1400}
          height={600}
          priority
          quality={100}
          className='h-full'
        />
      </div>
      <div className='mb-10 flex w-full px-4 lg:hidden lg:px-20'>
        <Image
          src={'/business/business-man-mobile.png'}
          alt='Delveng business'
          width={1400}
          height={600}
          priority
          quality={100}
          className='h-full'
        />
      </div>
      <div className='mb-10 flex w-full flex-col items-center lg:mb-32 lg:px-8'>
        <h1 className='mb-5 w-full max-w-4xl text-balance px-8 pr-10 font-inter text-[14px] font-medium lg:mb-16 lg:px-20 lg:text-center lg:text-3xl'>
          Delve is designed for all businesses, from established storefronts to
          independent service providers.
        </h1>
        <div className='ms:px-0 flex flex-col items-center gap-10 lg:flex-row lg:px-10'>
          <div className='flex flex-col gap-7 pl-8 pr-7 lg:gap-5'>
            <div className={`font-inter text-gray-600`}>
              <p className={`mb-4 text-xs sm:text-sm`}>
                Do you operate from a physical location, work remotely, or offer
                mobile services, you can list your business on Delve and connect
                with customers who need what you offer.
              </p>
              <div className='w-[52%] lg:w-[55%]'>
                {' '}
                <LinkButton
                  href={'/businesses/create-listing'}
                  className='w-full max-w-[300px]'
                >
                  Get started now
                </LinkButton>
              </div>
            </div>

            <div className='lg:px-0'>
              <BusinessLandingTestimonies testimonies={TESTIMONIES} />
            </div>
          </div>

          <div className='flex w-full flex-col items-center gap-3 lg:flex-row lg:gap-5'>
            <Image
              src={'/business/spa.png'}
              alt='Delveng spa'
              width={580}
              height={482}
              priority
              quality={100}
              className='w-[320px] lg:w-[545px]'
            />
            <div className='flex flex-row items-start gap-3 lg:flex-col lg:gap-5'>
              <Image
                src={'/business/salon.png'}
                alt='Delveng spa'
                width={250}
                height={215}
                priority
                quality={100}
                className='w-[155px] lg:w-[238px]'
              />
              <Image
                src={'/business/botique.png'}
                alt='Delveng spa'
                width={250}
                height={243}
                priority
                quality={100}
                className='w-[155px] lg:w-[238px]'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mb-20 hidden w-full justify-center lg:flex'>
        <Image
          src={'/business/clients.png'}
          alt='Delveng business'
          width={1400}
          height={600}
          priority
          quality={100}
          className='w-full'
        />
      </div>
      <div className='flex justify-center lg:hidden'>
        <Image
          src={'/business/clients-mobile.png'}
          alt='Delveng business'
          width={320}
          height={100}
          priority
          quality={100}
        />
      </div>
      <div className='flex w-full flex-col items-center py-10 lg:bg-[#FCFCFDCC] lg:py-24'>
        <section className='mb-12 hidden w-full flex-col justify-center sm:px-0 lg:flex'>
          <h1 className='mx-auto mb-10 w-full text-center font-karma text-2xl sm:max-w-screen-md sm:text-3xl sm:font-semibold'>
            Delve search listing pricing and features
          </h1>
          <BusinessLandingPricingList />
        </section>

        <section className='mb-24'>
          <BusinessLandingFAQs />
        </section>
      </div>

      <div className='flex w-full justify-center'>
        <Image
          src={'/business/socials.png'}
          alt='Delve socials'
          width={1500}
          height={500}
          className='hidden w-full lg:flex'
        />
      </div>
      <Image
        src={'/business/socials-mobile.png'}
        alt='Delve socials'
        width={500}
        height={500}
        className='flex lg:hidden'
      />
    </div>
  );
}
