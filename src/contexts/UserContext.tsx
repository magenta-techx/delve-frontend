'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/utils/apiHandler';
import type { UserDetail } from '@/types/api';

interface UserContextType {
  user: UserDetail | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userId?: number | null;
  refetch: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const hasValidAccessToken = Boolean(
    session?.user?.accessToken && String(session.user.accessToken).length > 0
  );
  const shouldFetch = status === 'authenticated' && hasValidAccessToken;

  const {
    data: currentUserData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: async () => {
      const res = await apiRequest(`/api/user`, { method: 'GET' }, undefined, {
        skipAuthRedirect: true,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch user');
      return data;
    },

    enabled: shouldFetch,
    placeholderData: previousData => previousData,
  });

  const user: UserDetail | null = useMemo(() => {
    if (!shouldFetch) return null;
    return (currentUserData as any)?.user ?? null;
  }, [currentUserData, shouldFetch]);

  const value = useMemo(
    () => ({
      user,
      isLoading: Boolean(isLoading),
      isAuthenticated: status === 'authenticated',
      userId: user?.id ?? null,
      refetch: () => {
        try {
          void refetch();
        } catch (e) {
          // swallow in provider; callers can catch if needed
        }
      },
    }),
    [user, isLoading, status, refetch]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error('useUserContext must be used within a UserProvider');
  return context;
}

export function useRequiredUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error('useUserContext must be used within a UserProvider');
  return ctx;
}

export default UserContext;
