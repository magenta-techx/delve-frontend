'use client';

import type React from 'react';
import { useState } from 'react';
import { Sidebar } from '../misc/components/sidebar';
import { NavbarTop, NavbarBottom } from '../misc/components';
import { BusinessProvider } from '@/contexts/BusinessContext';
import { useIsMobile } from '@/hooks';
import { cn } from '@/lib/utils';

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const isMobile = useIsMobile();

  return (
    <BusinessProvider>
      <div
        className={cn(
          'flex h-screen bg-background',
          isMobile && 'grid grid-rows-[auto,1fr,auto] !h-dvh'
        )}
      >
        {isMobile ? <NavbarTop /> : <Sidebar />}

        {/* Main content */}
        <div className='flex flex-1 flex-col overflow-hidden bg-[#FCFCFD]'>
          {children}
        </div>


        {isMobile && <NavbarBottom />}
      </div>
    </BusinessProvider>
  );
}
