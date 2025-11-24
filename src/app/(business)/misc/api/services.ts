"use client";
import {  useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { BusinessId } from "./business";
import type { ApiEnvelope, BusinessService } from "@/types/api";

export function useGetServices(businessId: BusinessId): UseQueryResult<ApiEnvelope<BusinessService[]>, Error> {
  return useQuery({
    queryKey: ["business-services", businessId],
    queryFn: async () => {
      const res = await fetch(`/api/business/${businessId}/services`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch services");
      return data;
    },
    enabled: Boolean(businessId),
  });
}



export function useGetService(businessId: BusinessId, serviceId: number | string): UseQueryResult<ApiEnvelope<BusinessService>, Error> {
  return useQuery({
    queryKey: ["business-service", businessId, serviceId],
    queryFn: async () => {
      const res = await fetch(`/api/business/${businessId}/services/${serviceId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch service");
      return data;
    },
    enabled: Boolean(businessId && serviceId),
  });
}

