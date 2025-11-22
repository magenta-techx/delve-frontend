'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useSavedBusinesses,
  useSaveBusiness,
  useUnsaveBusiness,
} from '@/app/(clients)/misc/api/user';
import { useSession } from 'next-auth/react';
import { useUserContext } from './UserContext';
import { SavedBusinessItem } from '@/types/api';

export interface SavedBusinessesContextType {
  savedBusinesses: SavedBusinessItem[];
  isLoading: boolean;
  isSaved: (businessId: number | string) => boolean;
  isSaving: (businessId: number | string) => boolean;
  toggleSave: (businessId: number | string) => Promise<void>;
  saveBusiness: (businessId: number | string) => Promise<void>;
  unsaveBusiness: (businessId: number | string) => Promise<void>;
  showLoginAlert: boolean;
  setShowLoginAlert: (show: boolean) => void;
}

const SavedBusinessesContext = createContext<SavedBusinessesContextType | null>(
  null
);

export function SavedBusinessesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savingBusinessId, setSavingBusinessId] = useState<string | number | null>(null);
  const { isAuthenticated } = useUserContext?.() || { isAuthenticated: false };
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  // Only fetch when session is authenticated and we have a non-empty access token.
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const hasValidAccessToken = Boolean(
    session?.user?.accessToken && String(session.user.accessToken).length > 0
  );
  const shouldFetch = status === 'authenticated' && hasValidAccessToken;
  // Do not log tokens or session contents in production; keep quiet here.
  const { data: savedBusinessesData, isLoading } =
    useSavedBusinesses(shouldFetch);
  const saveMutation = useSaveBusiness();
  const unsaveMutation = useUnsaveBusiness();

  const savedBusinesses = useMemo(
    () => savedBusinessesData?.data ?? [],
    [savedBusinessesData]
  );

  const isSaved = useCallback(
    (businessId: number | string) => {
      const id =
        typeof businessId === 'string' ? parseInt(businessId, 10) : businessId;
      return savedBusinesses.some(business => business.id === id);
    },
    [savedBusinesses]
  );

  const saveBusiness = useCallback(
    async (businessId: number | string) => {
      setSavingBusinessId(businessId);
      try {
        await saveMutation.mutateAsync({ business_id: businessId });
        queryClient.invalidateQueries({ queryKey: ['user', 'saved-business'] });
      } catch (error) {
        console.error('Failed to save business:', error);
        throw error;
      } finally {
        setSavingBusinessId(null);
      }
    },
    [saveMutation, queryClient]
  );

  const unsaveBusiness = useCallback(
    async (businessId: number | string) => {
      setSavingBusinessId(businessId);
      try {
        await unsaveMutation.mutateAsync({ business_id: businessId });
        queryClient.invalidateQueries({ queryKey: ['user', 'saved-business'] });
      } catch (error) {
        console.error('Failed to unsave business:', error);
        throw error;
      } finally {
        setSavingBusinessId(null);
      }
    },
    [unsaveMutation, queryClient]
  );

  const toggleSave = useCallback(
    async (businessId: number | string) => {
      if (!shouldFetch) {
        setShowLoginAlert(true);
        return;
      }
      if (isSaved(businessId)) {
        await unsaveBusiness(businessId);
      } else {
        await saveBusiness(businessId);
      }
    },
    [shouldFetch, isSaved, saveBusiness, unsaveBusiness]
  );

  const isSaving = useCallback(
    (businessId: number | string) => savingBusinessId === businessId,
    [savingBusinessId]
  );

  const value = useMemo(
    () => ({
      savedBusinesses,
      isLoading,
      isSaved,
      toggleSave,
      saveBusiness,
      unsaveBusiness,
      showLoginAlert,
      setShowLoginAlert,
      isSaving,
    }),
    [
      savedBusinesses,
      isLoading,
      isSaved,
      toggleSave,
      saveBusiness,
      unsaveBusiness,
      showLoginAlert,
      isSaving,
    ]
  );

  return (
    <SavedBusinessesContext.Provider value={value}>
      {children}
    </SavedBusinessesContext.Provider>
  );
}

export function useSavedBusinessesContext() {
  const context = useContext(SavedBusinessesContext);
  if (!context) {
    throw new Error(
      'useSavedBusinessesContext must be used within a SavedBusinessesProvider'
    );
  }
  return context;
}
