'use client';

import type { ChangeEventHandler } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
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

import { useGetProfile } from '@/hooks/user/useGetProfile';
import type { NotificationItem } from '@/types/api';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';

import {
  useMarkAllNotifications,
  useMarkNotificationSeen,
  useNotifications,
} from '../misc/api';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  passwordPlaceholder: string;
};

const defaultFormState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  passwordPlaceholder: '********',
};

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

const NotificationsPage = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? null;

  const { data: profileData, isLoading: profileLoading } =
    useGetProfile(userEmail);
  const {
    data: notificationData,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useNotifications({ notification_for: 'user' });
  const markAllMutation = useMarkAllNotifications();
  const markNotificationSeenMutation = useMarkNotificationSeen();

  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [markingNotificationId, setMarkingNotificationId] = useState<
    number | string | null
  >(null);
  useEffect(() => {
    if (profileData) {
      setFormState(prev => ({
        ...prev,
        firstName: profileData.first_name ?? '',
        lastName: profileData.last_name ?? '',
        email: profileData.email ?? userEmail ?? '',
      }));
    }
  }, [profileData, userEmail]);

  const displayName = useMemo(() => {
    const fallback = session?.user?.name || 'Delve user';
    const composed = [profileData?.first_name, profileData?.last_name]
      .filter(Boolean)
      .join(' ');
    return composed || fallback;
  }, [profileData?.first_name, profileData?.last_name, session?.user?.name]);

  const joinedDate = profileData?.['date_joined'] as string | undefined;
  const joinDateLabel = useMemo(() => formatJoinDate(joinedDate), [joinedDate]);

  const rawNotifications = notificationData?.data ?? [];
  const notifications = rawNotifications.map(notification => ({
    ...notification,
    created_when: notification.created_when ?? notification.created_at ?? '',
    is_seen: notification.is_seen ?? notification.is_read ?? false,
  }));
  const unreadCount = notifications.filter(item => !item.is_seen).length;

  const avatarImage =
    (profileData?.['profile_image'] as string | null | undefined) ??
    session?.user?.image ??
    null;

  const handleFieldChange =
    (field: 'firstName' | 'lastName'): ChangeEventHandler<HTMLInputElement> =>
    event => {
      const { value } = event.target;
      setFormState(prev => ({ ...prev, [field]: value }));
    };

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
    <div className='min-h-screen bg-[#F8F7FB] px-4 py-6 sm:px-6 lg:px-12'>
      <div className='mx-auto max-w-6xl lg:max-w-7xl'>
        <header className='flex flex-col gap-2'>
          <p className='text-sm font-semibold uppercase tracking-wide text-[#7C3AED]'>
            Profile Settings
          </p>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-3xl font-semibold text-[#0F172B]'>
              Profile Settings
            </h1>
            {joinDateLabel && (
              <Badge className='rounded-2xl bg-[#FFF5F0] px-4 py-1 text-xs font-semibold text-[#B45309] shadow-sm'>
                Joined&nbsp;{joinDateLabel}
              </Badge>
            )}
          </div>
          <p className='text-sm text-[#6B7280]'>
            Update your personal information and review the latest happenings
            around your collaborations.
          </p>
        </header>

        <div className='mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.6fr)]'>
          <ProfilePanel
            isLoading={profileLoading && !profileData}
            formState={formState}
            displayName={displayName}
            avatarUrl={avatarImage}
            onFirstNameChange={handleFieldChange('firstName')}
            onLastNameChange={handleFieldChange('lastName')}
          />

          <NotificationsPanel
            notifications={notifications}
            isLoading={notificationsLoading}
            unreadCount={unreadCount}
            onMarkAll={handleMarkAll}
            isMarkingAll={markAllMutation.isPending}
            onMarkSingle={handleMarkSingle}
            markingNotificationId={markingNotificationId}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

type ProfilePanelProps = {
  isLoading: boolean;
  formState: FormState;
  displayName: string;
  avatarUrl?: string | null;
  onFirstNameChange: ChangeEventHandler<HTMLInputElement>;
  onLastNameChange: ChangeEventHandler<HTMLInputElement>;
};

const ProfilePanel = ({
  isLoading,
  formState,
  displayName,
  avatarUrl,
  onFirstNameChange,
  onLastNameChange,
}: ProfilePanelProps) => {
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <section className='rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ring-1 ring-black/5 sm:p-8'>
      <div className='flex flex-wrap items-center gap-5 border-b border-[#F1F5F9] pb-6'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-16 w-16 ring-4 ring-[#F2ECFF]'>
            <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback className='bg-[#EEF2FF] text-lg font-semibold text-[#4C1D95]'>
              {getInitials(
                formState.firstName,
                formState.lastName,
                displayName
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='text-base font-semibold text-[#0F172B]'>
              {displayName}
            </p>
            <p className='text-sm text-[#94A3B8]'>{formState.email}</p>
          </div>
        </div>
        <Button
          type='button'
          variant='colored_outline'
          size='sm'
          className='ml-auto rounded-full px-4 text-xs font-semibold text-[#5F2EEA]'
        >
          Change profile
        </Button>
      </div>

      <div className='mt-6 grid gap-5 sm:grid-cols-2'>
        <Input
          label='First name'
          optional
          value={formState.firstName}
          onChange={onFirstNameChange}
          placeholder='Enter first name'
        />
        <Input
          label='Last name'
          optional
          value={formState.lastName}
          onChange={onLastNameChange}
          placeholder='Enter last name'
        />
        <Input
          label='Email address'
          optional
          value={formState.email}
          readOnly
          disabled
          placeholder='Email address'
        />
        <div className='flex flex-col gap-2'>
          <Input
            label='Password'
            optional
            type='password'
            value={formState.passwordPlaceholder}
            readOnly
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='w-fit rounded-full border-[#E2E8F0] px-4 text-xs font-semibold text-[#0F172B]'
          >
            Change password
          </Button>
        </div>
      </div>

      <Button
        type='button'
        size='xl'
        className='mt-8 w-full rounded-2xl py-3 text-base font-semibold shadow-sm'
      >
        Save Changes
      </Button>
    </section>
  );
};

type NotificationsPanelProps = {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  onMarkAll: () => void;
  isMarkingAll: boolean;
  onMarkSingle: (notification: NotificationItem) => void;
  markingNotificationId: number | string | null;
};

const NotificationsPanel = ({
  notifications,
  unreadCount,
  isLoading,
  onMarkAll,
  isMarkingAll,
  onMarkSingle,
  markingNotificationId,
}: NotificationsPanelProps) => (
  <section className='bg-white shadow-[0_20px_60px_rgba(15,23,42,0.05)] ring-1 ring-black/5'>
    <div className='flex flex-wrap items-center gap-4 border-b border-[#F1F5F9] px-6 py-5'>
      <div className='flex flex-1 items-center gap-3'>
        <h2 className='text-lg font-semibold text-[#0F172B]'>Notifications</h2>
        <span className='rounded-full bg-[#F3E8FF] px-2.5 py-0.5 text-xs font-semibold text-[#6D28D9]'>
          {unreadCount}
        </span>
      </div>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='text-xs font-semibold text-[#5F2EEA] hover:bg-transparent'
        onClick={onMarkAll}
        disabled={isMarkingAll || !notifications.length}
        isLoading={isMarkingAll}
      >
        Mark all as read
      </Button>
    </div>

    <div>
      {isLoading && (
        <div className='divide-y divide-[#F1F5F9]'>
          {Array.from({ length: 4 }).map((_, idx) => (
            <NotificationSkeletonRow key={`skeleton-${idx}`} />
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className='px-6 py-12 text-center'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F5] text-[#5F2EEA]'>
            <BellRing className='h-5 w-5' />
          </div>
          <p className='text-sm font-semibold text-[#0F172B]'>
            You’re all caught up
          </p>
          <p className='mt-1 text-xs text-[#94A3B8]'>
            We’ll let you know when there’s something new.
          </p>
        </div>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className='divide-y divide-[#F1F5F9]'>
          {notifications.map(notification => (
            <NotificationRow
              key={buildNotificationKey(notification)}
              item={notification}
              onMarkSeen={onMarkSingle}
              isMarking={markingNotificationId === notification.id}
            />
          ))}
        </div>
      )}
    </div>
  </section>
);

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
        'flex w-full items-center gap-1.5 px-6 py-4 text-left transition-colors',
        isSeen ? 'bg-white' : 'bg-[#F8F5FF]',
        canMark && !isMarking
          ? 'cursor-pointer hover:bg-[#F3ECFF]'
          : 'cursor-default',
        (!canMark || isMarking) && 'opacity-70'
      )}
    >
      <div className='w-24 text-left text-xs text-[#94A3B8]'>
        <p className='font-medium text-[#0F172B]'>{timestamp.dayLabel}</p>
        <p className='mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#9399A3]'>
          {timestamp.timeLabel}
        </p>
      </div>
      <div className='flex flex-1 items-center gap-3'>
        <span
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            visual?.className
          )}
        >
          {!!Icon && <Icon className='h-4 w-4' />}
        </span>
        <p
          className={cn(
            'text-sm text-[#0F172B]',
            !isSeen && 'font-medium text-[#0F172B]'
          )}
        >
          {message}
        </p>
      </div>
    </button>
  );
};

const ProfileSkeleton = () => (
  <section className='rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ring-1 ring-black/5 sm:p-8'>
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-4'>
        <div className='h-16 w-16 animate-pulse rounded-full bg-[#E2E8F0]' />
        <div className='flex-1 space-y-2'>
          <div className='h-4 w-40 animate-pulse rounded-full bg-[#E2E8F0]' />
          <div className='h-3 w-32 animate-pulse rounded-full bg-[#E2E8F0]' />
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`profile-skeleton-${idx}`}
            className='h-12 animate-pulse rounded-2xl bg-[#E2E8F0]'
          />
        ))}
      </div>
      <div className='h-12 animate-pulse rounded-2xl bg-[#E2E8F0]' />
    </div>
  </section>
);

const NotificationSkeletonRow = () => (
  <div className='flex items-center gap-4 px-6 py-4'>
    <div className='w-24 space-y-2'>
      <div className='h-3 w-20 animate-pulse rounded-full bg-[#E2E8F0]' />
      <div className='h-3 w-16 animate-pulse rounded-full bg-[#E2E8F0]' />
    </div>
    <div className='flex flex-1 items-center gap-3'>
      <div className='h-10 w-10 animate-pulse rounded-full bg-[#E2E8F0]' />
      <div className='h-3 w-2/3 animate-pulse rounded-full bg-[#E2E8F0]' />
    </div>
  </div>
);

function buildNotificationKey(item: NotificationItem) {
  return String(
    item.id ?? `${item.type}-${item.attached_object_id}-${item.created_when}`
  );
}

function getInitials(firstName?: string, lastName?: string, fallback?: string) {
  const letters = [firstName?.[0], lastName?.[0]].filter(Boolean).join('');
  if (letters) return letters.toUpperCase();
  if (fallback) {
    const parts = fallback.split(' ');
    return parts
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
  return 'DM';
}

function formatJoinDate(input?: string) {
  if (!input) return undefined;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return undefined;
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day}${getOrdinal(day)} ${month}, ${year}`;
}

function getOrdinal(day: number) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
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
