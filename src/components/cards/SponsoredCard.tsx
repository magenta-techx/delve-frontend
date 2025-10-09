import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const SponsoredCard = ({
  href,
  imageUrl,
  styleProps,
}: {
  href: string;
  imageUrl: string;
  styleProps?: string;
}): JSX.Element => {
  return (
    <div
      className={`relative ${styleProps ? styleProps : 'h-[273px] w-[353px] sm:h-[479px] sm:w-[745px]'}`}
    >
      <Image
        src={imageUrl}
        alt={imageUrl}
        width={400}
        height={300}
        className='h-full w-full object-contain'
      />
      <Link
        className='absolute bottom-[22px] left-0 flex h-[56px] w-[132px] items-center justify-center bg-[#BC1B06] text-white sm:bottom-0 sm:w-[184px]'
        href={href}
      >
        View
      </Link>
    </div>
  );
};

export default SponsoredCard;
