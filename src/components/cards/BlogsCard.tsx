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
      <div className={`${containerClassStyle} flex flex-col items-center border-[1px] border-[#9AA4B2] h-[530px]`}>
     
          <div className={`${imageClassStyle} mb-4`}>
              <Image src={imageUrl} alt={imageUrl} width={400} height={100} className='w-full h-[296]' />
          </div>
          <div className='mt-8 px-5 h-[150px] w-[100%]'>
              <h2 className='text-[20px] font-inter font-medium mb-2'>{header}</h2>
              <p className='text-[14px] border-b-[1px] line-clamp-3 border-[#9AA4B2] pb-3'>Planning your big day? Here’s what’s trending across weddings this year, from soft pastels in Port Harcourt to bold garden glam in Lagos...</p>
          </div>
          <div className='flex px-5 justify-between items-center mt-1 w-full'>
              <p className='text-sm'>25th June,2025</p>
              <BaseIcons value='arrow-right-curve'/>
          </div>
    </div>
  )
}

export default BlogCards