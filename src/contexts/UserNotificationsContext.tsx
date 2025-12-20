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
import { toast } from 'sonner';
import { useNotificationsHook } from '@/components/providers/NotificationProvider';

interface UserNotificationsContextValue {
  reviewPrompts: ReviewPromptEntry[];
  dismissReviewPrompt: (key: string) => void;
}

const UserNotificationsContext = createContext<
  UserNotificationsContextValue | undefined
>(undefined);

export function useUserNotificationsContext(): UserNotificationsContextValue {
  const context = useContext(UserNotificationsContext);
  if (!context) {
    throw new Error(
      'useUserNotificationsContext must be used within UserNotificationsProvider'
    );
  }
  return context;
}

interface UserNotificationsProviderProps {
  children: ReactNode;
}

export function UserNotificationsProvider({
  children,
}: UserNotificationsProviderProps) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const { notifications: socketNotifications } = useNotificationsHook();
  const processedSocketPromptKeysRef = useRef(new Set<string>());

  const { data: notificationsData, refetch: refetchNotifications } =
    useNotifications(
      { notification_for: 'user' },
      { enabled: isAuthenticated }
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
    enabled: isAuthenticated,
    refetchNotifications,
  });

  useEffect(() => {
    if (!isAuthenticated || socketNotifications.length === 0) {
      return;
    }

    let shouldRefetch = false;
    for (const notification of socketNotifications) {
      if (notification.type !== 'review_prompt') {
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
  }, [isAuthenticated, socketNotifications, refetchNotifications]);

  const contextValue = useMemo(
    () => ({
      reviewPrompts,
      dismissReviewPrompt: dismissPrompt,
    }),
    [reviewPrompts, dismissPrompt]
  );

  const handlePromptClose = useCallback(
    async (key: string, notificationId: number | string) => {
      dismissPrompt(key);
      await markNotificationSeen(notificationId);
    },
    [dismissPrompt, markNotificationSeen]
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
        await markNotificationSeen(prompt.notificationId);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to submit review';
        throw new Error(message);
      }
    },
    [dismissPrompt, submitReviewMutation, markNotificationSeen]
  );

  return (
    <UserNotificationsContext.Provider value={contextValue}>
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
          onClose={() => handlePromptClose(prompt.key, prompt.notificationId)}
          onSubmit={payload => handlePromptSubmit(prompt, payload)}
          notificationId={prompt.notificationId}
        />
      ))}
    </UserNotificationsContext.Provider>
  );
}
