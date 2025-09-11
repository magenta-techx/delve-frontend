import Navbar from '@/components/Navbar';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps): Promise<JSX.Element> {
  return (
    <section className='w-full overflow-x-hidden'>
      <Navbar type='business' authFormButtons={false} />

      <div className='flex w-full flex-col items-center'>{children}</div>
    </section>
  );
}
