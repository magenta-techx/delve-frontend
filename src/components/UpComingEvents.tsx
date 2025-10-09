import { BaseIcons } from '@/assets/icons/base/Icons'
import React from 'react'

const UpComingEvents = ():JSX.Element => {
  return (
      <div className='bg-black items-center flex flex-col font-inter w-full sm:h-[842px] h-[550px] py-12 gap-10'>
          <div className='hidden sm:flex'>
              <BaseIcons value='upcoming-event-sample' />
          </div>
          <div className='sm:hidden flex'>
              <BaseIcons value='upcoming-event-sample-mobile' />
          </div>
          

          <div className='flex flex-col gap-2'>
              
              {/* Date and decription  */}
              <div className='flex items-center gap-2'>
                  <div className='sm:w-[100px] w-[84px] bg-[#FFFFFF] sm:h-[100px] h-[64px] rounded-lg sm:rounded-md flex items-center justify-center'>
                      <div className='flex flex-col w-full items-center justify-center sm:gap-2'>
                          <small className='sm:text-sm text-xs'>Jul</small>
                          <h1 className='text-[20px] sm:text-4xl font-semibold'>11</h1>
                      </div>
                  </div>
                  <div className='sm:pl-8 pl-4 sm:w-[643px] w-full h-[64px] sm:h-[100px] bg-[#FF9C66] rounded-lg sm:rounded-md flex items-center'>
                      <div className='font-inter'>
                          <h1 className='sm:text-[32px] text-[16px] font-semibold'>Innovation & Inspiration Week </h1>
                          <p className='text-[12px] sm:text-lg'>Opening ceremony & Innovation Workshop</p>
                      </div>
                  </div>
              </div>
              {/* Date and decription  */}
              <div className='flex items-center gap-2'>
                  <div className='sm:w-[100px] w-[84px] bg-[#D9D6FE] sm:h-[100px] h-[64px] rounded-lg sm:rounded-md flex items-center justify-center'>
                      <div className='flex flex-col w-full items-center justify-center sm:gap-2'>
                          <small className='sm:text-sm text-xs'>Jul</small>
                          <h1 className='text-[20px] sm:text-4xl font-semibold'>18</h1>
                      </div>
                  </div>
                  <div className='sm:pl-8 pl-4 sm:w-[643px] w-full h-[64px] sm:h-[100px] bg-[#F3FEE7] rounded-lg sm:rounded-md flex items-center'>
                      <div className='font-inter'>
                          <h1 className='sm:text-[32px] text-[16px] font-semibold'>Artistic Expression</h1>
                          <p className='text-[12px] sm:text-lg'>Creative Workshop</p>
                      </div>
                  </div>
              </div>
              {/* Date and decription  */}
              <div className='flex items-center gap-2'>
                  <div className='sm:w-[100px] w-[84px] bg-[#FF9C66] sm:h-[100px] h-[64px] rounded-lg sm:rounded-md flex items-center justify-center'>
                      <div className='flex flex-col w-full items-center justify-center sm:gap-2'>
                          <small className='sm:text-sm text-xs'>Jul</small>
                          <h1 className='text-[20px] sm:text-4xl font-semibold'>21</h1>
                      </div>
                  </div>
                  <div className='sm:pl-8 pl-4 sm:w-[643px] w-full h-[64px] sm:h-[100px] bg-[#FFFFFF] rounded-lg sm:rounded-md flex items-center'>
                      <div className='font-inter'>
                          <h1 className='sm:text-[32px] text-[16px] font-semibold'>Story Writing & Art Performance </h1>
                          <p className='text-[12px] sm:text-lg'>Opening ceremony & Innovation Workshop</p>
                      </div>
                  </div>
              </div>
             
              {/* Date and decription  */}
              <div className='flex items-center gap-2'>
                  <div className='sm:w-[100px] w-[84px] bg-[#F3FEE7] sm:h-[100px] h-[64px] rounded-lg sm:rounded-md flex items-center justify-center'>
                      <div className='flex flex-col w-full items-center justify-center sm:gap-2'>
                          <small className='sm:text-sm text-xs'>Jul</small>
                          <h1 className='text-[20px] sm:text-4xl font-semibold'>28</h1>
                      </div>
                  </div>
                  <div className='sm:pl-8 pl-4 sm:w-[643px] w-full h-[64px] sm:h-[100px] bg-[#D9D6FE] rounded-lg sm:rounded-md flex items-center'>
                      <div className='font-inter'>
                          <h1 className='sm:text-[32px] text-[16px] font-semibold'>Reflect & Network</h1>
                          <p className='text-[12px] sm:text-lg'>Opening ceremony & Innovation Workshop</p>
                      </div>
                  </div>
              </div></div>
    </div>
  )
}

export default UpComingEvents