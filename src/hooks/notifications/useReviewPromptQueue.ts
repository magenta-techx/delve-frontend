'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BusinessService, NotificationItem } from '@/types/api';
import { apiRequest } from '@/utils/apiHandler';

const DEFAULT_BUSINESS_NAME = 'this business';

export interface ReviewPromptEntry {
  key: string;
  notificationId: number | string;
  businessId: number | string;
  businessName: string;
  businessLogo?: string | undefined;
  message?: string;
  services?: BusinessService[] | undefined;
}

interface UseReviewPromptQueueArgs {
  notifications?: NotificationItem[];
  enabled?: boolean;
  refetchNotifications?: () => void;
}

interface UseReviewPromptQueueResult {
  reviewPrompts: ReviewPromptEntry[];
  dismissPrompt: (key: string) => void;
  openPrompt: (prompt: ReviewPromptEntry) => void;
}

export function buildNotificationKey(notification: NotificationItem): string {
  return String(
    notification.id ??
      `${notification.type}-${notification.attached_object_id}-${notification.created_when}`
  );
}

async function fetchBusinessSummary(businessId: number | string): Promise<{
  businessName: string;
  businessLogo?: string;
  services?: BusinessService[];
}> {
  if (businessId === null || businessId === undefined) {
    return { businessName: DEFAULT_BUSINESS_NAME };
  }

  try {
    const response = await apiRequest(`/api/business/${businessId}`);
    const payload = await response.json().catch(() => undefined);
    const data = payload?.data ?? payload ?? {};
    const businessName =
      data?.name ?? data?.business_name ?? data?.title ?? DEFAULT_BUSINESS_NAME;
    const businessLogo =
      data?.logo ??
      data?.thumbnail ??
      data?.thumbnail_image ??
      data?.image ??
      data?.avatar ??
      undefined;
    // const fetchedBusinessId = data?.id ?? undefined;
    const services = Array.isArray(data?.services)
      ? (data.services as BusinessService[])
      : undefined;

    return {
      businessName,
      businessLogo,
      ...(services !== undefined ? { services } : {}),
    };
  } catch (error) {
    console.error('Failed to fetch business details for review prompt', error);
    return { businessName: DEFAULT_BUSINESS_NAME };
  }
}

export function useReviewPromptQueue({
  notifications,
  enabled = true,
  refetchNotifications,
}: UseReviewPromptQueueArgs): UseReviewPromptQueueResult {
  const [reviewPrompts, setReviewPrompts] = useState<ReviewPromptEntry[]>([]);
  const processedKeysRef = useRef(new Set<string>());

  const dismissPrompt = useCallback((key: string) => {
    setReviewPrompts(prev => prev.filter(prompt => prompt.key !== key));
  }, []);

  const openPrompt = useCallback((prompt: ReviewPromptEntry) => {
    setReviewPrompts(prev => {
      const exists = prev.some(item => item.key === prompt.key);
      if (exists) {
        return prev.map(item =>
          item.key === prompt.key ? { ...item, ...prompt } : item
        );
      }
      processedKeysRef.current.add(prompt.key);
      return [...prev, prompt];
    });
  }, []);

  useEffect(() => {
    if (!enabled) {
      setReviewPrompts([]);
      processedKeysRef.current.clear();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !notifications?.length) {
      return;
    }

    const unreadReviewPrompts = notifications.filter(
      notification =>
        notification.type === 'review_prompt' && !notification.is_seen
    );

    const freshNotifications = unreadReviewPrompts.filter(notification => {
      const key = buildNotificationKey(notification);
      return !processedKeysRef.current.has(key);
    });

    if (freshNotifications.length === 0) {
      return;
    }

    let isCancelled = false;

    const processNotifications = async () => {
      const nextPrompts: ReviewPromptEntry[] = [];

      for (const notification of freshNotifications) {
        const key = buildNotificationKey(notification);
        processedKeysRef.current.add(key);

        const { businessName, businessLogo, services } =
          await fetchBusinessSummary(notification.attached_object_id);

        if (!isCancelled) {
          nextPrompts.push({
            key,
            notificationId: notification.id ?? key,
            businessId: notification.attached_object_id,
            businessName,
            businessLogo,
            message: notification.message,
            services,
          });
        }
      }

      if (!isCancelled && nextPrompts.length > 0) {
        setReviewPrompts(prev => [...prev, ...nextPrompts]);
        refetchNotifications?.();
      }
    };

    processNotifications();

    return () => {
      isCancelled = true;
    };
  }, [notifications, enabled, refetchNotifications]);

  return useMemo(
    () => ({
      reviewPrompts,
      dismissPrompt,
      openPrompt,
    }),
    [reviewPrompts, dismissPrompt, openPrompt]
  );
}
