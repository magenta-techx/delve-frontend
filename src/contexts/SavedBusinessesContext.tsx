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
import { SavedBusiness } from '@/types/api';
import { toast } from 'sonner';

export interface SavedBusinessesContextType {
  savedBusinesses: SavedBusiness[];
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
  const [savingBusinessId, setSavingBusinessId] = useState<
    string | number | null
  >(null);
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
  const flattenedSavedBusinessData = useMemo(() => {
    if (!savedBusinessesData?.data) return [];
    return savedBusinessesData.data.flatMap(item => item.businesses);
  }, [savedBusinessesData]);

  const saveMutation = useSaveBusiness();
  const unsaveMutation = useUnsaveBusiness();


  const isSaved = useCallback(
    (businessId: number | string) => {
      const id =
        typeof businessId === 'string' ? parseInt(businessId, 10) : businessId;
      return flattenedSavedBusinessData.some(business => business.id === id);
    },
    [flattenedSavedBusinessData]
  );

  const saveBusiness = useCallback(
    async (businessId: number | string) => {
      setSavingBusinessId(businessId);
      try {
        await saveMutation.mutateAsync(
          { business_id: businessId },
          {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ['user', 'saved-business'],
              });
              toast('Successful', {
                description: 'Business added to saved list.',
                className: 'bg-[#F5F3FF] text-[#551FB9]',
                descriptionClassName: 'bg-[#F5F3FF] text-[#551FB9]',
                richColors: true,
                icon: (
                  <svg
                    width='40'
                    height='40'
                    viewBox='0 0 40 40'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <rect width='40' height='40' rx='16' fill='#D9D6FE' />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M15 12.25C13.7574 12.25 12.75 13.2574 12.75 14.5V26.6459C12.75 27.5472 13.1356 28.0076 13.4833 28.1615C13.817 28.3093 14.3769 28.2887 14.9976 27.6578C15.4448 27.2032 15.9476 26.6859 16.5126 26.0974C18.4129 24.1181 21.5871 24.1181 23.4874 26.0974C24.0524 26.6859 24.5552 27.2032 25.0024 27.6578C25.6231 28.2887 26.183 28.3093 26.5167 28.1615C26.8644 28.0076 27.25 27.5472 27.25 26.6459V14.5C27.25 13.2574 26.2426 12.25 25 12.25H15ZM11.25 14.5C11.25 12.4289 12.9289 10.75 15 10.75H25C27.0711 10.75 28.75 12.4289 28.75 14.5V26.6459C28.75 27.9748 28.1514 29.0782 27.124 29.5331C26.0825 29.9942 24.8763 29.6686 23.933 28.7097C23.4812 28.2503 22.9741 27.7286 22.4053 27.1362C21.0954 25.7718 18.9046 25.7718 17.5947 27.1362C17.0259 27.7286 16.5188 28.2503 16.067 28.7097C15.1237 29.6686 13.9175 29.9942 12.876 29.5331C11.8486 29.0782 11.25 27.9748 11.25 26.6459V14.5Z'
                      fill='#551FB9'
                    />
                  </svg>
                ),
              });
            },
          }
        );
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
        await unsaveMutation.mutateAsync(
          { business_id: businessId },
          {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ['user', 'saved-business'],
              });
              toast.error('Successful', {
                description: 'Business removed from saved list.',
                icon: (
                  <svg
                    width='40'
                    height='40'
                    viewBox='0 0 40 40'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <rect width='40' height='40' rx='16' fill='#F8DBCB' />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M14.7141 14.0065C14.7729 13.9822 14.8358 13.9652 14.9019 13.9565L14.9299 13.9527C15.5811 13.8668 16.1357 13.4372 16.3818 12.8283C16.8892 11.5723 18.1083 10.75 19.4629 10.75H20.8101C22.183 10.75 23.4184 11.5833 23.9327 12.8561L24.0231 13.08C24.2109 13.5449 24.6274 13.8784 25.1222 13.96C25.1796 13.9695 25.2344 13.9852 25.286 14.0065C26.0725 14.0679 26.7626 14.129 27.2595 14.1751C27.5137 14.1987 27.7175 14.2183 27.858 14.2321L28.0196 14.2481L28.0756 14.2538C28.0756 14.2538 28.0767 14.2539 28.0001 15L28.0767 14.2539C28.4887 14.2962 28.7884 14.6646 28.7461 15.0766C28.7038 15.4887 28.3355 15.7884 27.9234 15.7461L27.8696 15.7406L27.7114 15.7249C27.5734 15.7114 27.3723 15.692 27.121 15.6687C26.6184 15.6221 25.9156 15.5599 25.1158 15.4977C23.5107 15.373 21.5347 15.25 20.0001 15.25C18.4654 15.25 16.4894 15.373 14.8843 15.4977C14.0845 15.5599 13.3817 15.6221 12.8791 15.6687C12.6279 15.692 12.4268 15.7114 12.2887 15.7249L12.1305 15.7406L12.0774 15.746C12.0774 15.746 12.0767 15.7461 12.0759 15.7389L12.0774 15.746C11.6653 15.7883 11.2963 15.4887 11.254 15.0766C11.2117 14.6646 11.5114 14.2962 11.9235 14.2539L12.0001 15C11.9235 14.2539 11.9234 14.2539 11.9235 14.2539L11.9805 14.2481L12.1421 14.2321C12.2826 14.2183 12.4864 14.1987 12.7406 14.1751C13.2375 14.129 13.9276 14.0679 14.7141 14.0065ZM17.7725 13.3902C18.0509 12.7011 18.7197 12.25 19.4629 12.25H20.8101C21.5715 12.25 22.2567 12.7121 22.5419 13.4181L22.6323 13.6419C22.6589 13.7076 22.6876 13.7719 22.7185 13.8349C21.7753 13.7843 20.8298 13.75 20.0001 13.75C19.2524 13.75 18.4108 13.7779 17.5615 13.8204C17.6414 13.6834 17.7121 13.5398 17.7725 13.3902Z'
                      fill='#BC1B06'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M14.0396 18.4096L14.397 26.6303C14.4668 28.235 15.788 29.5 17.3942 29.5H22.2061C23.7622 29.5 25.06 28.3102 25.1948 26.7599L25.9177 18.4473C25.9638 17.9166 25.5865 17.4438 25.0576 17.3805C23.8216 17.2326 21.6203 17 20 17C18.3623 17 16.131 17.2377 14.9029 17.3853C14.3905 17.4469 14.0172 17.8941 14.0396 18.4096ZM17 25.75C16.5858 25.75 16.25 26.0858 16.25 26.5C16.25 26.9142 16.5858 27.25 17 27.25H23C23.4143 27.25 23.75 26.9142 23.75 26.5C23.75 26.0858 23.4143 25.75 23 25.75H17ZM16.25 23.5C16.25 23.0858 16.5858 22.75 17 22.75H23C23.4143 22.75 23.75 23.0858 23.75 23.5C23.75 23.9142 23.4143 24.25 23 24.25H17C16.5858 24.25 16.25 23.9142 16.25 23.5ZM17 19.75C16.5858 19.75 16.25 20.0858 16.25 20.5C16.25 20.9142 16.5858 21.25 17 21.25H23C23.4143 21.25 23.75 20.9142 23.75 20.5C23.75 20.0858 23.4143 19.75 23 19.75H17Z'
                      fill='#BC1B06'
                    />
                  </svg>
                ),
              });
            },
          }
        );
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
      savedBusinesses: flattenedSavedBusinessData,
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
      flattenedSavedBusinessData,
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
