import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface LocationProps {
  name: string;
  imageUrl: string;
}

const LocationCard = ({ name, imageUrl }: LocationProps): JSX.Element => {
  return (
    <Link href={`businesses/search?location=${name}`} className='group relative flex w-36 !aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl sm:h-[210px] sm:w-[360px]'>
      <div className='absolute z-10 h-full w-full rounded-xl bg-[#0000007A] transition-opacity duration-300 group-hover:opacity-0'></div>

      <Image
        src={imageUrl}
        alt={name}
        fill
        className='rounded-xl transition-all duration-500 group-hover:scale-125'
      />

      <h1 className='relative z-10 text-sm font-bold text-white transition-opacity duration-300 group-hover:opacity-0 lg:text-xl'>
        {name}
      </h1>
    </Link>
  );
};

export default LocationCard;
