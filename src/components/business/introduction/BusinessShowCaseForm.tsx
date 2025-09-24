'use client';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import BusinessIntroductionFormHeader from './BusinessFormHeader';

import FileUpload from '@/components/FileUpload';
import Image from 'next/image';
import { EffectCoverflow } from 'swiper/modules';
import BinIcon from '@/assets/icons/BinIcon';

interface BusinessShowCaseFormProps {
  setBusinessShowCaseFile: (files: File[]) => void;
}
const BusinessShowCaseForm = ({
  setBusinessShowCaseFile,
}: BusinessShowCaseFormProps): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleRemoveFile = (fileName: string): void => {
    const updatedFiles = files.filter(file => file.name !== fileName);
    setFiles(updatedFiles);
    setBusinessShowCaseFile(updatedFiles);
  };
  return (
    <div className='flex w-full flex-col items-center gap-4 sm:-mt-0 sm:w-[480px]'>
      <BusinessIntroductionFormHeader
        intro={'Business account setup'}
        header='Showcase Your Business '
        paragraph='Showcase your business by uploading multiple photos but only 1 video.'
      />
      {files.length > 0 && (
        <div className='w-[1200px]'>
          <Swiper
            spaceBetween={30}
            slidesPerView={5}
            centeredSlides
            onSlideChange={swiper => {
              const newIndex = swiper.activeIndex;
              setActiveIndex(newIndex);

              setBusinessShowCaseFile(files);
            }}
            slideToClickedSlide
            // className='flex w-full'
            className='flex w-full items-center justify-center py-5'
            autoplay
            modules={[EffectCoverflow]}
            coverflowEffect={{
              rotate: 0, // no rotation
              stretch: 0, // no stretch
              depth: 100, // depth perspective
              modifier: 2, // intensity of effect
              slideShadows: false, // keep clean without shadows
            }}
          >
            {files.map((file, index) => {
              const distance = Math.abs(index - activeIndex); // how far this slide is from center
              let scale = 'scale-100 opacity-50'; // default (far away)
              if (distance === 0)
                scale = 'scale-110 z-10 opacity-100 px-4'; // center slide
              else if (distance === 1) scale = 'scale-105 opacity-80'; // neighbors

              return (
                <SwiperSlide
                  key={file.name}
                  className='flex !w-[220px] justify-center'
                >
                  <div
                    className={`relative h-[180px] w-[220px] overflow-hidden rounded-lg duration-300 hover:cursor-pointer ${scale}`}
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className='rounded-lg object-cover'
                    />
                    {activeIndex === index && (
                      <button
                        className='absolute left-5 top-5 rounded bg-white p-2 shadow-lg'
                        onClick={() => handleRemoveFile(file.name)}
                      >
                        <BinIcon />
                      </button>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      <FileUpload
        onFileSelect={newFiles => {
          setFiles(newFiles);
          if (newFiles.length > 0) {
            setActiveIndex(0);
            setBusinessShowCaseFile(newFiles); // ✅ first file as default
          }
        }}
        files={files}
      />
    </div>
  );
};

export default BusinessShowCaseForm;
