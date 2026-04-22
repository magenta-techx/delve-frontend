'use client';
import { ReactNode } from 'react';
import { LandingPageNavbar, Footer } from './misc/components';
import { UserNotificationsProvider } from '@/contexts/UserNotificationsContext';
import { useIsMobile } from '@/hooks';
import { ClientNavbarBottom } from './misc/components/ClientNavbarBottom';
import { useUserContext } from '@/contexts/UserContext';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { isMobile, isLoading } = useIsMobile();
  const { user, isAuthenticated, isLoading: isLoadingUser } = useUserContext();
  const userIsloggedIn = !isLoading && isAuthenticated && Boolean(user);

  return (
    <UserNotificationsProvider>
      <div className='min-h-svh bg-gray-50'>
        <header className='fixed left-0 right-0 top-0 z-[49] w-full'>
          <LandingPageNavbar />
        </header>

        <main className=' '>{children}</main>

        <Footer />

        {!isLoading && !isLoadingUser && isMobile && userIsloggedIn && (
          <ClientNavbarBottom />
        )}
      </div>
    </UserNotificationsProvider>
  );
}
