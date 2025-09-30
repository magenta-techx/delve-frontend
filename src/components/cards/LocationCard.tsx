import Image from 'next/image';
import React from 'react'

interface LocationProps {
  name: string;
  imageUrl: string;
}

const LocationCard = ({ name, imageUrl }: LocationProps): JSX.Element => {
  return (
    <div className="group w-[360px] h-[210px] rounded-xl relative flex items-center justify-center overflow-hidden">
      {/* Dark overlay (fades out on hover) */}
      <div className="w-full h-full absolute rounded-xl bg-black/30 z-10 transition-opacity duration-300 group-hover:opacity-0"></div>

      {/* Image (contain → cover on hover) */}
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="group-hover:scale-125 transition-all duration-500 rounded-xl"
      />

      {/* Title (fades out on hover) */}
      <h1 className="relative z-10 text-[36px] font-bold text-white transition-opacity duration-300 group-hover:opacity-0">
        {name}
      </h1>
    </div>
  )
}

export default LocationCard;
