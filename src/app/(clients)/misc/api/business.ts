"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiEnvelope, PaginatedResponse, BusinessSummary, BusinessDetail } from "@/types/api";

export function useApprovedBusinesses(): UseQueryResult<ApiEnvelope<BusinessSummary[]>, Error> {
  return useQuery({
    queryKey: ["approved-businesses"],
    queryFn: async () => {
      const res = await fetch(`/api/business/approved`);
      const json: PaginatedResponse<BusinessSummary[]> = await res.json();
      if (!res.ok) throw new Error(json?.results?.message || "Failed to fetch businesses");
      return json.results;
    },
    retry: 2,
  });
}

export function useSearchBusinesses(params?: { q?: string; category?: string; state?: string; longitude?: string | number; latitude?: string | number }): UseQueryResult<ApiEnvelope<BusinessSummary[]>, Error> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.category) qs.set("category", params.category);
  if (params?.state) qs.set("state", params.state);
  if (params?.longitude) qs.set("longitude", String(params.longitude));
  if (params?.latitude) qs.set("latitude", String(params.latitude));
  return useQuery({
    queryKey: ["business-search", params],
    queryFn: async () => {
      const res = await fetch(`/api/business/search?${qs.toString()}`);
      const json: PaginatedResponse<BusinessSummary[]> = await res.json();
      if (!res.ok) throw new Error(json?.results?.message || "Search failed");
      return json.results;
    },
    retry: 2
  });
}

export function useTrendingBusiness(): UseQueryResult<ApiEnvelope<BusinessDetail>, Error> {
  return useQuery({
    queryKey: ["trending-business"],
    queryFn: async () => {
      const res = await fetch(`/api/business/trending`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch trending business");
      return data;
    },
    retry: 2
  });
}

export function useBusinessPublic(businessId?: number | string, page?: string): UseQueryResult<ApiEnvelope<BusinessDetail>, Error> {
  const qs = new URLSearchParams();
  if (page) qs.set("page", page);
  return useQuery({
    queryKey: ["business-public", businessId, page],
    queryFn: async () => {
      const res = await fetch(`/api/business/${businessId}?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch business");
      return data;
    },
    enabled: Boolean(businessId),
    retry: 2
  });
}
