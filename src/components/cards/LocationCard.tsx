import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface LocationProps {
  name: string;
  imageUrl: string;
}

const LocationCard = ({ name, imageUrl }: LocationProps): JSX.Element => {
  return (
    <Link
      href={`businesses/search?location=${name}`}
      className='group relative flex w-40 items-center justify-center overflow-hidden rounded-none group-hover:rounded-2xl max-md:!aspect-[160/175] sm:h-[210px] sm:w-full'
    >
      <div className='absolute z-10 h-full w-full rounded-xl bg-[#0000007A] transition-opacity duration-300 group-hover:opacity-0'></div>

      <Image
        src={imageUrl}
        alt={name}
        fill
        className='rounded-xl transition-all duration-500 group-hover:scale-125'
      />

      <h1 className='relative z-10 !overflow-hidden text-sm font-bold text-white transition-opacity duration-300 group-hover:opacity-0 lg:text-xl'>
        {name}
      </h1>
    </Link>
  );
};

export default LocationCard;
