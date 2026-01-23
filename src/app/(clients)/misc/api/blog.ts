"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiEnvelope, BlogDetails, BlogListItem } from "@/types/api";
import { apiRequest } from '@/utils/apiHandler';

export function useAllBlogs(category?: string): UseQueryResult<ApiEnvelope<BlogListItem[]>, Error> {
  return useQuery({
    queryKey: ["blogs", category],
    queryFn: async () => {
      const url = new URL(`/api/blog`, window.location.origin);
      if (category) url.searchParams.set("category", category);
      const res = await apiRequest(`${url.pathname}${url.search}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch blogs");
      return data;
    },
  });
}

export function useBlog(blogId?: number | string): UseQueryResult<ApiEnvelope<BlogDetails>, Error> {
  return useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const res = await apiRequest(`/api/blog/${blogId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch blog");
      return data;
    },
    enabled: Boolean(blogId),
  });
}
