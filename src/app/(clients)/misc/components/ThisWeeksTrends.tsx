import { useTrendingBusiness } from '@/app/(clients)/misc/api';
import { BaseIcons } from '@/assets/icons/base/Icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { LinkButton } from '../../../../components/ui';

const ThisWeeksTrends = (): JSX.Element => {
  const { data } = useTrendingBusiness();

  return (
    <div className='relative flex flex-col md:h-[30rem] w-[100%] lg:grid-cols-[1.45fr_1fr] items-center lg:grid lg:h-[35rem] xl:grid-cols-[1.6fr_1fr]'>
      <div
        className='relative flex h-full w-full items-center justify-center p-5'
        style={{
          background: `url(${data?.data.thumbnail || '/landingpage/trendz-1.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='w-full max-w-md rounded-xl bg-black/70 p-5'>
          <div className='relative z-10 flex h-full w-full flex-col gap-2 p-2 text-white sm:p-3'>
            {/* Info  */}
            <div className='flex h-[85px] items-center gap-2 border-b-[1px] border-b-white sm:-mt-5'>
              <div className='h-[46px] w-[46px] shrink-0 rounded-full sm:h-[50px] sm:w-[50px]'>
                <Image
                  src={data?.data.logo || '/landingpage/lagos.png'}
                  alt={data?.data.name || 'business logo'}
                  width={200}
                  height={100}
                  className='h-full w-full rounded-full object-cover text-[0.6rem]'
                />
              </div>
              <div>
                <h3 className='text-sm font-bold sm:text-xl'>
                  {data?.data.name || '...'}
                </h3>
                <p className='line-clamp-2 text-[13px]'>
                  {data?.data.description || '...'}
                </p>
              </div>
            </div>

            {/* Contact  */}
            <div className='my-2 flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <BaseIcons value='marker-light-red' />
                <span className='truncate text-[0.625rem] text-[#FFE6D5] sm:text-sm'>
                  {data?.data.address || '...'}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <BaseIcons value='star-yellow' />
                <p className='text-[0.7rem]'>
                  {data?.data.average_review_rating || 'No reviews'}
                </p>
              </div>
            </div>

            {/* Services  */}
            <div className='flex items-center gap-1 sm:mb-4 sm:gap-3'>
              <div className='flex flex-1 items-center gap-2 rounded-xl bg-[#D9D9D938]/30 px-2 py-2 text-[9px] text-white sm:text-sm'>
                <div className='flex size-[11px] md:size-[13px] items-center justify-center'>
                  <BaseIcons value='food-and-drinks-white' />
                </div>
                <p>{data?.data.category.name || 'Uncategorized'}</p>
              </div>
             
              <div className='flex w-[90px] items-center gap-2 rounded-xl bg-[#D9D9D938]/30 px-2 py-2 text-[9px] text-white sm:text-sm'>
                <div className='flex size-[11px] md:size-[13px] items-center justify-center'>
                  <BaseIcons value='person-white' />
                </div>
                <p>{data?.data.number_of_profile_visits ?? 0}</p>
              </div>
            </div>

            {/* images  */}
            <div className='relative aspect-[15/10] w-full rounded-xl bg-black sm:flex'>
              <Image
                src={data?.data.thumbnail || '/landingpage/trendz-4.jpg'}
                alt={data?.data.name || 'trending business'}
                fill
                objectFit='cover'
                className='h-full w-full rounded-2xl'
              />
            </div>
          </div>
        </div>
        <div className='absolute h-full w-full bg-black/50'></div>
      </div>

      <div className='h-full bg-[#FFF4ED] px-4 pb-3 pt-10 sm:pl-14 sm:pt-14 max-md:w-full'>
        <div className='flex items-center gap-2 mb-4'>
          <BaseIcons value='rocket-outline-primary' />
          <h1 className='font-karma text-3xl font-medium sm:text-3xl xl:text-[2.35rem]'>
            This Week’s Trend
          </h1>
        </div>
        <p className='mb-5 w-full text-base sm:w-[420px] sm:text-lg'>
          Every week, Delve celebrates one outstanding business that’s captured
          the most attention, the most views, the most saves, the most chats.
          It’s our way of saying “Well done!” and giving them a free spotlight
          so more people can discover what makes them special.
        </p>
        <div className='mb-6 lg:mb-10 flex items-center justify-between gap-5 sm:justify-start'>
          <LinkButton
            href={`/businesses/${data?.data.id || ''}`}
            size='xl'
            className='bg-[#551FB9]'
          >
            {' '}
            View Business
          </LinkButton>
          <Link
            href={'/'}
            className='flex h-[42px] w-[42px] items-center justify-center gap-2 rounded-md bg-white sm:h-14 sm:w-[60px]'
          >
            <BaseIcons value='bookmark-outline-black' />
          </Link>
        </div>

        <div>
          <BaseIcons value='trophy-outline-primary' />
        </div>
      </div>
    </div>
  );
};

export default ThisWeeksTrends;
