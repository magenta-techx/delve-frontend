import { BaseIcons } from '@/assets/icons/base/Icons';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';
import React from 'react';

const SearchGroup = ({ searchType }: { searchType: string }): JSX.Element => {
  return (
    <div className={`w-full`}>
      {/* Desktop search  */}
      <div className='hidden items-center rounded-lg bg-white pl-5 font-inter shadow-lg sm:flex'>
        <div className='flex items-center'>
          <BaseIcons value='stars-primary' />
          <input
            className='w-[450px] border-none px-6 py-6 text-[18px] focus:outline-none'
            placeholder='What are you looking for?'
          />
        </div>
        <button className='flex w-[225px] items-center justify-center gap-3 border-l-2 border-r-2 border-neutral-200 px-6 py-6'>
          <span className='text-lg'>{searchType}</span>
          <BusinessCategoryIcons value='arrow-down' />
        </button>
        <button className='flex w-[230px] items-center justify-center gap-2 px-6 py-6'>
          <BaseIcons value='location-primary' />
          <span className='text-lg'>Current location</span>
        </button>
        <button className='ml-2 flex w-[200px] items-center justify-center gap-5 rounded-br-lg rounded-tr-lg bg-primary px-6 py-6 text-white'>
          <BaseIcons value='search-white' />
          <span className='text-lg'>Search</span>
        </button>
      </div>

      {/* mobile search  */}
      <div className='flex h-[190px] w-[353px] flex-col rounded-lg bg-white p-5 sm:hidden'>
        <div className='mb-10 flex items-center'>
          <BaseIcons value='stars-primary' />
          <input
            className='w-full border-none px-2 py-2 text-[14px] focus:outline-none'
            placeholder='What are you looking for?'
          />
          <button className='flex w-[80px] items-center justify-center gap-2 rounded-xl bg-primary p-2 text-white'>
            <div className='flex w-[10.8px] items-center justify-center'>
              <BaseIcons value='search-white' />
            </div>
            <span className='text-[12px]'>Search</span>
          </button>
        </div>
        <div>
          <button className='flex w-full items-center justify-between border-b-[1px] border-[#E3E8EF] pb-3'>
            <div className='flex items-center gap-2'>
              <div className='flex w-[15px] items-center justify-center'>
                <BaseIcons value='location-primary' />
              </div>
              <span className='text-[14px]'>Current location</span>
            </div>
            <BusinessCategoryIcons value='arrow-down' />
          </button>
          <button className='flex w-full items-center justify-between pt-4'>
            <span className='text-[14px]'>Current location</span>
            <BusinessCategoryIcons value='arrow-down' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchGroup;
