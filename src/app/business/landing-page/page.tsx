import RoadMapIconsMobile from '@/assets/icons/business/RoadMapIconMobile';
import RoadMapIcons from '@/assets/icons/business/RoadMapIcons';
import BusinessFooter from '@/components/business/BusinessFooter';
import BusinessPricingList from '@/app/(clients)/misc/components/BusinessLandingPricingList';
import BusinessSectionHeader from '@/components/business/BusinessSectionHeader';
import BusinessTestimonies from '@/app/(clients)/misc/components/BusinessLandingTestimonies';
// import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestions';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard',
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
    <section className='flex flex-col justify-center overflow-y-hidden'>
      <div className='flex justify-center'>
        {/* <BuinessHero /> */}
      </div>
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
      <div className='mb-10 flex w-full flex-col items-center lg:mb-32 lg:px-0'>
        <h1 className='ms:px-0 mb-5 w-full px-8 pr-10 font-inter text-[14px] font-semibold lg:mb-16 lg:w-[800px] lg:px-20 lg:text-center lg:text-3xl'>
          Delve is designed for all businesses, from established storefronts to
          independent service providers.
        </h1>
        <div className='ms:px-0 flex flex-col items-center gap-10 lg:flex-row lg:pr-0'>
          <div className='flex flex-col gap-7 pl-8 pr-7 lg:gap-5'>
          
            <div className='lg:px-0'>
              <BusinessTestimonies testimonies={TESTIMONIES} />
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
        <div className='hidden lg:flex'>
          {' '}
          <BusinessSectionHeader text='Delve search listing pricing and features' />
        </div>
        <BusinessPricingList />
      </div>
      {/*
     
     
     
     
      <div className='mb-24'>
        <FrequentlyAskedQuestions />
      </div>
      */}
      <div className='flex w-full justify-center'>
        {' '}
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
      <BusinessFooter />
    </section>
  );
}
