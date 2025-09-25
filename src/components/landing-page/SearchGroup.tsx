import { BaseIcons } from '@/assets/icons/base/Icons'
import { BusinessCategoryIcons } from '@/assets/icons/business/BusinessCategoriesIcon'
import React from 'react'

const SearchGroup = ():JSX.Element => {
  return (
      <div className={`bg-white flex items-center font-inter rounded-lg pl-5`}>
          <div className="flex items-center">
              <BaseIcons value='stars-primary' />
              <input className='focus:outline-none border-none px-6 py-6 w-[450px] text-[18px]' placeholder='What are you looking for?' />
         </div>
          <button className='flex items-center justify-center gap-3 px-6 py-6 border-l-2 border-r-2 border-neutral-200 w-[225px]'>
              <span className='text-lg'>Category</span>
              <BusinessCategoryIcons value='arrow-down'/>
         </button>
          <button className='flex items-center justify-center gap-2 px-6 py-6 w-[230px]'>
              <BaseIcons value='location-primary'/>
              <span className='text-lg'>Current location</span>
         </button>
          <button className='bg-primary text-white flex items-center gap-2 px-6 py-6 w-[200px] justify-center rounded-tr-lg rounded-br-lg ml-2'>
              <BaseIcons value='search-white'/>
              <span className='text-lg'>Search</span>
         </button>
    </div>
  )
}

export default SearchGroup