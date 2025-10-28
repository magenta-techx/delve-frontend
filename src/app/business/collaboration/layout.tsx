import NavbarWhiteBg from '@/components/navbar/NavbarWhiteBg';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps): Promise<JSX.Element> {
  return (
    <section className='w-full overflow-x-hidden bg-[#FCFCFD]'>
      <NavbarWhiteBg />
      <div className='flex w-full flex-col items-center'>{children}</div>
    </section>
  );
}
