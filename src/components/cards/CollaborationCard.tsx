import { BaseIcons } from '@/assets/icons/base/Icons';
import BinIcon from '@/assets/icons/BinIcon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface CollaborationCardProps {
  title: string;
  desc: string;
  count: number;
  imgUrl: string;
}
const CollaborationCard = ({
  title,
  desc,
  count,
  imgUrl,
}: CollaborationCardProps): JSX.Element => {
  const router = useRouter();
  return (
    <div className='relative rounded-2xl sm:h-[280px] sm:w-[475px]'>
      <Image
        src={imgUrl}
        alt={imgUrl}
        width={475}
        height={280}
        className='h-full w-full rounded-2xl object-cover'
      />
      <div className='absolute left-0 top-0 h-full w-full rounded-2xl bg-black/65'></div>

      <div className='absolute left-0 top-0 h-full w-full rounded-2xl p-2'>
        {/* Title  */}
        <div className='flex items-center justify-between rounded-xl bg-white px-5 sm:h-[64px] sm:w-[459px]'>
          <div className='flex items-center gap-3'>
            <BaseIcons value='folder-yellow' />
            <h1 className='font-semibold'>{title}</h1>
          </div>
          <button>
            {' '}
            <BinIcon />
          </button>
        </div>

        <div className='px-5 pt-4 sm:h-[172px]'>
          {/* Description  */}
          <div className='mb-4'>
            <small className='text-[14px] text-[#9AA4B2]'>Description</small>
            <p className='mt-3 text-[14px] text-white'>{desc}</p>
          </div>

          {/* Counts  */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1 text-white'>
              <span className='text-[14px]'>{count}</span>
              <BaseIcons value='people-outlined-white' />
            </div>
            <button
              className='flex items-center justify-center gap-2 rounded-lg border-[1px] border-[#ECE9FE] bg-[#ECE9FE] text-[12px] font-semibold text-primary sm:h-[33px] sm:w-[95px]'
              onClick={() => router.push('/business/collaboration')}
            >
              View Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationCard;
