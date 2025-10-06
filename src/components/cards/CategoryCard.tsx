import { BaseIcons, IconsType } from '@/assets/icons/base/Icons';
import Image from 'next/image';
import React from 'react'


interface CategoryCardProps{
    icon: IconsType;
    hoverIcon: IconsType;
    title:string
}
const CategoryCard = ({ icon, title, hoverIcon }: CategoryCardProps): JSX.Element => {
  return (
      <button className='rounded-full sm:group  sm:w-[197px] sm:h-[197px] w-[110px] h-[110px] relative flex items-center justify-center'>
          
          <div className=' duration-500 absolute z-10 -top-1 sm:hidden flex sm:group-hover:flex -left-3 bg-white border-[#FEC601] border-[1px] rounded-full items-center justify-center sm:w-16 sm:h-16 h-10 w-10'>
              <BaseIcons value={hoverIcon} />
          </div>
          <Image src={'/landingpage/trendz-1.jpg'} alt='' width={200} height={200} className='absolute w-full h-full rounded-full' />
          <div className='absolute group-hover:bg-transparent transition-all duration-500 h-full w-full sm:bg-black/50 rounded-full'></div>
          <div className='relative z-10 flex sm:group-hover:hidden transition-all duration-500 flex-col h-[100px] items-center'>
              <div className='sm:flex hidden mb-8'>
                  <BaseIcons value={icon} />
            </div>
              <p className='text-white hidden sm:flex uppercase font-medium w-[114px] text-center text-[13px]'>{title}</p>
         </div>
      </button>
  )
}

export default CategoryCard