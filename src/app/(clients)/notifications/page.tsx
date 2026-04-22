'use client';

import React, { useState } from 'react';
import { BellRing } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import {
  useMarkAllNotifications,
  useMarkNotificationSeen,
  useNotifications,
} from '../misc/api';
import {
  NotificationRow,
  NotificationSkeletonRow,
  buildNotificationKey,
} from '../misc/components/NotificationsDropdown';
import type { NotificationItem } from '@/types/api';

export default function NotificationsPage() {
  const {
    data: notificationData,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useNotifications({ notification_for: 'user' });

  const markAllMutation = useMarkAllNotifications();
  const markNotificationSeenMutation = useMarkNotificationSeen();

  const [markingNotificationId, setMarkingNotificationId] = useState<
    number | string | null
  >(null);

  const rawNotifications = notificationData?.data ?? [];
  const notifications = rawNotifications.map((notification: any) => ({
    ...notification,
    created_when: notification.created_when ?? notification.created_at ?? '',
    is_seen: notification.is_seen ?? notification.is_read ?? false,
  }));
  const unreadCount = notifications.filter((item: any) => !item.is_seen).length;

  const handleMarkAll = () => {
    markAllMutation.mutate(undefined, {
      onSuccess: () => {
        refetchNotifications();
      },
    });
  };

  const handleMarkSingle = (notification: NotificationItem) => {
    const notificationId = notification.id;
    if (!notificationId || notification.is_seen) {
      return;
    }
    setMarkingNotificationId(notificationId);
    markNotificationSeenMutation.mutate(
      { notification_id: notificationId },
      {
        onSuccess: () => {
          refetchNotifications();
        },
        onSettled: () => {
          setMarkingNotificationId(null);
        },
      }
    );
  };

  return (
    <div className='min-h-svh bg-[#FCFCFD] pb-20 pt-20 md:pt-28 lg:pt-32'>
      <div className='container mx-auto max-w-3xl px-4 md:px-8'>
        <div className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold text-[#0F172B] md:text-3xl'>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className='flex h-7 min-w-7 items-center justify-center rounded-full bg-[#F3E8FF] px-2 text-sm font-bold text-[#6D28D9]'>
                {unreadCount}
              </span>
            )}
          </div>
          <Button
            type='button'
            variant='outline'
            className='whitespace-nowrap font-semibold text-[#5F2EEA] hover:bg-[#F3E8FF] hover:text-[#5F2EEA]'
            onClick={handleMarkAll}
            disabled={markAllMutation.isPending || !notifications.length}
            isLoading={markAllMutation.isPending}
          >
            Mark all as read
          </Button>
        </div>

        <div className='overflow-hidden rounded-2xl border border-[#ECE9FE] bg-white shadow-sm'>
          {notificationsLoading && (
            <div className='divide-y divide-[#F1F5F9]'>
              {Array.from({ length: 8 }).map((_, idx) => (
                <NotificationSkeletonRow key={`skeleton-${idx}`} />
              ))}
            </div>
          )}

          {!notificationsLoading && notifications.length === 0 && (
            <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F4F5] text-[#5F2EEA]'>
                <BellRing className='h-8 w-8' />
              </div>
              <h3 className='text-lg font-semibold text-[#0F172B]'>
                You&apos;re all caught up
              </h3>
              <p className='mt-2 max-w-sm text-sm text-[#94A3B8]'>
                We&apos;ll let you know when there&apos;s new collaboration
                invites, profile views or account updates.
              </p>
            </div>
          )}

          {!notificationsLoading && notifications.length > 0 && (
            <div className='divide-y divide-[#F1F5F9]'>
              {notifications.map((notification: any) => (
                <NotificationRow
                  key={buildNotificationKey(notification)}
                  item={notification}
                  onMarkSeen={handleMarkSingle}
                  isMarking={markingNotificationId === notification.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
