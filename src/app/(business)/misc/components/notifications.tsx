'use client';

import { useNotifications } from '@/app/(clients)/misc/api';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  type: string;
  attached_object_id: number;
  is_seen: boolean;
  message: string;
  created_when: string;
}

const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'review_prompt':
      return '⭐';
    case 'profile_views':
      return '👀';
    case 'free_trial_disabled':
      return '❌';
    case 'free_trial_expiring':
      return '⏰';
    case 'free_trial_enabled':
      return '✅';
    case 'business_created':
      return '🎉';
    case 'message':
      return '💬';
    case 'subscription':
      return '📋';
    default:
      return '📢';
  }
};

const getNotificationTypeLabel = (type: string): string => {
  switch (type) {
    case 'review_prompt':
      return 'Review Request';
    case 'profile_views':
      return 'Profile Views';
    case 'free_trial_disabled':
      return 'Trial Expired';
    case 'free_trial_expiring':
      return 'Trial Expiring';
    case 'free_trial_enabled':
      return 'Trial Started';
    case 'business_created':
      return 'Account Created';
    case 'message':
      return 'Message';
    case 'subscription':
      return 'Subscription';
    default:
      return 'Notification';
  }
};

export function Notifications() {
  const { currentBusiness } = useBusinessContext();
  
  const { data: notificationsData, isLoading } = useNotifications({
    notification_for: 'business',
    ...(currentBusiness?.id !== undefined && { business_id: currentBusiness.id }),
  });

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: Notification) => !n.is_seen).length;

  if (isLoading) {
    return (
      <div className='flex h-full flex-col bg-[#FFFFFF] p-2 rounded-xl'>
        <div className='border-b border-border p-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Notifications</h2>
            <div className='bg-gray-200 rounded-full px-2 py-1 text-xs animate-pulse'>
              ...
            </div>
          </div>
        </div>
        <div className='flex-1 p-4'>
          <div className='space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex items-start gap-3 animate-pulse'>
                <div className='w-8 h-8 bg-gray-200 rounded-full'></div>
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                  <div className='h-3 bg-gray-100 rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col bg-[#FFFFFF] p-2 rounded-xl'>
      <div className='border-b border-border p-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Notifications</h2>
          {unreadCount > 0 && (
            <span className='bg-red-500 text-white rounded-full px-2 py-1 text-xs font-medium min-w-[20px] text-center'>
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {notifications.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full p-6 text-center'>
            <div className='text-4xl mb-2'>📭</div>
            <h3 className='text-lg font-medium text-gray-900 mb-1'>No notifications yet</h3>
            <p className='text-sm text-gray-500'>We'll notify you when something important happens.</p>
          </div>
        ) : (
          <div className='divide-y divide-border'>
            {notifications.map((notification: Notification, index: number) => (
              <div
                key={index}
                className={`p-4 transition-colors hover:bg-muted/50 ${
                  !notification.is_seen ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className='flex items-start gap-3'>
                  <div className='text-lg flex-shrink-0'>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between mb-1'>
                      <span className='text-xs font-medium text-blue-600 uppercase tracking-wide'>
                        {getNotificationTypeLabel(notification.type)}
                      </span>
                      {!notification.is_seen && (
                        <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1'></div>
                      )}
                    </div>
                    <p className='text-sm text-foreground leading-relaxed'>
                      {notification.message}
                    </p>
                    <p className='mt-2 text-xs text-muted-foreground'>
                      {formatDistanceToNow(new Date(notification.created_when), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
