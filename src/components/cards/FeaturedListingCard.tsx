import { BaseIcons } from '@/assets/icons/base/Icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


interface FeaturedListingCardProps {
    header: string;
    desc: string;
    imageUrl: string;
    logoUrl: string;
    address: string;
    classStyle: string;
    rating: number;
    group?: boolean;
}
const FeaturedListingCard = ({ header, desc, imageUrl, logoUrl, address, classStyle, rating, group =false,  }: FeaturedListingCardProps): JSX.Element => {
    return (
        <div className='border-[#FEC601] border-[2px] rounded-[28px] p-2'>
            <div className={`relative flex ${classStyle} ${group ? 'group':''} font-inter flex-col justify-center items-center rounded-lg `}>

            {/* Bookmark  */}
            <div className='absolute top-5 right-5 z-10'>
                <BaseIcons value='bookmark-white'/>
                </div>
                
                {
                    group && <Link
                        href={'/business/get-started'}
                        className='hidden group-hover:flex  h-14 w-[120px] relative z-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-center font-medium text-white'
                    >
                        <span> View</span>
                        <BaseIcons value='arrow-diagonal-white' />
                    </Link>
                }
                
            {/* background image  */}
            <Image src={imageUrl} alt={imageUrl} width={200} height={100} className='absolute w-full h-full' />
           
            {/* Content  */}
                <div className='absolute group-hover:opacity-0 duration-300 transition-opacity sm:h-32 h-28 w-full z-10 text-white from-black to-transparent rounded-bl-2xl bg-gradient-to-t rounded-br-2xl bottom-0 px-4 flex flex-col gap-2'>
                    <div className='border-b-[1px] border-b-white flex gap-2 sm:h-[85px] h-[70px]'>
                    <div className='h-20 w-20 rounded-full'>
                        <Image src={logoUrl} alt={logoUrl} width={200} height={100} className='h-ful w-full rounded-full' />
                    </div>
                    <div>
                            <h3 className='sm:text-xl text-[16px] font-bold'>{header}</h3>
                            <p className='sm:text-[13px] text-[10px]'>{desc}</p>
                    </div>
                </div>
                <div className='flex items-center text-[14px] justify-between'>
                    <div className='flex items-center gap-2'>
                        <BaseIcons value='marker-light-red' />
                            <span className='text-[#FFE6D5] text-[10px] sm:text-md'>{address}</span>
                    </div>
                        <div className='flex items-center gap-1 text-[10px] sm:text-md'>
                        <BaseIcons value='star-yellow' />
                        <p>{rating}</p>
                    </div>
                </div>
            </div>

        </div>
        </div>
    )
}

export default FeaturedListingCard