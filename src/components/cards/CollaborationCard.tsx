import { BaseIcons } from '@/assets/icons/base/Icons';
import BinIcon from '@/assets/icons/BinIcon';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'


interface CollaborationCardProps{
    title: string;
    desc: string;
    count: number;
    imgUrl:string
}
const CollaborationCard = ({
    title,
    desc,
    count,
    imgUrl, }: CollaborationCardProps): JSX.Element => {
    
    const router = useRouter()
  return (
      <div className='relative sm:h-[280px] sm:w-[475px] rounded-2xl'>
          <Image src={imgUrl} alt={imgUrl} width={475} height={280} className='h-full w-full object-cover rounded-2xl' />
          <div className="absolute w-full h-full left-0 top-0 bg-black/65 rounded-2xl"></div>

          <div className="absolute w-full h-full rounded-2xl top-0 left-0 p-2">
              {/* Title  */}
              <div className='sm:h-[64px] sm:w-[459px] bg-white rounded-xl flex items-center justify-between px-5'>
                  <div className="flex items-center gap-3">
                      <BaseIcons value='folder-yellow' />
                      <h1 className='font-semibold'>{title}</h1></div>
                  <button> <BinIcon /></button>
              </div>

              <div className='sm:h-[172px] px-5 pt-4'>
                  {/* Description  */}
                  <div className='mb-4'>
                      <small className='text-[14px] text-[#9AA4B2]'>Description</small>
                      <p className='text-[14px] text-white mt-3'>{desc}</p>
                  </div>

                  {/* Counts  */}
                  <div className='flex items-center justify-between'>
                      <div className='flex text-white items-center gap-1'>
                          <span className='text-[14px]'>{count}</span>
                          <BaseIcons value='people-outlined-white' />
                      </div>
                      <button className="sm:h-[33px] sm:w-[95px] border-[1px] border-[#ECE9FE]  bg-[#ECE9FE] text-primary font-semibold text-[12px] flex items-center justify-center rounded-lg gap-2" onClick={() => router.push('/business/collaboration')}>View Group</button>
                  </div>
            </div>
        </div>
    </div>
  )
}

export default CollaborationCard