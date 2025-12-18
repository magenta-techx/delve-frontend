import { ReactNode } from 'react';
import { LandingPageNavbar, Footer } from './misc/components';
import { UserNotificationsProvider } from '@/contexts/UserNotificationsContext';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <UserNotificationsProvider>
      <div className='min-h-screen bg-gray-50'>
        <header className='fixed left-0 right-0 top-0 z-[49] w-full'>
          <LandingPageNavbar />
        </header>

        <main className=' '>
          {children}
        </main>

        <Footer />
      </div>
    </UserNotificationsProvider>
  );
}
