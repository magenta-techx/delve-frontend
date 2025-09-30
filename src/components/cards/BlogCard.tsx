import { BaseIcons } from '@/assets/icons/base/Icons';
import Image from 'next/image'
import React from 'react'

interface BlogCardProps{
    imageUrl: string;
    header: string;
    containerClassStyle: string;
    imageClassStyle: string;
}
const BlogCard = ({ imageUrl, header, containerClassStyle, imageClassStyle }:BlogCardProps):JSX.Element => {

  return (
      <div className={`bg-[#F5F5F5] py-8 ${containerClassStyle} px-9 flex flex-col items-center rounded-2xl`}>
     
          <div className={`${imageClassStyle} mb-7`}>
              <Image src={imageUrl} alt={imageUrl} width={400} height={100} className='rounded-xl w-full h-full' />
          </div>
          <div className='border-b-[1px] pb-6 border-[#9AA4B2] h-[200px] w-[100%]'>
              <h2 className='text-[28px] font-inter font-medium mb-2'>{header}</h2>
              <p className='italic text-[17px] '>Planning your big day? Here’s what’s trending across weddings this year, from soft pastels in Port Harcourt to bold garden glam in Lagos. Nigerian couples are redefining elegance, and we’re here for it.</p>
          </div>
          <div className='flex justify-between items-center w-full mt-3'>
              <p className='font-semibold'>25th June,2025</p>
              <BaseIcons value='arrow-right-curve'/>
          </div>
    </div>
  )
}

export default BlogCard