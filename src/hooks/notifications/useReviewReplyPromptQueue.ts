'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BusinessReviewThread, NotificationItem } from '@/types/api';
import { fetchBusinessReviewThread } from '@/app/(business)/misc/api/reviews';
import { buildNotificationKey } from './useReviewPromptQueue';

export interface ReviewReplyPromptEntry {
  key: string;
  notificationId: number | string;
  businessId: number | string;
  reviewId: number;
  message?: string;
  review?: BusinessReviewThread | null;
}

interface UseReviewReplyPromptQueueArgs {
  notifications?: NotificationItem[];
  businessId?: number | string;
  enabled?: boolean;
  refetchNotifications?: () => void;
}

interface UseReviewReplyPromptQueueResult {
  reviewReplyPrompts: ReviewReplyPromptEntry[];
  dismissPrompt: (key: string) => void;
  upsertPrompt: (prompt: ReviewReplyPromptEntry) => void;
}

export function useReviewReplyPromptQueue({
  notifications,
  businessId,
  enabled = true,
  refetchNotifications,
}: UseReviewReplyPromptQueueArgs): UseReviewReplyPromptQueueResult {
  const [reviewReplyPrompts, setReviewReplyPrompts] = useState<ReviewReplyPromptEntry[]>([]);
  const processedKeysRef = useRef(new Set<string>());

  const dismissPrompt = useCallback((key: string) => {
    setReviewReplyPrompts(prev => prev.filter(prompt => prompt.key !== key));
  }, []);

  const upsertPrompt = useCallback((prompt: ReviewReplyPromptEntry) => {
    setReviewReplyPrompts(prev => {
      const existingIndex = prev.findIndex(item => item.key === prompt.key);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], ...prompt };
        return next;
      }
      processedKeysRef.current.add(prompt.key);
      return [...prev, prompt];
    });
  }, []);

  useEffect(() => {
    if (!enabled) {
      setReviewReplyPrompts([]);
      processedKeysRef.current.clear();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !notifications?.length || businessId === undefined) {
      return;
    }

    const unreadReviewNotifications = notifications.filter(notification => {
      if (notification.type !== 'review_received' || notification.is_seen) {
        return false;
      }

      if (notification.business !== undefined && String(notification.business) !== String(businessId)) {
        return false;
      }

      return true;
    });

    const freshNotifications = unreadReviewNotifications.filter(notification => {
      const key = buildNotificationKey(notification);
      return !processedKeysRef.current.has(key);
    });

    if (freshNotifications.length === 0) {
      return;
    }

    let cancelled = false;

    const processNotifications = async () => {
      const prepared: ReviewReplyPromptEntry[] = [];

      for (const notification of freshNotifications) {
        const key = buildNotificationKey(notification);
        processedKeysRef.current.add(key);

        const reviewId = Number(notification.attached_object_id);
        if (Number.isNaN(reviewId)) {
          continue;
        }

        try {
          const review = await fetchBusinessReviewThread(businessId, reviewId);
          if (cancelled) {
            return;
          }

          prepared.push({
            key,
            notificationId: notification.id ?? key,
            businessId,
            reviewId,
            message: notification.message,
            review,
          });
        } catch (error) {
          console.error('Failed to load review thread for notification', error);
        }
      }

      if (!cancelled && prepared.length > 0) {
        setReviewReplyPrompts(prev => [...prev, ...prepared]);
        refetchNotifications?.();
      }
    };

    void processNotifications();

    return () => {
      cancelled = true;
    };
  }, [notifications, enabled, businessId, refetchNotifications]);

  return useMemo(
    () => ({
      reviewReplyPrompts,
      dismissPrompt,
      upsertPrompt,
    }),
    [reviewReplyPrompts, dismissPrompt, upsertPrompt]
  );
}
