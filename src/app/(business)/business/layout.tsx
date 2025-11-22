'use client';

import type React from 'react';
import { Sidebar } from '../misc/components/layout/Sidebar';
import { NavbarTop, NavbarBottom } from '../misc/components';
import { BusinessProvider } from '@/contexts/BusinessContext';
import { useIsMobile } from '@/hooks';
import { cn } from '@/lib/utils';

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { isMobile, isLoading: calculatingScreenWidth } = useIsMobile();

  return (
    <BusinessProvider>
      <div
        className={cn(
          'flex h-screen bg-background',
          isMobile && 'grid !h-dvh grid-rows-[auto,1fr,auto]'
        )}
      >
        {calculatingScreenWidth ? null : isMobile ? <NavbarTop /> : <Sidebar />}

        {/* Main content */}
        <div className='flex flex-1 flex-col overflow-hidden bg-[#FCFCFD]'>
          {children}
        </div>

        {isMobile && <NavbarBottom />}
      </div>
    </BusinessProvider>
  );
}
