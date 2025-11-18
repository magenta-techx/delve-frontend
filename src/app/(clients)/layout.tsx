import { ReactNode } from 'react';
import { LandingPageNavbar, Footer } from './misc/components';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
      <div className='min-h-screen bg-gray-50'>
        <header className='fixed left-0 right-0 top-0 z-[49] w-full'>
          <LandingPageNavbar />
        </header>

        <main className='container mx-auto'>
          {children}
        </main>

        <Footer />
      </div>
  );
}
