"use client";
import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import type { ApiEnvelope, ApiMessage, BillingData, SavedBusinessItem, UserDetail } from "@/types/api";

export function useCurrentUser(): UseQueryResult<ApiEnvelope<UserDetail>, Error> {
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: async () => {
      const res = await fetch(`/api/user`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch user");
      return data;
    },
  });
}

export function useUserByEmail(email: string): UseQueryResult<ApiEnvelope<UserDetail>, Error> {
  return useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      const res = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch user");
      return data;
    },
    enabled: !!email,
  });
}

export function useDeactivateAccount(): UseMutationResult<ApiMessage, Error, void> {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/user/deactivate`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to deactivate account");
      return data;
    },
  });
}

export function useDeleteAccount(): UseMutationResult<ApiMessage, Error, void> {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/user/delete`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete account");
      return data;
    },
  });
}

export function useBilling(): UseQueryResult<ApiEnvelope<BillingData>, Error> {
  return useQuery({
    queryKey: ["user", "billing"],
    queryFn: async () => {
      const res = await fetch(`/api/user/billing`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch billing");
      return data;
    },
  });
}

export function useSavedBusinesses(): UseQueryResult<ApiEnvelope<SavedBusinessItem[]>, Error> {
  return useQuery({
    queryKey: ["user", "saved-business"],
    queryFn: async () => {
      const res = await fetch(`/api/user/saved-business`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch saved businesses");
      return data;
    },
  });
}

export function useSaveBusiness(): UseMutationResult<ApiMessage, Error, { business_id: number | string }> {
  return useMutation({
    mutationFn: async ({ business_id }) => {
      const res = await fetch(`/api/user/saved-business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save business");
      return data;
    },
  });
}

export function useUnsaveBusiness(): UseMutationResult<ApiMessage, Error, { business_id: number | string }> {
  return useMutation({
    mutationFn: async ({ business_id }) => {
      const res = await fetch(`/api/user/saved-business/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to remove saved business");
      return data;
    },
  });
}

export function useUpdateUser(): UseMutationResult<ApiMessage, Error, Partial<{
  first_name: string;
  last_name: string;
  password: string;
  profile_image: string;
}>> {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`/api/user/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update user");
      return data;
    },
  });
}
