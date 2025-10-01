import { BaseIcons } from '@/assets/icons/base/Icons';
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon';
import React from 'react';

const SearchGroup = ({ searchType }: { searchType: string }): JSX.Element => {
  return (
    <div className={`flex items-center rounded-lg bg-white pl-5 font-inter shadow-lg`}>
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
  );
};

export default SearchGroup;
