'use client';

import type React from 'react';
import { Sidebar } from '../misc/components/layout/Sidebar';
import { NavbarTop, NavbarBottom } from '../misc/components';
import { BusinessProvider, useBusinessContext } from '@/contexts/BusinessContext';
import { useIsMobile } from '@/hooks';
import { cn } from '@/lib/utils';
import { BusinessNotificationsProvider } from '@/contexts/BusinessNotificationsContext';
import { useUserContext } from '@/contexts/UserContext';

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {

  return (
    <BusinessProvider>
      <BusinessNotificationsProvider>
        <BusinessLayoutWrapper >
          {children}
        </BusinessLayoutWrapper>
      </BusinessNotificationsProvider>
    </BusinessProvider>
  );
}



const BusinessLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isMobile, isLoading: calculatingScreenWidth } = useIsMobile();
  const { user } = useUserContext()
  const { businesses } = useBusinessContext()

  return (
    <div
      className={cn(
        'flex h-screen bg-background',
        isMobile && businesses?.length > 0 ? 'grid !h-dvh grid-rows-[auto,1fr,auto' :
          isMobile ? 'flex !h-dvh flex-col' : ''
      )}
    >
      {calculatingScreenWidth ? null : isMobile ? <NavbarTop /> : <Sidebar />}

      {/* Main content */}
      <div className='flex flex-1 flex-col overflow-hidden bg-[#FCFCFD]'>
        {children}
      </div>

      {isMobile && user && user.is_brand_owner && businesses?.length > 0 && <NavbarBottom />}
    </div>
  )
}