import DashBoardLayout from '@/components/dashboard/DashBoardLayout';
import type { Metadata } from 'next';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../api/auth/[...nextauth]/route';
// import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard',
};

export default function DashboardPage(): JSX.Element {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>
          Dashboard Overview
        </h2>
        <p className='text-muted-foreground'>
          Welcome to your dashboard. Here&apos;s what&apos;s happening.{' '}
        </p>
        <DashBoardLayout />
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold'>Total Users</h3>
          <p className='text-3xl font-bold text-primary'>1,234</p>
          <p className='text-sm text-muted-foreground'>+12% from last month</p>
        </div>

        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold'>Revenue</h3>
          <p className='text-3xl font-bold text-primary'>$45,678</p>
          <p className='text-sm text-muted-foreground'>+8% from last month</p>
        </div>

        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold'>Active Sessions</h3>
          <p className='text-3xl font-bold text-primary'>567</p>
          <p className='text-sm text-muted-foreground'>+3% from last hour</p>
        </div>
      </div>

      <div className='rounded-lg border bg-card p-6'>
        <h3 className='mb-4 text-lg font-semibold'>Recent Activity</h3>
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <div className='h-2 w-2 rounded-full bg-primary'></div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>New user registered</p>
              <p className='text-xs text-muted-foreground'>2 minutes ago</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='h-2 w-2 rounded-full bg-secondary'></div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>Payment processed</p>
              <p className='text-xs text-muted-foreground'>5 minutes ago</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='h-2 w-2 rounded-full bg-accent'></div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>System backup completed</p>
              <p className='text-xs text-muted-foreground'>1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
