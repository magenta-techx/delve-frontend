'use client';
import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import type {
  ApiEnvelope,
  ApiMessage,
  BillingData,
  SavedBusinessItem,
  UserResponse,
  PlansResponse,
  SubscriptionPlan,
  AdvertisementPlan,
  BusinessPromotionPlan,
} from '@/types/api';
import { apiRequest } from '@/utils/apiHandler';

export function useCurrentUser(
  enabled?: boolean
): UseQueryResult<UserResponse, Error> {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: async () => {
      const res = await apiRequest(`/api/user`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch user');
      return data;
    },
    enabled: !!enabled,
  });
}

export function checkUserByEmail(): UseMutationResult<UserResponse, Error, string> {
  return useMutation<UserResponse, Error, string>({
    mutationKey: ['user'],
    mutationFn: async (email: string) => {
      const res = await apiRequest(
        `/api/user?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch user');
      return data;
    },
  });
}

export function useUserByEmail(
  email: string
): UseQueryResult<UserResponse, Error> {
  return useQuery({
    queryKey: ['user', email],
    queryFn: async () => {
      const res = await apiRequest(
        `/api/user?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch user');
      return data;
    },
    enabled: !!email,
  });
}

export function useDeactivateAccount(): UseMutationResult<
  ApiMessage,
  Error,
  void
> {
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest(`/api/user/deactivate`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Failed to deactivate account');
      return data;
    },
  });
}

export function useDeleteAccount(): UseMutationResult<ApiMessage, Error, void> {
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest(`/api/user/delete`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete account');
      return data;
    },
  });
}

export function useBilling(): UseQueryResult<ApiEnvelope<BillingData>, Error> {
  return useQuery({
    queryKey: ['user', 'billing'],
    queryFn: async () => {
      const res = await apiRequest(`/api/user/billing`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch billing');
      return data;
    },
  });
}

export function useSavedBusinesses(
  enabled = true
): UseQueryResult<ApiEnvelope<SavedBusinessItem[]>, Error> {
  return useQuery({
    queryKey: ['user', 'saved-business'],
    queryFn: async () => {
      const res = await apiRequest(`/api/user/saved-business`);
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Failed to fetch saved businesses');
      return data;
    },
    enabled: Boolean(enabled),
  });
}

export function useSaveBusiness(): UseMutationResult<
  ApiMessage,
  Error,
  { business_id: number | string }
> {
  return useMutation({
    mutationFn: async ({ business_id }) => {
      const res = await apiRequest(`/api/user/saved-business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to save business');
      return data;
    },
  });
}

export function useUnsaveBusiness(): UseMutationResult<
  ApiMessage,
  Error,
  { business_id: number | string }
> {
  return useMutation({
    mutationFn: async ({ business_id }) => {
      const res = await apiRequest(`/api/user/saved-business/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Failed to remove saved business');
      return data;
    },
  });
}

export function useAvailablePlans(
  planType:
    | 'subscription'
    | 'advertisment'
    | 'business promotion' = 'subscription'
): UseQueryResult<PlansResponse, Error> {
  return useQuery({
    queryKey: ['plans', planType],
    queryFn: async () => {
      const res = await apiRequest(
        `/api/plans?plan_type=${encodeURIComponent(planType)}`
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message || data?.error || 'Failed to fetch plans'
        );
      return data;
    },
  });
}

// Typed hooks for specific plan types
export function useSubscriptionPlans(): UseQueryResult<
  ApiEnvelope<SubscriptionPlan[]>,
  Error
> {
  return useQuery({
    queryKey: ['plans', 'subscription'],
    queryFn: async () => {
      const res = await apiRequest(`/api/plans?plan_type=subscription`);
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message || data?.error || 'Failed to fetch subscription plans'
        );
      return { status: data.status, message: data.message, data: data.data };
    },
  });
}

export function useAdvertisementPlans(): UseQueryResult<
  ApiEnvelope<AdvertisementPlan[]>,
  Error
> {
  return useQuery({
    queryKey: ['plans', 'advertisment'],
    queryFn: async () => {
      const res = await apiRequest(`/api/plans?plan_type=advertisment`);
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message || data?.error || 'Failed to fetch advertisement plans'
        );
      return { status: data.status, message: data.message, data: data.data };
    },
  });
}

export function useBusinessPromotionPlans(): UseQueryResult<
  ApiEnvelope<BusinessPromotionPlan[]>,
  Error
> {
  return useQuery({
    queryKey: ['plans', 'business promotion'],
    queryFn: async () => {
      const res = await apiRequest(
        `/api/plans?plan_type=${encodeURIComponent('business promotion')}`
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message ||
            data?.error ||
            'Failed to fetch business promotion plans'
        );
      return { status: data.status, message: data.message, data: data.data };
    },
  });
}

export function useCreateSubscriptionCheckout(): UseMutationResult<
  ApiMessage & { checkout_url?: string },
  Error,
  { plan_id: string }
> {
  return useMutation({
    mutationFn: async ({ plan_id }) => {
      const res = await apiRequest(
        `/api/payment/subscription/checkout?plan_id=${encodeURIComponent(plan_id)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.message || data?.error || 'Failed to create checkout session'
        );
      return data;
    },
  });
}

export function useUpdateUser(): UseMutationResult<
  ApiMessage,
  Error,
  Partial<{
    first_name: string;
    last_name: string;
    password: string;
    profile_image: string;
  }>
> {
  return useMutation({
    mutationFn: async payload => {
      const res = await apiRequest(`/api/user/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update user');
      return data;
    },
  });
}

// Chat-related hooks
export interface ChatResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    business: {
      id: number;
      name: string;
      logo: string;
    };
    is_pinned: boolean;
    last_message_sent_at: string;
    last_message?: {
      image: string;
      content: string;
      is_image_message: boolean;
      sender: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
      };
      is_read: boolean;
      sent_at: string;
    };
  };
}

export function useStartChat(): UseMutationResult<ChatResponse, Error, { business_id: number }> {
  return useMutation({
    mutationFn: async ({ business_id }) => {
      const res = await apiRequest(`/api/chat/${business_id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to start chat');
      return data;
    },
  });
}

export function useGetUserChats(): UseQueryResult<
  { status: boolean; data: Array<{ id: number; business: { id: number; name: string; logo: string } }> },
  Error
> {
  return useQuery({
    queryKey: ['user', 'chats'],
    queryFn: async () => {
      const res = await apiRequest(`/api/chat/`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch chats');
      return data;
    },
  });
}
