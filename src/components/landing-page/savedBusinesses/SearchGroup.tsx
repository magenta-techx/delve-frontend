import { BaseIcons } from '@/assets/icons/base/Icons';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';
import React from 'react';

const SearchGroup = ({ searchType }: { searchType: string }): JSX.Element => {
  return (
    <div className={`w-full`}>
      {/* Desktop search  */}
      <div className='hidden items-center rounded-lg bg-white font-inter border-[1px] border-[#CDD5DF] sm:flex pl-5'>
        <div className='flex items-center py-4 gap-2'>
          <div className='shrink-0'>
            <BaseIcons value='search-large-outlined-black' />
         </div>
          <input
            className='border-none w-[240px] text-[16px] focus:outline-none'
            placeholder='Search businesses'
          />
        </div>
        <button className='flex w-[125px] px-4 text-[16px] items-center justify-center gap-4 border-l-2  border-neutral-200'>
          <span className='text-[16px]'>{searchType}</span>
          <BusinessCategoryIcons value='arrow-down' />
        </button>
        <button className='flex w-[155px] items-center justify-center gap-3 border-l-2 border-neutral-200'>
          <span className='text-[16px]'>Category</span>
          <BusinessCategoryIcons value='arrow-down' />
        </button>
        <button className='flex items-center justify-center py-4 px-8 gap-5 rounded-br-lg rounded-tr-lg bg-primary text-white'>
          <span className='text-[16px]'>Search</span>
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
