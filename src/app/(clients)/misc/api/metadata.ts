"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiEnvelope, Amenity, CategoryFull, Subcategory, StateItem } from "@/types/api";

export function useBusinessAmenities(): UseQueryResult<ApiEnvelope<Amenity[]>, Error> {
  return useQuery({
    queryKey: ["business-amenities"],
    queryFn: async () => {
      const res = await fetch(`/api/business/amenities`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch amenities");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBusinessCategories(): UseQueryResult<ApiEnvelope<CategoryFull[]>, Error> {
  return useQuery({
    queryKey: ["business-categories"],
    queryFn: async () => {
      const res = await fetch(`/api/business/categories`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch categories");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBusinessSubcategories(category?: string): UseQueryResult<ApiEnvelope<Subcategory[]>, Error> {
  return useQuery({
    queryKey: ["business-subcategories", category],
    queryFn: async () => {
      const qs = category ? `?category=${encodeURIComponent(category)}` : "";
      const res = await fetch(`/api/business/subcategories${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch subcategories");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBusinessStates(): UseQueryResult<ApiEnvelope<StateItem[]>, Error> {
  return useQuery({
    queryKey: ["business-states"],
    queryFn: async () => {
      const res = await fetch(`/api/business/states`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch states");
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}
