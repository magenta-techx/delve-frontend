"use client";
import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";
import type { BusinessId } from "./business";
import type { ApiEnvelope, ApiMessage, ServiceMini } from "@/types/api";

export function useGetServices(businessId: BusinessId): UseQueryResult<ApiEnvelope<ServiceMini[]>, Error> {
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

export function useCreateServices(): UseMutationResult<ApiMessage, Error, { business_id: BusinessId; services?: Array<Partial<ServiceMini>> } & Record<string, unknown>> {
  return useMutation({
    mutationFn: async ({ business_id, ...body }) => {
      const res = await fetch(`/api/business/${business_id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create service(s) failed");
      return data;
    },
  });
}

export function useGetService(businessId: BusinessId, serviceId: number | string): UseQueryResult<ApiEnvelope<ServiceMini>, Error> {
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

export function useUpdateService(): UseMutationResult<ApiMessage, Error, { business_id: BusinessId; service_id: number | string; values: Partial<ServiceMini> & Record<string, unknown> }> {
  return useMutation({
    mutationFn: async ({ business_id, service_id, values }) => {
      const res = await fetch(`/api/business/${business_id}/services/${service_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update service failed");
      return data;
    },
  });
}

export function useDeleteService(): UseMutationResult<ApiMessage, Error, { business_id: BusinessId; service_id: number | string }> {
  return useMutation({
    mutationFn: async ({ business_id, service_id }) => {
      const res = await fetch(`/api/business/${business_id}/services/${service_id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as any)?.error || "Delete service failed");
      return data;
    },
  });
}
