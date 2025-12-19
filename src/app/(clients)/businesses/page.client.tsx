'use client';
import React from 'react';
import Image from 'next/image';

import RoadMapIconsMobile from '@/assets/icons/business/RoadMapIconMobile';
import RoadMapIcons from '@/assets/icons/business/RoadMapIcons';
import { LinkButton } from '@/components/ui';
import {
  BusinessLandingTestimonies,
  BusinessLandingPricingList,
  BusinessLandingFAQs,
} from '@/app/(clients)/misc/components';
import { useApprovedBusinesses } from '../misc/api';
import Link from 'next/link';

const BusinessesLandingPage = () => {
  const { data: approved } = useApprovedBusinesses();

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
      <section className='container mx-auto flex flex-col items-start justify-between p-6 pt-36 sm:flex-row sm:px-10 sm:pb-20 md:px-12 lg:flex-row lg:max-2xl:px-20 xl:pt-60'>
        <h1 className='text-balance font-karma text-[2rem] font-medium leading-normal sm:text-4xl md:text-5xl xl:text-6xl'>
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
            <LinkButton
              href={'/businesses/get-started'}
              size='xl'
              className='bg-[#551FB9]'
            >
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
      <div
        className='mb-10 flex w-full flex-col items-center lg:mb-32 lg:px-8'
        id='type'
      >
        <h1 className='mb-5 w-full max-w-6xl text-balance px-8 pr-10 font-inter text-base font-medium lg:mb-16 lg:px-20 lg:text-center lg:text-4xl'>
          Delve is designed for all businesses, from established storefronts to
          independent service providers.
        </h1>
        <section className='ms:px-0 flex grid-cols-[minmax(0,450px)_1fr] flex-col items-center gap-10 lg:grid lg:px-10'>
          <div className='flex flex-col gap-7 pl-8 pr-7 lg:gap-5'>
            <div className={`font-inter text-gray-600`}>
              <p
                className={`mb-4 text-xs text-[#0F0F0F] sm:text-sm xl:text-lg`}
              >
                Do you operate from a physical location, work remotely, or offer
                mobile services, you can list your business on Delve and connect
                with customers who need what you offer.
              </p>
              <LinkButton
                href={'/businesses/get-started'}
                className='w-full max-w-[250px] bg-[#551FB9]'
                size='xl'
              >
                Get started now
              </LinkButton>
            </div>

            <div className='lg:px-0'>
              <BusinessLandingTestimonies testimonies={TESTIMONIES} />
            </div>
          </div>

          <div className='flex flex-col items-center gap-3 lg:flex-row lg:gap-5'>
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
        </section>
      </div>

      <div>
        <div className='mb-4 flex flex-col items-center justify-center text-white'>
          <svg
            width='31'
            height='34'
            viewBox='0 0 31 34'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M13.3333 16.6667C17.9357 16.6667 21.6667 12.9357 21.6667 8.33333C21.6667 3.73096 17.9357 0 13.3333 0C8.73096 0 5 3.73096 5 8.33333C5 12.9357 8.73096 16.6667 13.3333 16.6667ZM13.3333 14.1667C16.555 14.1667 19.1667 11.555 19.1667 8.33333C19.1667 5.11167 16.555 2.5 13.3333 2.5C10.1117 2.5 7.5 5.11167 7.5 8.33333C7.5 11.555 10.1117 14.1667 13.3333 14.1667Z'
              fill='#FEC601'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M13.3333 33.3333C20.6971 33.3333 26.6667 29.9755 26.6667 25.8333C26.6667 21.6912 20.6971 18.3333 13.3333 18.3333C5.96954 18.3333 0 21.6912 0 25.8333C0 29.9755 5.96954 33.3333 13.3333 33.3333ZM21.5358 28.9577C23.5878 27.8034 24.1667 26.6001 24.1667 25.8333C24.1667 25.0666 23.5878 23.8632 21.5358 22.709C19.5621 21.5988 16.6672 20.8333 13.3333 20.8333C9.99948 20.8333 7.10456 21.5988 5.1309 22.709C3.07888 23.8632 2.5 25.0666 2.5 25.8333C2.5 26.6001 3.07888 27.8034 5.1309 28.9577C7.10456 30.0679 9.99948 30.8333 13.3333 30.8333C16.6672 30.8333 19.5621 30.0679 21.5358 28.9577Z'
              fill='#FEC601'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M20.1914 16.2588C19.7536 14.4414 20.8543 12.5535 22.7254 12.5016L22.7632 12.5009C22.8023 12.5003 22.8419 12.5 22.8822 12.5C23.4712 12.5 24.0114 12.7228 24.4107 12.9514C24.6204 13.0716 24.8989 13.1494 25.1406 13.1494C25.3824 13.1494 25.5708 13.0716 25.7806 12.9514C26.1798 12.7228 26.72 12.5 27.309 12.5C27.3493 12.5 27.389 12.5003 27.4281 12.5009C29.3221 12.5282 30.4406 14.4292 29.9999 16.2588C29.5118 18.285 26.6566 20.0811 25.5415 20.7146C25.263 20.8729 24.9283 20.8729 24.6497 20.7146C23.5347 20.0811 20.6794 18.285 20.1914 16.2588ZM23.1684 15.1209C23.7352 15.4455 24.4394 15.6494 25.1406 15.6494C26.0054 15.6494 26.6398 15.3403 27.0229 15.1209C27.1088 15.0717 27.1864 15.0371 27.2484 15.0169C27.2878 15.0041 27.3095 15.0007 27.3149 15C27.3413 15 27.3669 15.0002 27.392 15.0006C27.4201 15.001 27.436 15.0052 27.436 15.0052L27.4387 15.0061C27.4387 15.0061 27.4458 15.0102 27.4551 15.0192C27.4647 15.0285 27.479 15.0445 27.4954 15.0695C27.569 15.1825 27.6337 15.4062 27.5694 15.6734C27.5193 15.8813 27.2098 16.4005 26.3814 17.1087C25.9567 17.4717 25.5004 17.7963 25.0956 18.06C24.6908 17.7963 24.2346 17.4717 23.8099 17.1087C22.9815 16.4005 22.672 15.8813 22.6219 15.6734C22.5575 15.4062 22.6222 15.1825 22.6958 15.0695C22.7122 15.0445 22.7265 15.0285 22.7361 15.0192C22.7455 15.0102 22.7517 15.0065 22.7517 15.0065L22.7553 15.0052C22.7553 15.0052 22.7712 15.001 22.7992 15.0006C22.8243 15.0002 22.85 15 22.8763 15C22.8818 15.0007 22.9035 15.0041 22.9429 15.0169C23.0049 15.0371 23.0824 15.0717 23.1684 15.1209Z'
              fill='#FEC601'
            />
          </svg>
          <p className='text-black'>Clients</p>
          <p className='mt-4 text-lg text-black xl:text-xl'>
            Built for businesses that serve with heart
          </p>
        </div>
        <div className='z-10 w-full overflow-hidden'>
          <div className='flex w-max animate-marquee items-center'>
            {/* First set of logos */}
            {[
              '/logo-1.png',
              '/logo-2.png',
              '/logo-3.png',
              '/logo-4.png',
              '/logo-5.png',
            ]?.map((logo, idx) => (
              <div
                key={`first-${idx}`}
                className='relative mx-4 h-10 w-20 flex-shrink-0 sm:mx-8 sm:h-16 sm:w-32 md:mx-10 xl:mx-16'
              >
                <Image
                  src={logo!}
                  alt={'Business logo'}
                  fill
                  className='object-contain'
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {[
              '/logo-1.png',
              '/logo-2.png',
              '/logo-3.png',
              '/logo-4.png',
              '/logo-5.png',
            ]?.map((logo, idx) => (
              <div
                key={`first-${idx}`}
                className='relative mx-4 h-10 w-20 flex-shrink-0 sm:mx-8 sm:h-16 sm:w-32 md:mx-10 xl:mx-16'
              >
                <Image
                  src={logo!}
                  alt={'Business logo'}
                  fill
                  className='object-contain'
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className='flex w-full flex-col items-center pt-10 lg:bg-[#FCFCFDCC] lg:pt-24'
        id='pricing'
      >
        <section className='my-12 hidden w-full flex-col justify-center sm:px-0 lg:flex'>
          <h1 className='mx-auto mb-10 w-full text-center font-karma text-2xl sm:max-w-screen-md sm:text-3xl sm:font-semibold xl:text-4xl'>
            Delve search listing pricing and features
          </h1>
          <BusinessLandingPricingList />
        </section>

        <section className='mb-10 w-full'>
          <BusinessLandingFAQs />
        </section>
      </div>
    </div>
  );
};

export default BusinessesLandingPage;
