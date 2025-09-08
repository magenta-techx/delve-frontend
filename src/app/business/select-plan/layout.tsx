import Navbar from '@/components/Navbar';
import type { ReactNode } from 'react';

interface SelectPlanLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: SelectPlanLayoutProps): Promise<JSX.Element> {
  return (
    <section className='h-screen w-screen overflow-x-hidden bg-cover bg-center px-5 py-10 sm:bg-[url("/reset-Password-bg.png")] sm:px-20'>
      <Navbar authFormButtons={false} />
      <div className='flex w-full flex-col items-center'>{children}</div>
    </section>
  );
}
