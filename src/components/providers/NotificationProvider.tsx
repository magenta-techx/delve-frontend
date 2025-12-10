'use client';

import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useNotificationSocket } from '@/hooks/notifications/useNotificationSocket';
import type { NotificationPayload } from '@/hooks/notifications/useNotificationSocket';
import { toast } from 'sonner';

interface NotificationContextType {
  isConnected: boolean;
  notifications: NotificationPayload[];
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
  businessId?: number | string | null;
}

export function NotificationProvider({ children, businessId }: NotificationProviderProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const token = session?.user?.accessToken ?? '';

  const handleNotification = useCallback((payload: NotificationPayload) => {
    setNotifications(prev => [payload, ...prev]);
    
    // Show toast notification based on type
    const notificationMessages: Record<string, { title: string; description: string }> = {
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

  const { getState } = useNotificationSocket({
    businessId: businessId ?? null,
    token,
    onNotification: handleNotification,
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
    debug: process.env.NODE_ENV === 'development',
  });

  useEffect(() => {
    const state = getState();
    setIsConnected(state === 'open');
  }, [getState]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = {
    isConnected,
    notifications,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to easily access notification context
export function useNotifications() {
  return useNotificationContext();
}
