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
      className={`h-screen overflow-x-hidden bg-[url("/business/get-started.png")] bg-cover bg-top bg-no-repeat bg-blend-overlay`}
    >
      <div className='absolute inset-0 h-full w-full bg-black/60'></div>

      <Navbar type='community' authFormButtons={false} />

      <div className='flex w-full flex-col items-center'>{children}</div>
    </section>
  );
}
