import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { SponsoredAds } from '../api/sponsored';

const SponsoredAdsCard = ({
  ad,
}: {
  ad: SponsoredAds
}): JSX.Element => {
  return (
    <div
      className={`relative overflow-hidden h-[273px] w-[353px] sm:h-[479px] sm:w-[745px]`}
    >
      <Image
        src={ad.image}
        alt={ad.image}
        width={400}
        height={300}
        className='h-full w-full object-cover'
      />
      <Link
        className='absolute bottom-0 left-0 flex h-[56px] w-[132px] items-center justify-center bg-[#BC1B06] text-white sm:w-[184px]'
        href={`/businesses/${ad.business_id}?ref=${ad.id}`}
      >
        View
      </Link>
    </div>
  );
};

export default SponsoredAdsCard;
