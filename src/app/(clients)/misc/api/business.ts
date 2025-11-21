"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiEnvelope, PaginatedResponse, BusinessSummary, BusinessDetail } from "@/types/api";
import { apiRequest } from '@/utils/apiHandler';

export interface CampaignAnalyticsResponse {
  total_spending: number;
  payment_history: Array<{ amount_paid: number; timestamp: string }>;
  active_campaign: Record<string, any>;
  performance_metrics: {
    summary_metrics?: {
      image?: string;
      total_impressions?: number;
      total_clicks?: number;
      days_left?: number | null;
    };
    daily_metrics?: Array<{
      date: string;
      daily_views: number;
      daily_clicks: number;
    }>;
  };
}
export function useBusinessCampaignAnalytics(params: { businessId?: string | number | undefined; requested_metric: 'promotion' | 'advert'; filter_method?: 'all_time' | 'this_month' | 'last_6_months' | 'last_12_months' }) {
  const qs = new URLSearchParams();
  qs.set('requested_metric', params.requested_metric);
  if (params.filter_method) qs.set('filter_method', params.filter_method);
  return useQuery<ApiEnvelope<CampaignAnalyticsResponse>, Error>({
    queryKey: ['business-campaign-analytics', params.businessId, params.requested_metric, params.filter_method],
    queryFn: async () => {
      const res = await apiRequest(`/api/business/${params.businessId}/analytics/campaigns?${qs.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || 'Failed to fetch campaign analytics');
      return data;
    },
    enabled: Boolean(params.businessId && params.requested_metric),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData, previousQuery) => {
      if (
        previousQuery?.queryKey?.[1] === params.businessId
      ) {
        return previousData;
      }
      return undefined;
    },
  });
}

export function useApprovedBusinesses(): UseQueryResult<ApiEnvelope<BusinessSummary[]>, Error> {
  return useQuery({
    queryKey: ["approved-businesses"],
    queryFn: async () => {
      const res = await apiRequest(`/api/business/approved`, {}, undefined, { skipAuthRedirect: true });
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
      const res = await apiRequest(`/api/business/search?${qs.toString()}`, {}, undefined, { skipAuthRedirect: true });
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
      const res = await apiRequest(`/api/business/trending`, {}, undefined, { skipAuthRedirect: true });
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
      const res = await apiRequest(`/api/business/${businessId}?${qs.toString()}`, {}, undefined, { skipAuthRedirect: true });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch business");
      return data;
    },
    enabled: Boolean(businessId),
    retry: 2
  });
}
