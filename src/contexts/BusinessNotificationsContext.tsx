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
  useSubmitBusinessReview,
} from '@/app/(clients)/misc/api';
import {
  ReviewPromptModal,
  type ReviewPromptSubmissionPayload,
} from '@/components/ui/ReviewPromptModal';
import {
  useReviewPromptQueue,
  type ReviewPromptEntry,
} from '@/hooks/notifications/useReviewPromptQueue';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { toast } from 'sonner';
import { useNotificationsHook } from '@/components/providers/NotificationProvider';

interface BusinessNotificationsContextValue {
  reviewPrompts: ReviewPromptEntry[];
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
  const submitReviewMutation = useSubmitBusinessReview();

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

  const { reviewPrompts, dismissPrompt } = useReviewPromptQueue({
    notifications: notificationsData?.data ?? [],
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
      if (notification.type !== 'review_prompt') {
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
      reviewPrompts,
      dismissReviewPrompt: dismissPrompt,
    }),
    [reviewPrompts, dismissPrompt]
  );

  const handlePromptClose = useCallback(
    (key: string) => {
      dismissPrompt(key);
    },
    [dismissPrompt]
  );

  const handlePromptSubmit = useCallback(
    async (
      prompt: ReviewPromptEntry,
      payload: ReviewPromptSubmissionPayload
    ) => {
      try {
        await submitReviewMutation.mutateAsync({
          business_id: prompt.businessId,
          ...payload,
        });
        toast.success('Thanks for sharing your review!');
        dismissPrompt(prompt.key);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to submit review';
        throw new Error(message);
      }
    },
    [dismissPrompt, submitReviewMutation]
  );

  return (
    <BusinessNotificationsContext.Provider value={contextValue}>
      {children}
      {reviewPrompts.map(prompt => (
        <ReviewPromptModal
          key={prompt.key}
          isOpen
          businessName={prompt.businessName}
          businessId={prompt.businessId}
          businessLogo={prompt.businessLogo ?? ''}
          services={prompt.services ?? []}
          promptMessage={prompt.message ?? ''}
          onClose={() => handlePromptClose(prompt.key)}
          onSubmit={payload => handlePromptSubmit(prompt, payload)}
        />
      ))}
    </BusinessNotificationsContext.Provider>
  );
}
