'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BadgeCheck,
  BellRing,
  Clock3,
  CreditCard,
  Eye,
  ShieldAlert,
  Sparkles,
  Store,
} from 'lucide-react';

import type { NotificationItem } from '@/types/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  useMarkAllNotifications,
  useMarkNotificationSeen,
  useNotifications,
} from '../api';

type NotificationVisual = {
  label: string;
  icon: LucideIcon;
  className: string;
};

const notificationVisuals: Record<string, NotificationVisual> = {
  profile_views: {
    label: 'Profile views',
    icon: Eye,
    className: '!fill-[#F4EDFF] text-[#5F2EEA]',
  },
  free_trial_enabled: {
    label: 'Free trial activated',
    icon: BadgeCheck,
    className: '!fill-[#ECFDF5] text-[#047857]',
  },
  free_trial_expiring: {
    label: 'Free trial expiring',
    icon: Clock3,
    className: '!fill-[#FFF7ED] text-[#C2410C]',
  },
  free_trial_disabled: {
    label: 'Free trial ended',
    icon: ShieldAlert,
    className: '!fill-[#FEF2F2] text-[#B91C1C]',
  },
  payment_received: {
    label: 'Payment received',
    icon: CreditCard,
    className: '!fill-[#E0F2FE] text-[#0369A1]',
  },
  subscription_created: {
    label: 'Subscription updated',
    icon: Sparkles,
    className: '!fill-[#FDF4FF] text-[#C026D3]',
  },
  business_created: {
    label: 'Business created',
    icon: Store,
    className: '!fill-[#F5F3FF] text-[#6D28D9]',
  },
};

const defaultNotificationVisual: NotificationVisual = {
  label: 'Notification',
  icon: BellRing,
  className: 'bg-[#EEF2FF] text-[#4C1D95]',
};

export const NotificationsDropdownContent = () => {
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
  const notifications = rawNotifications.map(notification => ({
    ...notification,
    created_when: notification.created_when ?? notification.created_at ?? '',
    is_seen: notification.is_seen ?? notification.is_read ?? false,
  }));
  const unreadCount = notifications.filter(item => !item.is_seen).length;

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
    <div className='w-[380px] max-h-[500px] overflow-hidden flex flex-col'>
      <header className='sticky top-0 z-[3] bg-white flex flex-wrap items-center gap-4 border-b border-[#F1F5F9] px-4 py-4'>
        <div className='flex flex-1 items-center gap-3'>
          <h2 className='text-base font-semibold text-[#0F172B]'>Notifications</h2>
          {unreadCount > 0 && (
            <span className='rounded-full bg-[#F3E8FF] px-2.5 py-0.5 text-xs font-semibold text-[#6D28D9]'>
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='text-xs font-semibold text-[#5F2EEA] hover:bg-transparent'
          onClick={handleMarkAll}
          disabled={markAllMutation.isPending || !notifications.length}
          isLoading={markAllMutation.isPending}
        >
          Mark all as read
        </Button>
      </header>

      <div className='overflow-y-auto flex-1'>
        {notificationsLoading && (
          <div className='divide-y divide-[#F1F5F9]'>
            {Array.from({ length: 4 }).map((_, idx) => (
              <NotificationSkeletonRow key={`skeleton-${idx}`} />
            ))}
          </div>
        )}

        {!notificationsLoading && notifications.length === 0 && (
          <div className='px-6 py-12 text-center'>
            <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F5] text-[#5F2EEA]'>
              <BellRing className='h-5 w-5' />
            </div>
            <p className='text-sm font-semibold text-[#0F172B]'>
              You're all caught up
            </p>
            <p className='mt-1 text-xs text-[#94A3B8]'>
              We'll let you know when there's something new.
            </p>
          </div>
        )}

        {!notificationsLoading && notifications.length > 0 && (
          <div className='divide-y divide-[#F1F5F9]'>
            {notifications.slice(0, 10).map(notification => (
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
  );
};

type NotificationRowProps = {
  item: NotificationItem;
  onMarkSeen: (notification: NotificationItem) => void;
  isMarking: boolean;
};

const NotificationRow = ({
  item,
  onMarkSeen,
  isMarking,
}: NotificationRowProps) => {
  const visual = getNotificationVisual(item);
  const timestamp = formatNotificationDate(
    item.created_when ?? item.created_at
  );
  const Icon = visual?.icon;
  const isSeen = item.is_seen ?? false;
  const message =
    item.message ?? item.body ?? item.title ?? 'Notification update';
  const canMark = Boolean(item.id && !isSeen);

  const handleClick = () => {
    if (canMark) {
      onMarkSeen(item);
    }
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={!canMark || isMarking}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
        isSeen ? 'bg-white' : 'bg-[#F8F5FF]',
        canMark && !isMarking
          ? 'cursor-pointer hover:bg-[#F3ECFF]'
          : 'cursor-default',
        (!canMark || isMarking) && 'opacity-70'
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          visual?.className
        )}
      >
        {!!Icon && <Icon className='h-4 w-4' />}
      </span>
      <div className='flex-1 min-w-0'>
        <p
          className={cn(
            'text-sm text-[#0F172B] truncate',
            !isSeen && 'font-medium'
          )}
        >
          {message}
        </p>
        <p className='mt-0.5 text-[11px] text-[#94A3B8]'>
          {timestamp.dayLabel} • {timestamp.timeLabel}
        </p>
      </div>
    </button>
  );
};

const NotificationSkeletonRow = () => (
  <div className='flex items-center gap-3 px-4 py-3'>
    <div className='h-9 w-9 animate-pulse rounded-full bg-[#E2E8F0]' />
    <div className='flex-1 space-y-1.5'>
      <div className='h-3 w-3/4 animate-pulse rounded-full bg-[#E2E8F0]' />
      <div className='h-2 w-1/3 animate-pulse rounded-full bg-[#E2E8F0]' />
    </div>
  </div>
);

function buildNotificationKey(item: NotificationItem) {
  return String(
    item.id ?? `${item.type}-${item.attached_object_id}-${item.created_when}`
  );
}

function formatNotificationDate(input?: string) {
  if (!input) {
    return { dayLabel: '—', timeLabel: '--:--' };
  }
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return { dayLabel: '—', timeLabel: '--:--' };
  }
  const dayLabel = date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
  const timeLabel = date
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase();
  return { dayLabel, timeLabel };
}

function getNotificationVisual(item: NotificationItem) {
  if (item.type && notificationVisuals[item.type]) {
    return notificationVisuals[item.type];
  }
  return defaultNotificationVisual;
}

export default NotificationsDropdownContent;
