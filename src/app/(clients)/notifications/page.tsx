'use client';

import type { ChangeEventHandler } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { LucideIcon } from 'lucide-react';
import { BellRing, MessageCircle, Sparkles, Star, Users } from 'lucide-react';

import { useGetProfile } from '@/hooks/user/useGetProfile';
import type { NotificationItem } from '@/types/api';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';

import { useMarkAllNotifications, useNotifications } from '../misc/api';

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
  passwordPlaceholder: '••••••••••••',
};

const notificationVisuals: Array<{ keywords: string[]; icon: LucideIcon; className: string }> = [
  { keywords: ['message', 'chat'], icon: MessageCircle, className: 'bg-[#F4EDFF] text-[#5F2EEA]' },
  { keywords: ['collaboration', 'invite', 'request'], icon: Users, className: 'bg-[#E0F7FF] text-[#0369A1]' },
  { keywords: ['rate', 'review', 'experience'], icon: Star, className: 'bg-[#FEF3C7] text-[#B45309]' },
  { keywords: ['account', 'created', 'success'], icon: Sparkles, className: 'bg-[#FDF2FF] text-[#C026D3]' },
];

const NotificationsPage = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? null;

  const { data: profileData, isLoading: profileLoading } = useGetProfile(userEmail);
  const {
    data: notificationData,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useNotifications({ notification_for: 'user' });
  const markAllMutation = useMarkAllNotifications();

  const [formState, setFormState] = useState<FormState>(defaultFormState);

  useEffect(() => {
    if (profileData) {
      setFormState((prev) => ({
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

  const notifications = notificationData?.data ?? [];
  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const avatarImage =
    (profileData?.['profile_image'] as string | null | undefined) ?? session?.user?.image ?? null;

  const handleFieldChange =
    (field: 'firstName' | 'lastName'): ChangeEventHandler<HTMLInputElement> =>
    (event) => {
      const { value } = event.target;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  const handleMarkAll = () => {
    markAllMutation.mutate(undefined, {
      onSuccess: () => {
        refetchNotifications();
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7FB] px-4 py-6 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl lg:max-w-7xl">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#7C3AED]">
            Profile Settings
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-[#0F172B]">Profile Settings</h1>
            {joinDateLabel && (
              <Badge className="rounded-2xl bg-[#FFF5F0] px-4 py-1 text-xs font-semibold text-[#B45309] shadow-sm">
                Joined&nbsp;{joinDateLabel}
              </Badge>
            )}
          </div>
          <p className="text-sm text-[#6B7280]">
            Update your personal information and review the latest happenings around your collaborations.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.6fr)]">
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
    <section className="rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ring-1 ring-black/5 sm:p-8">
      <div className="flex flex-wrap items-center gap-5 border-b border-[#F1F5F9] pb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-4 ring-[#F2ECFF]">
            <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-[#EEF2FF] text-lg font-semibold text-[#4C1D95]">
              {getInitials(formState.firstName, formState.lastName, displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-semibold text-[#0F172B]">{displayName}</p>
            <p className="text-sm text-[#94A3B8]">{formState.email}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="colored_outline"
          size="sm"
          className="ml-auto rounded-full px-4 text-xs font-semibold text-[#5F2EEA]"
        >
          Change profile
        </Button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Input
          label="First name"
          optional
          value={formState.firstName}
          onChange={onFirstNameChange}
          placeholder="Enter first name"
        />
        <Input
          label="Last name"
          optional
          value={formState.lastName}
          onChange={onLastNameChange}
          placeholder="Enter last name"
        />
        <Input
          label="Email address"
          optional
          value={formState.email}
          readOnly
          disabled
          placeholder="Email address"
        />
        <div className="flex flex-col gap-2">
          <Input
            label="Password"
            optional
            type="password"
            value={formState.passwordPlaceholder}
            readOnly
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit rounded-full border-[#E2E8F0] px-4 text-xs font-semibold text-[#0F172B]"
          >
            Change password
          </Button>
        </div>
      </div>

      <Button
        type="button"
        size="xl"
        className="mt-8 w-full rounded-2xl py-3 text-base font-semibold shadow-sm"
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
};

const NotificationsPanel = ({
  notifications,
  unreadCount,
  isLoading,
  onMarkAll,
  isMarkingAll,
}: NotificationsPanelProps) => (
  <section className="rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ring-1 ring-black/5 sm:p-7">
    <div className="mb-5 flex flex-wrap items-center gap-4">
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[#0F172B]">Notifications</h2>
          <span className="rounded-full bg-[#F3E8FF] px-2.5 py-0.5 text-xs font-semibold text-[#6D28D9]">
            {unreadCount}
          </span>
        </div>
        <p className="text-xs text-[#94A3B8]">Your most recent updates and reminders.</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-xs font-semibold text-[#5F2EEA] hover:bg-transparent"
        onClick={onMarkAll}
        disabled={isMarkingAll || !notifications.length}
        isLoading={isMarkingAll}
      >
        Mark all as read
      </Button>
    </div>

    <div className="space-y-3">
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <NotificationSkeletonRow key={`skeleton-${idx}`} />
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] px-5 py-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#5F2EEA] shadow-sm">
            <BellRing className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-[#0F172B]">You’re all caught up</p>
          <p className="mt-1 text-xs text-[#94A3B8]">We’ll let you know when there’s something new.</p>
        </div>
      )}

      {!isLoading &&
        notifications.map((notification) => (
          <NotificationRow key={notification.id} item={notification} />
        ))}
    </div>
  </section>
);

const NotificationRow = ({ item }: { item: NotificationItem }) => {
  const visual = getNotificationVisual(item.title || item.body);
  const timestamp = formatNotificationDate(item.created_at);
  const Icon = visual.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-2xl border border-transparent p-4 transition-colors',
        item.is_read ? 'bg-white hover:border-[#E0E7FF]' : 'bg-[#F7F4FF] hover:border-[#E0E7FF]'
      )}
    >
      <span className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', visual.className)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex flex-1 items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#0F172B]">{item.title}</p>
          <p className="mt-1 text-sm text-[#6B7280]">{item.body}</p>
        </div>
        <div className="text-right text-xs text-[#9CA3AF]">
          <p>{timestamp.dayLabel}</p>
          <p className="font-semibold text-[#111827]">{timestamp.timeLabel}</p>
        </div>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <section className="rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ring-1 ring-black/5 sm:p-8">
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 animate-pulse rounded-full bg-[#E2E8F0]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 animate-pulse rounded-full bg-[#E2E8F0]" />
          <div className="h-3 w-32 animate-pulse rounded-full bg-[#E2E8F0]" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={`profile-skeleton-${idx}`} className="h-12 animate-pulse rounded-2xl bg-[#E2E8F0]" />
        ))}
      </div>
      <div className="h-12 animate-pulse rounded-2xl bg-[#E2E8F0]" />
    </div>
  </section>
);

const NotificationSkeletonRow = () => (
  <div className="flex items-start gap-4 rounded-2xl bg-[#F9FAFB] p-4">
    <div className="h-11 w-11 animate-pulse rounded-2xl bg-[#E2E8F0]" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-48 animate-pulse rounded-full bg-[#E2E8F0]" />
      <div className="h-3 w-64 animate-pulse rounded-full bg-[#E2E8F0]" />
    </div>
  </div>
);

function getInitials(firstName?: string, lastName?: string, fallback?: string) {
  const letters = [firstName?.[0], lastName?.[0]].filter(Boolean).join('');
  if (letters) return letters.toUpperCase();
  if (fallback) {
    const parts = fallback.split(' ');
    return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
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

function getNotificationVisual(text?: string) {
  if (!text) {
    return { icon: BellRing, className: 'bg-[#EEF2FF] text-[#4C1D95]' };
  }
  const lower = text.toLowerCase();
  const match = notificationVisuals.find((visual) =>
    visual.keywords.some((keyword) => lower.includes(keyword))
  );
  if (match) return match;
  return { icon: BellRing, className: 'bg-[#EEF2FF] text-[#4C1D95]' };
}