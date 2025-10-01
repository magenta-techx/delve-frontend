import { BaseIcons } from '@/assets/icons/base/Icons'
import React from 'react'

const UpComingEvents = ():JSX.Element => {
  return (
      <div className='bg-black items-center flex flex-col font-inter w-full h-[842px] py-12 gap-10'>
          <BaseIcons value='upcoming-event-sample' />
          

          <div className='flex flex-col gap-2'>
              
              {/* Date and decription  */}
              <div className='flex items-center gap-2'>
                  <div className='w-[100px] bg-[#FFFFFF] h-[100px] rounded-md flex items-center justify-center'>
                      <div className='flex flex-col w-full items-center justify-center gap-2'>
                          <small className='text-sm'>Jul</small>
                          <h1 className='text-4xl font-semibold'>11</h1>
                      </div>
                  </div>
                  <div className='pl-8 w-[643px] h-[100px] bg-[#FF9C66] rounded-md flex items-center'>
                      <div className='font-inter'>
                          <h1 className='text-[32px] font-semibold'>Innovation & Inspiration Week </h1>
                          <p>Opening ceremony & Innovation Workshop</p>
                      </div>
                  </div>
              </div>
              {/* Date and decription  */}
              <div className='flex items-center gap-2'>
                  <div className='w-[100px] bg-[#D9D6FE] h-[100px] rounded-md flex items-center justify-center'>
                      <div className='flex flex-col w-full items-center justify-center gap-2'>
                          <small className='text-sm'>Jul</small>
                          <h1 className='text-4xl font-semibold'>18</h1>
                      </div>
                  </div>
                  <div className='pl-8 w-[643px] h-[100px] bg-[#F3FEE7] rounded-md flex items-center'>
                      <div className='font-inter'>
                          <h1 className='text-[32px] font-semibold'>Artistic Expression</h1>
                          <p>Creative Workshop</p>
                      </div>
                  </div>
              </div>
              {/* Date and decription  */}
              <div className='flex items-center gap-2'>
                  <div className='w-[100px] bg-[#FF9C66] h-[100px] rounded-md flex items-center justify-center'>
                      <div className='flex flex-col w-full items-center justify-center gap-2'>
                          <small className='text-sm'>Jul</small>
                          <h1 className='text-4xl font-semibold'>21</h1>
                      </div>
                  </div>
                  <div className='pl-8 w-[643px] h-[100px] bg-[#FFFFFF] rounded-md flex items-center'>
                      <div className='font-inter'>
                          <h1 className='text-[32px] font-semibold'>Story Writing & Art Performance </h1>
                          <p>Opening ceremony & Innovation Workshop</p>
                      </div>
                  </div>
              </div>
             
              {/* Date and decription  */}
              <div className='flex items-center gap-2'>
                  <div className='w-[100px] bg-[#F3FEE7] h-[100px] rounded-md flex items-center justify-center'>
                      <div className='flex flex-col w-full items-center justify-center gap-2'>
                          <small className='text-sm'>Jul</small>
                          <h1 className='text-4xl font-semibold'>28</h1>
                      </div>
                  </div>
                  <div className='pl-8 w-[643px] h-[100px] bg-[#D9D6FE] rounded-md flex items-center'>
                      <div className='font-inter'>
                          <h1 className='text-[32px] font-semibold'>Reflect & Network</h1>
                          <p>Opening ceremony & Innovation Workshop</p>
                      </div>
                  </div>
              </div></div>
    </div>
  )
}

export default UpComingEvents