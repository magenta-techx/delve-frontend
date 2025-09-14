import Navbar from '@/components/Navbar';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps): Promise<JSX.Element> {
  return (
    <section
      className={`-z-10 h-screen bg-[url("/business/get-started.png")] bg-cover bg-top bg-no-repeat`}
    >
      <div className='insert-0 absolute h-screen w-full bg-black/60'></div>

      <div className='flex w-full flex-col items-center'>
        <Navbar type='community' authFormButtons={false} />

        {children}
      </div>
    </section>
  );
}
