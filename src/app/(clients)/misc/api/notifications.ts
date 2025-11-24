"use client";
import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import type { ApiEnvelope, ApiMessage, NotificationItem } from "@/types/api";
import { apiRequest } from '@/utils/apiHandler';

export function useNotifications(params?: { notification_for?: "user" | "business"; business_id?: number | string }): UseQueryResult<ApiEnvelope<NotificationItem[]>, Error> {
  const qs = new URLSearchParams();
  if (params?.notification_for) qs.set("notification_for", params.notification_for);
  if (params?.business_id) qs.set("business_id", String(params.business_id));
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const res = await apiRequest(`/api/notifications?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch notifications");
      return data;
    },
    refetchInterval: 15_000,
  });
}

export function useMarkAllNotifications(): UseMutationResult<ApiMessage, Error, { business_id?: number | string } | void> {
  return useMutation({
    mutationFn: async (body) => {
      const res = await apiRequest(`/api/notifications/mark-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        ...(body && { body: JSON.stringify(body) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to mark all notifications");
      return data;
    },
  });
}

export function useMarkNotificationSeen(): UseMutationResult<ApiMessage, Error, { notification_id: number | string }> {
  return useMutation({
    mutationFn: async ({ notification_id }) => {
      const res = await apiRequest(`/api/notifications/${notification_id}/seen`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to mark notification seen");
      return data;
    },
  });
}
