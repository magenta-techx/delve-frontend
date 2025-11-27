'use client';

import { useNotifications } from '@/app/(clients)/misc/api';
import { useBusinessContext } from '@/contexts/BusinessContext';

export function Notifications() {
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'New message from John Mark',
      time: 'Fri, 23 Aug 04:32 pm',
      icon: '💬',
    },
    {
      id: 2,
      type: 'message',
      title: 'New message from John Mark',
      time: 'Fri, 23 Aug 04:32 pm',
      icon: '💬',
    },
    {
      id: 3,
      type: 'subscription',
      title: 'Subscription successful. View your plan',
      time: 'Fri, 23 Aug 04:32 pm',
      icon: '📋',
    },
    {
      id: 4,
      type: 'account',
      title:
        'Business account created successfully. 🎉 You can view business profile.',
      time: 'Fri, 23 Aug 04:32 pm',
      icon: '✅',
    },
  ];
    const { currentBusiness, } = useBusinessContext();
  
  const {} = useNotifications({
    notification_for: 'business',
    ...(currentBusiness?.id !== undefined && { business_id: currentBusiness.id }),
  });

  return (
    <div className='flex h-full flex-col bg-[#FFFFFF] p-2 rounded-xl'>
      <div className='border-b border-border p-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Notifications</h2>
          <span className='bg-sidebar-primary text-sidebar-primary-foreground rounded-full px-2 py-1 text-xs'>
            1
          </span>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='divide-y divide-border'>
          {notifications.map(notification => (
            <div
              key={notification.id}
              className='p-4 transition-colors hover:bg-muted/50'
            >
              <div className='flex items-start gap-3'>
                <div className='text-lg'>{notification.icon}</div>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm text-foreground'>
                    {notification.title}
                  </p>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
