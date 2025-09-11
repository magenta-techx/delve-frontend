import RoadMapIconsMobile from '@/assets/icons/business/RoadMapIconMobile';
import RoadMapIcons from '@/assets/icons/business/RoadMapIcons';
import BuinessHero from '@/components/business/BuinessHero';
import BusinessFooter from '@/components/business/BusinessFooter';
import BusinessPricingList from '@/components/business/BusinessPricingList';
import BusinessSectionHeader from '@/components/business/BusinessSectionHeader';
import BusinessTestimonies from '@/components/business/BusinessTestimonies';
import BusinessTextAndButton from '@/components/business/BusinessTextAndButton';
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
    <section className='overflow-y-hidden'>
      <BuinessHero />
      <div className='mb-20 hidden w-full justify-center sm:flex'>
        <RoadMapIcons />
      </div>
      <div className='mb-10 flex w-full justify-start px-20 sm:hidden'>
        <RoadMapIconsMobile />
      </div>
      <div className='mb-32 hidden w-full sm:flex sm:px-5'>
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
      <div className='mb-10 flex w-full px-20 sm:hidden'>
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
      <div className='mb-10 flex w-full flex-col items-center sm:mb-32 sm:px-0'>
        <h1 className='ms:px-0 mb-5 w-full px-20 font-inter text-[14px] font-semibold sm:mb-16 sm:w-[800px] sm:text-center sm:text-3xl'>
          Delve is designed for all businesses, from established storefronts to
          independent service providers.
        </h1>
        <div className='ms:px-0 flex flex-col items-center gap-10 px-20 sm:flex-row'>
          <div className='flex flex-col gap-7 sm:gap-5'>
            <BusinessTextAndButton
              text='Do you operate from a physical location, work remotely, or offer mobile services, you can list your business on Delve and connect with customers who need what you offer.'
              buttonText='Get started now'
              width='sm:w-[300px] w-full'
              textClass='text-xs mb-4'
            />
            <BusinessTestimonies testimonies={TESTIMONIES} />
          </div>

          <div className='flex flex-col items-center gap-3 sm:flex-row sm:gap-5'>
            <Image
              src={'/business/spa.png'}
              alt='Delveng spa'
              width={580}
              height={482}
              priority
              quality={100}
              className='w-[300px] sm:w-[545px]'
            />
            <div className='flex flex-row items-start gap-3 sm:flex-col sm:gap-5'>
              <Image
                src={'/business/salon.png'}
                alt='Delveng spa'
                width={250}
                height={215}
                priority
                quality={100}
                className='w-[150px] sm:w-[250px]'
              />
              <Image
                src={'/business/botique.png'}
                alt='Delveng spa'
                width={250}
                height={243}
                priority
                quality={100}
                className='w-[150px] sm:w-[250px]'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mb-20 hidden justify-center sm:flex'>
        <Image
          src={'/business/clients.png'}
          alt='Delveng business'
          width={1400}
          height={600}
          priority
          quality={100}
        />
      </div>
      <div className='flex justify-center sm:hidden'>
        <Image
          src={'/business/clients-mobile.png'}
          alt='Delveng business'
          width={320}
          height={100}
          priority
          quality={100}
        />
      </div>
      <div className='flex w-full flex-col items-center py-10 sm:bg-[#FCFCFDCC] sm:py-24'>
        <div className='hidden sm:flex'>
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
      <Image
        src={'/business/socials.png'}
        alt='Delve socials'
        width={1500}
        height={500}
        className='hidden sm:flex'
      />
      <Image
        src={'/business/socials-mobile.png'}
        alt='Delve socials'
        width={500}
        height={500}
        className='flex sm:hidden'
      />
      <BusinessFooter />
    </section>
  );
}
