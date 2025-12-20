'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import {
  useNotifications,
  useMarkNotificationSeen,
} from '@/app/(clients)/misc/api';
import {
  useReplyToReview,
  fetchBusinessReviewThread,
} from '@/app/(business)/misc/api/reviews';
import { ReviewReplyPromptModal } from '@/components/ui/ReviewReplyPromptModal';
import {
  useReviewReplyPromptQueue,
  type ReviewReplyPromptEntry,
} from '@/hooks/notifications/useReviewReplyPromptQueue';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { toast } from 'sonner';
import { useNotificationsHook } from '@/components/providers/NotificationProvider';

interface BusinessNotificationsContextValue {
  reviewReplyPrompts: ReviewReplyPromptEntry[];
  dismissReviewPrompt: (key: string) => void;
}

const BusinessNotificationsContext = createContext<
  BusinessNotificationsContextValue | undefined
>(undefined);

export function useBusinessNotificationsContext(): BusinessNotificationsContextValue {
  const context = useContext(BusinessNotificationsContext);
  if (!context) {
    throw new Error(
      'useBusinessNotificationsContext must be used within BusinessNotificationsProvider'
    );
  }
  return context;
}

interface BusinessNotificationsProviderProps {
  children: ReactNode;
}

export function BusinessNotificationsProvider({
  children,
}: BusinessNotificationsProviderProps) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const { currentBusiness } = useBusinessContext();
  const businessId = currentBusiness?.id;
  const businessName = currentBusiness?.name ?? 'your business';
  const reviewPromptBusinessId: string | number = businessId ?? '';
  const { notifications: socketNotifications } = useNotificationsHook();
  const processedSocketPromptKeysRef = useRef(new Set<string>());

  const {
    data: notificationsData,
    refetch: refetchNotifications,
  } = useNotifications(
    {
      notification_for: 'business',
      ...(businessId !== undefined && { business_id: businessId }),
    },
    { enabled: isAuthenticated && businessId !== undefined }
  );

  const markNotificationSeenMutation = useMarkNotificationSeen();
  const replyToReviewMutation = useReplyToReview();

  const markNotificationSeen = useCallback(
    async (notificationId: number | string) => {
      try {
        await markNotificationSeenMutation.mutateAsync({
          notification_id: notificationId,
        });
      } catch (error) {
        console.error('Failed to mark notification as seen', error);
      }
    },
    [markNotificationSeenMutation]
  );

  const { reviewReplyPrompts, dismissPrompt, upsertPrompt } =
    useReviewReplyPromptQueue({
      notifications: notificationsData?.data ?? [],
      businessId: reviewPromptBusinessId,
      enabled: isAuthenticated && businessId !== undefined,
      markNotificationSeen,
      refetchNotifications,
    });

  useEffect(() => {
    if (
      !isAuthenticated ||
      businessId === undefined ||
      socketNotifications.length === 0
    ) {
      return;
    }

    let shouldRefetch = false;
    for (const notification of socketNotifications) {
      if (notification.type !== 'review_received') {
        continue;
      }

      if (
        notification.business !== undefined &&
        String(notification.business) !== String(businessId)
      ) {
        continue;
      }

      const key = `${notification.type}-${notification.attached_object_id}-${notification.created_when}`;
      if (!processedSocketPromptKeysRef.current.has(key)) {
        processedSocketPromptKeysRef.current.add(key);
        shouldRefetch = true;
      }
    }

    if (shouldRefetch) {
      void refetchNotifications();
    }
  }, [
    isAuthenticated,
    businessId,
    socketNotifications,
    refetchNotifications,
  ]);

  const contextValue = useMemo(
    () => ({
      reviewReplyPrompts,
      dismissReviewPrompt: dismissPrompt,
    }),
    [reviewReplyPrompts, dismissPrompt]
  );

  const handlePromptClose = useCallback(
    (key: string) => {
      dismissPrompt(key);
    },
    [dismissPrompt]
  );

  const handlePromptSubmit = useCallback(
    async (
      prompt: ReviewReplyPromptEntry,
      payload: { content: string; parent_reply_id?: number }
    ) => {
      try {
        await replyToReviewMutation.mutateAsync({
          business_id: prompt.businessId,
          review_id: prompt.reviewId,
          content: payload.content,
          ...(payload.parent_reply_id !== undefined
            ? { parent_reply_id: payload.parent_reply_id }
            : {}),
        });
        toast.success('Reply sent');

        try {
          const updatedThread = await fetchBusinessReviewThread(
            prompt.businessId,
            prompt.reviewId
          );
          if (updatedThread) {
            upsertPrompt({ ...prompt, review: updatedThread });
          }
        } catch (threadError) {
          console.error('Failed to refresh review thread', threadError);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to send reply';
        throw new Error(message);
      }
    },
    [replyToReviewMutation, upsertPrompt]
  );

  return (
    <BusinessNotificationsContext.Provider value={contextValue}>
      {children}
      {reviewReplyPrompts.map(prompt =>
        prompt.review ? (
          <ReviewReplyPromptModal
            key={prompt.key}
            isOpen
            businessName={businessName}
            review={prompt.review}
            onClose={() => handlePromptClose(prompt.key)}
            onSubmit={payload => handlePromptSubmit(prompt, payload)}
            isSubmitting={replyToReviewMutation.isPending}
          />
        ) : null
      )}
    </BusinessNotificationsContext.Provider>
  );
}
