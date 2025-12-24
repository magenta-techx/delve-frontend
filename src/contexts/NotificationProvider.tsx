'use client';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { useSession } from 'next-auth/react';
import { useNotificationSocket } from '@/hooks/notifications/useNotificationSocket';
import type { NotificationPayload } from '@/hooks/notifications/useNotificationSocket';
import { toast } from 'sonner';

interface NotificationContextType {
  isConnected: boolean;
  notifications: NotificationPayload[];
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationContext must be used within NotificationProvider'
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
  businessId?: number | string | null;
}

export function NotificationProvider({
  children,
  businessId,
}: NotificationProviderProps) {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const token = session?.user?.accessToken ?? '';
  const isAuthenticated = status === 'authenticated' && !!token;

  const handleNotification = useCallback((payload: NotificationPayload) => {
    console.log('[Notification received]', payload);
    setNotifications(prev => [payload, ...prev]);

    // Show toast notification based on type
    const notificationMessages: Record<
      string,
      { title: string; description: string }
    > = {
      // Review notifications
      review_prompt: {
        title: 'Review Reminder',
        description: 'You can now add a review for your recent interaction.',
      },
      review_received: {
        title: 'New Review',
        description: 'Your business has received a new review.',
      },
      review_replied: {
        title: 'Review Reply',
        description: 'Someone has replied to your review.',
      },
      // Message notifications
      message_notification: {
        title: 'New Message',
        description: payload.message || 'You received a new message.',
      },
      // Business notifications
      profile_views: {
        title: 'Profile View',
        description: 'Someone viewed your business profile.',
      },
      free_trial_enabled: {
        title: 'Free Trial Activated',
        description: 'Your free trial has been activated.',
      },
      free_trial_expiring: {
        title: 'Free Trial Expiring',
        description: 'Your free trial is about to expire.',
      },
      free_trial_disabled: {
        title: 'Free Trial Ended',
        description: 'Your free trial has ended.',
      },
      payment_received: {
        title: 'Payment Received',
        description: 'Your payment has been received.',
      },
      subscription_created: {
        title: 'Subscription Updated',
        description: 'Your subscription has been updated.',
      },
      business_created: {
        title: 'Business Created',
        description: 'Your business has been created successfully.',
      },
    };

    const notificationContent = notificationMessages[payload.type] || {
      title: 'New Notification',
      description: payload.message || 'You have a new notification',
    };

    toast(notificationContent.title, {
      description: notificationContent.description,
      duration: 5000,
      action: {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  }, []);

  const handleOpen = useCallback(() => {
    setIsConnected(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsConnected(false);
  }, []);

  useNotificationSocket({
    businessId: businessId ?? null,
    token,
    onNotification: handleNotification,
    onOpen: handleOpen,
    onClose: handleClose,
    debug: process.env.NODE_ENV === 'development',
    enabled: isAuthenticated,
  });

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = useMemo(
    () => ({
      isConnected,
      notifications,
      clearNotifications,
    }),
    [isConnected, notifications, clearNotifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to easily access notification context
export function useNotificationsHook() {
  return useNotificationContext();
}
