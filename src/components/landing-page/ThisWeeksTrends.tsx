import { BaseIcons } from '@/assets/icons/base/Icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ThisWeeksTrends = (): JSX.Element => {
  return (
    <div className='relative flex h-[513px] w-[100%] flex-col items-center sm:h-[553px] sm:flex-row'>
      {/* Desktop  */}
      <div className='relative hidden h-full w-full items-center sm:flex sm:w-[64%]'>
        <div className='absolute h-full w-full bg-black/50'></div>
        <div className='h-full w-[50%]'>
          <Image
            src={'/landingpage/trendz-1.jpg'}
            alt='trendz'
            width={200}
            height={100}
            className='h-full w-full'
          />
        </div>
        <div className='h-full w-[50%] bg-black'>
          <div className='h-[50%]'>
            <Image
              src={'/landingpage/trendz-2.jpg'}
              alt='trendz'
              width={200}
              height={100}
              className='h-full w-full'
            />
          </div>
          <div className='h-[50%]'>
            <Image
              src={'/landingpage/trendz-3.jpg'}
              alt='trendz'
              width={200}
              height={100}
              className='h-full w-full'
            />
          </div>
        </div>
      </div>

      {/* Mobile  */}
      <div className='relative flex h-full w-full flex-col items-center sm:hidden'>
        <div className='absolute h-full w-full bg-black/50'></div>
        <div className='h-full w-full'>
          <Image
            src={'/landingpage/trendz-2.jpg'}
            alt='trendz'
            width={200}
            height={100}
            className='h-full w-full'
          />
        </div>
        <div className='flex h-full w-full'>
          <div className='h-[199.76px] w-1/2'>
            <Image
              src={'/landingpage/trendz-1.jpg'}
              alt='trendz'
              width={200}
              height={100}
              className='h-full w-full'
            />
          </div>
          <div className='h-[199.76px] w-1/2'>
            <Image
              src={'/landingpage/trendz-3.jpg'}
              alt='trendz'
              width={200}
              height={100}
              className='h-full w-full object-cover'
            />
          </div>
        </div>
      </div>
      <div className='h-full w-full bg-[#FFF4ED] px-4 pb-3 pt-10 sm:w-[36%] sm:pl-14 sm:pt-14'>
        <div className='flex items-center gap-2'>
          <BaseIcons value='rocket-outline-primary' />
          <h1 className='font-karma text-[20px] sm:text-[38px]'>
            This Week’s Trend
          </h1>
        </div>
        <p className='mb-5 w-full text-[12px] sm:w-[420px] sm:text-[20px]'>
          Every week, Delve celebrates one outstanding business that’s captured
          the most attention, the most views, the most saves, the most chats.
          It’s our way of saying “Well done!” and giving them a free spotlight
          so more people can discover what makes them special.
        </p>
        <div className='mb-10 flex items-center justify-between gap-5 sm:justify-start'>
          <Link
            href={'/'}
            className='flex h-[46px] w-[122px] items-center justify-center gap-2 rounded-md bg-primary text-center text-[12px] font-medium text-white sm:h-14 sm:w-[140px] sm:text-lg'
          >
            {' '}
            View Business
          </Link>
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

      {/* Center tinted content  */}
      <div className='absolute top-10 h-[305px] w-[292px] rounded-xl bg-black/70 sm:left-[190px] sm:h-[469px] sm:w-[503px]'>
        <div className='absolute z-10 flex h-full w-full flex-col gap-2 p-2 text-white sm:p-8'>
          {/* Info  */}
          <div className='flex h-[85px] items-center gap-2 border-b-[1px] border-b-white sm:-mt-5'>
            <div className='h-[46px] w-[46px] shrink-0 rounded-full sm:h-[50px] sm:w-[50px]'>
              <Image
                src={'/landingpage/lagos.png'}
                alt={'delve'}
                width={200}
                height={100}
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <div>
              <h3 className='text-[14px] font-bold sm:text-xl'>Ember Lagos</h3>
              <p className='line-clamp-2 text-[13px]'>
                The Ember Table is where bold Nigerian flavors meet refined
                culinary flair. Our menu is rooted in tradition bu..
              </p>
            </div>
          </div>

          {/* Contact  */}
          <div className='my-2 flex items-center justify-between text-[14px]'>
            <div className='flex items-center gap-2'>
              <BaseIcons value='marker-light-red' />
              <span className='truncate text-[10px] text-[#FFE6D5] sm:text-sm'>
                12 Adebayo Street, Lekki Phase 1..
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <BaseIcons value='star-yellow' />
              <p>4.8</p>
            </div>
          </div>

          {/* Services  */}
          <div className='flex items-center gap-1 sm:mb-4 sm:gap-3'>
            <div className='flex w-[172px] items-center gap-2 rounded-xl bg-[#D9D9D938]/30 px-2 py-2 text-[9px] text-white sm:text-[14px]'>
              <div className='flex h-[10px] w-[10px] items-center justify-center'>
                <BaseIcons value='food-and-drinks-white' />
              </div>
              <p>Food & Drinks</p>
            </div>
            <div className='flex w-[200px] items-center gap-2 rounded-xl bg-[#D9D9D938]/30 px-2 py-2 text-[8px] text-white sm:text-[14px]'>
              <div className='flex h-[8px] w-[8px] items-center justify-center'>
                <BaseIcons value='calendar-white' />
              </div>
              <p>10am - 12pm, daily</p>
            </div>
            <div className='flex w-[90px] items-center gap-2 rounded-xl bg-[#D9D9D938]/30 px-2 py-2 text-[9px] text-white sm:text-[14px]'>
              <div className='flex h-[10px] w-[10px] items-center justify-center'>
                <BaseIcons value='person-white' />
              </div>
              <p>258</p>
            </div>
          </div>

          {/* images  */}
          <div className='h-[219px] w-full rounded-xl bg-black sm:flex sm:w-[449px]'>
            <Image
              src={'/landingpage/trendz-4.jpg'}
              alt=''
              width={300}
              height={100}
              className='h-full w-full rounded-2xl'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThisWeeksTrends;
