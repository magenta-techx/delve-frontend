import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
        </div>
      </header>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-8 lg:grid-cols-4'>
          <aside className='lg:col-span-1'>
            <nav className='space-y-2'>
              <a
                href='/dashboard'
                className='block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent'
              >
                Overview
              </a>
              <a
                href='/dashboard/settings'
                className='block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent'
              >
                Settings
              </a>
            </nav>
          </aside>
          <main className='lg:col-span-3'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
