"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiEnvelope, ActiveAd } from "@/types/api";

export function useActiveAds(): UseQueryResult<ApiEnvelope<ActiveAd[]>, Error> {
  return useQuery({
    queryKey: ["active-ads"],
    queryFn: async () => {
      const res = await fetch(`/api/ads/active`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch ads");
      return data;
    },
    staleTime: 60_000,
  });
}
