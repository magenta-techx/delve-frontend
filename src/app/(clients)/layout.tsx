'use client';
import { ReactNode } from 'react';
import { LandingPageNavbar, Footer } from './misc/components';
import { UserNotificationsProvider } from '@/contexts/UserNotificationsContext';
import { useIsMobile } from '@/hooks';
import { ClientNavbarBottom } from './misc/components/ClientNavbarBottom';
import { useUserContext } from '@/contexts/UserContext';

import { usePathname } from 'next/navigation';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const pathname = usePathname();
  const { isMobile, isLoading } = useIsMobile();
  const { user, isAuthenticated, isLoading: isLoadingUser } = useUserContext();
  const userIsloggedIn = !isLoading && isAuthenticated && Boolean(user);

  const isCreateListingPage = pathname === '/businesses/create-listing';

  return (
    <UserNotificationsProvider>
      <div className='min-h-dvh bg-gray-50'>
        {!isCreateListingPage && (
          <header className='fixed left-0 right-0 top-0 z-[100] w-full'>
            <LandingPageNavbar />
          </header>
        )}

        <main className=' '>{children}</main>

        <Footer />

        {!isCreateListingPage &&
          !isLoading &&
          !isLoadingUser &&
          isMobile &&
          userIsloggedIn && <ClientNavbarBottom />}
      </div>
    </UserNotificationsProvider>
  );
}
