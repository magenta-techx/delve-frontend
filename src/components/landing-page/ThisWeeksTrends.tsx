import { BaseIcons } from '@/assets/icons/base/Icons'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ThisWeeksTrends = (): JSX.Element => {
    return (
        <div className='sm:h-[553px] h-[513px] relative w-[100%] flex flex-col sm:flex-row items-center'>


            {/* Desktop  */}
            <div className='relative hidden sm:flex items-center sm:w-[64%] w-full h-full'>
                <div className='w-full h-full absolute bg-black/50'></div>
                <div className='w-[50%] h-full'>
                    <Image src={'/landingpage/trendz-1.jpg'} alt='trendz' width={200} height={100} className='w-full h-full' />
                </div>
                <div className='w-[50%] bg-black h-full'>
                    <div className='h-[50%]'>
                        <Image src={'/landingpage/trendz-2.jpg'} alt='trendz' width={200} height={100} className='w-full h-full' />
                    </div>
                    <div className='h-[50%]'>
                        <Image src={'/landingpage/trendz-3.jpg'} alt='trendz' width={200} height={100} className='w-full h-full' />
                    </div>

                </div>
            </div>

            {/* Mobile  */}
            <div className='relative sm:hidden flex flex-col items-center w-full h-full'>
                <div className='w-full h-full absolute bg-black/50'></div>
                <div className='w-full h-full'>
                    <Image src={'/landingpage/trendz-2.jpg'} alt='trendz' width={200} height={100} className='w-full h-full' />
                </div>
                <div className='w-full flex h-full'>
                    <div className='h-[199.76px] w-1/2'>
                        <Image src={'/landingpage/trendz-1.jpg'} alt='trendz' width={200} height={100} className='w-full h-full' />
                    </div>
                    <div className='h-[199.76px] w-1/2'>
                        <Image src={'/landingpage/trendz-3.jpg'} alt='trendz' width={200} height={100} className='w-full object-cover h-full' />
                    </div>

                </div>
            </div>
            <div className='bg-[#FFF4ED] h-full sm:w-[36%] sm:pl-14 sm:pt-14 w-full px-4 pt-10 pb-3'>
                <div className='flex items-center gap-2'>
                    <BaseIcons value='rocket-outline-primary' />
                    <h1 className='sm:text-[38px] text-[20px] font-karma'>This Week’s Trend</h1>
                </div>
                <p className='sm:w-[420px] w-full mb-5 sm:text-[20px] text-[12px]'>Every week, Delve celebrates one outstanding business that’s captured the most attention, the most views, the most saves, the most chats. It’s our way of saying “Well done!” and giving them a free spotlight so more people can discover what makes them special.

                </p>
                <div className='flex items-center justify-between sm:justify-start gap-5 mb-10'>

                    <Link href={'/'} className='flex sm:h-14 sm:w-[140px] h-[46px] w-[122px] text-[12px] sm:text-lg items-center justify-center gap-2 rounded-md bg-primary text-center font-medium text-white'> View Business

                    </Link>
                    <Link href={'/'} className='flex sm:h-14  h-[42px] w-[42px] sm:w-[60px] items-center justify-center gap-2 rounded-md bg-white'>
                        <BaseIcons value='bookmark-outline-black' />
                    </Link>
                </div>

                <div>
                    <BaseIcons value='trophy-outline-primary' />
                </div>
            </div>


            {/* Center tinted content  */}
            <div className='absolute bg-black/70 rounded-xl sm:left-[190px] sm:w-[503px] w-[292px] top-10 sm:h-[469px] h-[305px]'>
                <div className='absolute h-full w-full z-10 text-white flex flex-col gap-2 sm:p-8 p-2'>

                    {/* Info  */}
                    <div className='border-b-[1px] border-b-white flex items-center gap-2 h-[85px] sm:-mt-5'>
                        <div className='sm:h-[50px] sm:w-[50px] h-[46px] w-[46px] rounded-full shrink-0'>
                            <Image src={'/landingpage/lagos.png'} alt={'delve'} width={200} height={100} className='h-full w-full object-cover rounded-full' />
                        </div>
                        <div >
                            <h3 className='sm:text-xl text-[14px] font-bold'>Ember Lagos</h3>
                            <p className='text-[13px] line-clamp-2 '>The Ember Table is where bold Nigerian flavors meet refined culinary flair. Our menu is rooted in tradition bu..</p>
                        </div>
                    </div>

                    {/* Contact  */}
                    <div className='flex items-center text-[14px] justify-between my-2'>
                        <div className='flex items-center gap-2'>
                            <BaseIcons value='marker-light-red' />
                            <span className='text-[#FFE6D5] truncate text-[10px] sm:text-sm'>12 Adebayo Street, Lekki Phase 1..</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <BaseIcons value='star-yellow' />
                            <p>4.8</p>
                        </div>
                    </div>

                    {/* Services  */}
                    <div className='flex items-center sm:gap-3 gap-1 sm:mb-4'>
                        <div className='bg-[#D9D9D938]/30 rounded-xl text-white flex items-center gap-2 sm:py-3 py-2 sm:px-4 px-2 text-[9px] sm:text-[14px] w-[172px]'>

                            <div className='sm:w-full w-[10px] h-[10px] flex justify-center items-center'>
                                <BaseIcons value='food-and-drinks-white' />
                            </div>
                            <p>Food & Drinks</p>
                        </div>
                        <div className='bg-[#D9D9D938]/30 rounded-xl text-white flex items-center gap-2 sm:py-3 py-2 sm:px-4 px-2 text-[8px] sm:text-[14px] w-[200px]'>

                            <div className='sm:w-full w-[8px] h-[8px] flex justify-center items-center'>
                                <BaseIcons value='calendar-white' />
                            </div>
                            <p>10am - 12pm, daily</p>
                        </div>
                        <div className='bg-[#D9D9D938]/30 rounded-xl text-white flex items-center gap-2 sm:py-3 py-2 sm:px-4 px-2 text-[9px] sm:text-[14px] w-[90px]'>
                            <div className='sm:w-full w-[10px] h-[10px] flex justify-center items-center'>
                                <BaseIcons value='person-white' />
                            </div>
                            <p>258</p>
                        </div>
                    </div>

                    {/* images  */}
                    <div className='sm:w-[449px] w-full rounded-xl bg-black h-[219px] sm:flex '>
                        <Image src={'/landingpage/trendz-4.jpg'} alt='' width={300} height={100} className='w-full h-full rounded-2xl'/>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ThisWeeksTrends