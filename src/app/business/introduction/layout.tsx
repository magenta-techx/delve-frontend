import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

interface SelectPlanLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: SelectPlanLayoutProps): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin-signup'); // 🚀 redirect if not authenticated
  }
  return (
    <section className='h-screen w-screen overflow-x-hidden bg-cover bg-center px-5 py-10 sm:bg-[url("/reset-Password-bg.png")] sm:px-20'>
      <div className='flex w-full flex-col items-center'>{children}</div>
    </section>
  );
}
