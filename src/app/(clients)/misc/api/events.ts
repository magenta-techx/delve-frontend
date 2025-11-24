"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiEnvelope, EventItem } from "@/types/api";
import { apiRequest } from '@/utils/apiHandler';

export function useEvents(state?: string): UseQueryResult<ApiEnvelope<EventItem[]>, Error> {
  return useQuery({
    queryKey: ["events", state],
    queryFn: async () => {
      const qs = state ? `?state=${encodeURIComponent(state)}` : "";
      const res = await apiRequest(`/api/events${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch events");
      return data;
    },
  });
}
