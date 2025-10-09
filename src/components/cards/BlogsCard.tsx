import { BaseIcons } from '@/assets/icons/base/Icons';
import Image from 'next/image'
import React from 'react'

interface BlogCardsProps{
    imageUrl: string;
    header: string;
    containerClassStyle: string;
    imageClassStyle: string;
}
const BlogCards = ({ imageUrl, header, containerClassStyle, imageClassStyle }:BlogCardsProps):JSX.Element => {

  return (
      <div className={`${containerClassStyle} flex flex-col items-center border-[1px] border-[#9AA4B2] sm:h-[535px]`}>
     
          <div className={`${imageClassStyle} mb-3`}>
              <Image src={imageUrl} alt={imageUrl} width={400} height={100} className='w-full h-full object-cover object-top' />
          </div>
          <div className='px-5 sm:h-[150px] w-[100%]'>
              <h2 className='sm:text-[20px] text-[14px] font-inter font-medium mb-2'>{header}</h2>
              <p className='text-[14px] border-b-[1px] sm:line-clamp-3 line-clamp-2 border-[#9AA4B2] pb-3'>Planning your big day? Here’s what’s trending across weddings this year.</p>
          </div>
          <div className='flex px-5 justify-between items-center sm:-mt-4 w-full my-2'>
              <p className='text-sm'>25th June,2025</p>
              <BaseIcons value='arrow-right-curve'/>
          </div>
    </div>
  )
}

export default BlogCards