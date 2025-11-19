'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { MessagesSelectedIcon } from '../icons';
import { NotificationsIcon } from '@/app/(clients)/misc/icons';

const NavProfileSection = () => {
  const { status, data } = useSession();
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (status !== 'authenticated') {
    return null;
  }

  return (
    <nav className='flex h-16 items-center justify-end gap-4 p-4 lg:px-6'>
      <Link
        href='/business/messages'
        className='flex size-8 items-center justify-center rounded-full bg-[#F5F3FF] hover:bg-[#c3b9f7]'
      >
        <MessagesSelectedIcon className='size-5 text-[#000]' />
      </Link>
      <Link
        href='/business/notifications'
        className='flex size-8 items-center justify-center rounded-full bg-[#F5F3FF] hover:bg-[#c3b9f7]'
      >
        <NotificationsIcon className='size-5 text-[#000]' />
      </Link>
    </nav>
  );
};

export default NavProfileSection;
