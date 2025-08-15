import { Button } from '@/components/ui/Button';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
};

export default function SettingsPage(): JSX.Element {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences.
        </p>
      </div>

      <div className='space-y-6'>
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='mb-4 text-lg font-semibold'>Profile Information</h3>
          <div className='space-y-4'>
            <div className='grid gap-2'>
              <label htmlFor='name' className='text-sm font-medium'>
                Name
              </label>
              <input
                id='name'
                type='text'
                placeholder='Your name'
                className='rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <input
                id='email'
                type='email'
                placeholder='your.email@example.com'
                className='rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>

        <div className='rounded-lg border bg-card p-6'>
          <h3 className='mb-4 text-lg font-semibold'>Preferences</h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Email Notifications</p>
                <p className='text-xs text-muted-foreground'>
                  Receive email notifications about your account
                </p>
              </div>
              <input
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300'
                defaultChecked
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Marketing Emails</p>
                <p className='text-xs text-muted-foreground'>
                  Receive emails about new features and updates
                </p>
              </div>
              <input
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300'
              />
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-6'>
          <h3 className='mb-4 text-lg font-semibold text-destructive'>
            Danger Zone
          </h3>
          <p className='mb-4 text-sm text-muted-foreground'>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button variant='destructive'>Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
