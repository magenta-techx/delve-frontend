import Image from 'next/image';
import React from 'react';

interface LocationProps {
  name: string;
  imageUrl: string;
}

const LocationCard = ({ name, imageUrl }: LocationProps): JSX.Element => {
  return (
    <div className='group relative flex h-[175px] w-[160px] items-center justify-center overflow-hidden rounded-xl sm:h-[210px] sm:w-[360px]'>
      {/* Dark overlay (fades out on hover) */}
      <div className='absolute z-10 h-full w-full rounded-xl bg-black/30 transition-opacity duration-300 group-hover:opacity-0'></div>

      {/* Image (contain → cover on hover) */}
      <Image
        src={imageUrl}
        alt={name}
        fill
        className='rounded-xl transition-all duration-500 group-hover:scale-125'
      />

      {/* Title (fades out on hover) */}








      
      <h1 className='relative z-10 text-[36px] font-bold text-white transition-opacity duration-300 group-hover:opacity-0'>
        {name}
      </h1>
    </div>
  );
};

export default LocationCard;
