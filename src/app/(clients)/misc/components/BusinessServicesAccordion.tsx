'use client';

import { BusinessService } from '@/types/api';
import Image from 'next/image';
import { useState } from 'react';

function ServicesAccordion({ services }: { services: BusinessService[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(-1);
  return (
    <div className='w-full divide-y-[1.5px] divide-[#bebebe] overflow-hidden'>
      {services.map((service, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={service.id || idx}
            className='border-y-[1.5px] border-[#e6e6e6]'
          >
            <button
              className={
                'flex w-full items-center justify-between p-4 text-left transition hover:bg-gray-50 focus:outline-none md:p-6' +
                (isOpen ? ' bg-gray-50' : '')
              }
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
            >
              <div className='flex items-center gap-4'>
                <span className='min-w-[2.5rem] text-left font-karma text-sm font-semibold text-[#697586] opacity-60'>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className='font-karma text-lg font-semibold text-[#0F0F0F] md:text-xl lg:text-2xl'>
                  {service.title}
                </span>
              </div>
              <span className='text-xl font-light text-[#232323] opacity-60 md:text-3xl'>
                {isOpen ? '—' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className='flex grid-cols-2 flex-col gap-6 md:flex-row md:px-6 md:pb-8 lg:grid xl:grid-cols-[1fr_minmax(0,350px)]'>
                {/* <div className='flex  flex-col justify-center'> */}
                {service.description && (
                  <p className='self-end text-sm font-medium text-[#4B5565] md:text-base'>
                    {service.description}
                  </p>
                )}
                <div className='relative flex aspect-video flex-shrink-0 flex-col justify-end'>
                  <div className='relative h-full max-w-full md:max-h-[175px]'>
                    {service.image && (
                      <Image
                        src={service.image}
                        alt={service.title}
                        objectFit='cover'
                        fill
                        className='max-h-[175px]'
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ServicesAccordion;
