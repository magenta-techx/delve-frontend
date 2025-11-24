'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { BusinessDetail } from '@/types/api';
import { authAwareFetch } from '@/utils/authAwareFetch';

interface BusinessContextType {
  businesses: BusinessDetail[];
  currentBusiness: BusinessDetail | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  switchBusiness: (businessId: number) => void;
  refetchBusinesses: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessContext must be used within BusinessProvider');
  }
  return context;
};

interface BusinessProviderProps {
  children: React.ReactNode;
}

export const BusinessProvider = ({ children }: BusinessProviderProps) => {
  const queryClient = useQueryClient();
  const [currentBusinessId, setCurrentBusinessId] = useState<number | null>(null);

  // Fetch all businesses belonging to the user
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['user-businesses'],
    queryFn: async () => {
      const response = await authAwareFetch('/api/business/my-businesses', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }
      
      const result = await response.json();
      return result.data as BusinessDetail[];
    },
  });

  const businesses = useMemo(() => data || [], [data]);

  // Set the first business as current if none is selected
  useEffect(() => {
    if (businesses.length > 0 && !currentBusinessId) {
      const savedBusinessId = localStorage.getItem('currentBusinessId');
      if (savedBusinessId) {
        const savedId = parseInt(savedBusinessId, 10);
        const businessExists = businesses.some(b => b.id === savedId);
        if (businessExists) {
          setCurrentBusinessId(savedId);
        } else {
          const firstBusiness = businesses[0];
          if (firstBusiness) {
            setCurrentBusinessId(firstBusiness.id);
            localStorage.setItem('currentBusinessId', String(firstBusiness.id));
          }
        }
      } else {
        const firstBusiness = businesses[0];
        if (firstBusiness) {
          setCurrentBusinessId(firstBusiness.id);
          localStorage.setItem('currentBusinessId', String(firstBusiness.id));
        }
      }
    }
  }, [businesses, currentBusinessId]);

  const currentBusiness = useMemo(() => {
    return businesses.find(b => b.id === currentBusinessId) || null;
  }, [businesses, currentBusinessId]);

  const switchBusiness = useCallback((businessId: number) => {
    setCurrentBusinessId(businessId);
    localStorage.setItem('currentBusinessId', String(businessId));
    // Invalidate all business-specific queries
    queryClient.invalidateQueries({ queryKey: ['business'] });
  }, [queryClient]);

  const refetchBusinesses = useCallback(() => {
    refetch();
  }, [refetch]);

  const value = useMemo(
    () => ({
      businesses,
      currentBusiness,
      isLoading,
      isFetching,
      error: error as Error | null,
      switchBusiness,
      refetchBusinesses,
    }),
    [businesses, currentBusiness, isLoading, isFetching, error, switchBusiness, refetchBusinesses]
  );

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};
