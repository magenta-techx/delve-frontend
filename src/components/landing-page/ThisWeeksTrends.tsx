import { BaseIcons } from '@/assets/icons/base/Icons'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ThisWeeksTrends = (): JSX.Element => {
    return (
        <div className='h-[553px] relative w-[100%] flex items-center'>

            <div className='relative flex items-center w-[64%] h-full'>
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
            <div className='bg-[#FFF4ED] h-full w-[36%] pl-14 pt-14'>
                <div className='flex items-center gap-2'>
                    <BaseIcons value='rocket-outline-primary' />
                    <h1 className='text-[38px] font-karma'>This Week’s Trend</h1>
                </div>
                <p className='w-[420px] mb-5 text-[20px]'>Every week, Delve celebrates one outstanding business that’s captured the most attention, the most views, the most saves, the most chats. It’s our way of saying “Well done!” and giving them a free spotlight so more people can discover what makes them special.

                </p>
                <div className='flex items-center gap-5 mb-10'>

                    <Link href={'/'} className='flex h-14 w-[140px] items-center justify-center gap-2 rounded-md bg-primary text-center font-medium text-white'> View Business

                    </Link>
                    <Link href={'/'} className='flex h-14 w-[60px] items-center justify-center gap-2 rounded-md bg-white'>
                        <BaseIcons value='bookmark-outline-black' />
                    </Link>
                </div>

                <div>
                    <BaseIcons value='trophy-outline-primary' />
                </div>
            </div>


            {/* Center tinted content  */}
            <div className='absolute bg-black/70 rounded-xl left-[190px] w-[503px] h-[469px]'>
                <div className='absolute h-full w-full z-10 text-white flex flex-col gap-2 p-8'>

                    {/* Info  */}
                    <div className='border-b-[1px] border-b-white flex items-start gap-2 h-[85px]'>
                        <div className='h-[68px] w-28 bg-black rounded-full'>
                            <Image src={'/landingpage/lagos.png'} alt={'delve'} width={200} height={100} className='h-full w-full rounded-full' />
                        </div>
                        <div >
                            <h3 className='text-xl font-bold'>Ember Lagos</h3>
                            <p className='text-[13px]'>The Ember Table is where bold Nigerian flavors meet refined culinary flair. Our menu is rooted in tradition bu..</p>
                        </div>
                    </div>

                    {/* Contact  */}
                    <div className='flex items-center text-[14px] justify-between my-2'>
                        <div className='flex items-center gap-2'>
                            <BaseIcons value='marker-light-red' />
                            <span className='text-[#FFE6D5]'>12 Adebayo Street, Lekki Phase 1..</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <BaseIcons value='star-yellow' />
                            <p>4.8</p>
                        </div>
                    </div>

                    {/* Services  */}
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='bg-[#D9D9D938]/30 rounded-xl text-white flex items-center gap-2 py-3 px-4 text-[14px] w-[172px]'>
                            <BaseIcons value='food-and-drinks-white' />
                            <p>Food & Drinks</p>
                        </div>
                        <div className='bg-[#D9D9D938]/30 rounded-xl text-white flex items-center gap-2 py-3 px-4 text-[14px] w-[200px]'>
                            <BaseIcons value='calendar-white' />
                            <p>10am - 12pm, daily</p>
                        </div>
                        <div className='bg-[#D9D9D938]/30 rounded-xl text-white flex items-center gap-2 py-3 px-4 text-[14px] w-[90px]'>
                            <BaseIcons value='person-white' />
                            <p>258</p>
                        </div>
                    </div>

                    {/* images  */}
                    <div className='w-[449px] rounded-xl bg-black h-[219px]'>
                        <Image src={'/landingpage/trendz-4.jpg'} alt='' width={300} height={100} className='w-full h-full rounded-2xl'/>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ThisWeeksTrends