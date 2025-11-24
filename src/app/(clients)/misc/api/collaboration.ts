"use client";
import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import type { ApiEnvelope, ApiMessage, CollaborationSummary, CollaborationDetail } from "@/types/api";
import { apiRequest } from '@/utils/apiHandler';

export function useCollaborations(): UseQueryResult<ApiEnvelope<CollaborationSummary[]>, Error> {
  return useQuery({
    queryKey: ["collaborations"],
    queryFn: async () => {
      const res = await apiRequest(`/api/collaboration`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch collaborations");
      return data;
    },
  });
}

export function useCreateCollaboration(): UseMutationResult<ApiEnvelope<{ id: number; name: string }>, Error, { name: string; business_ids: number[] }> {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiRequest(`/api/collaboration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create collaboration");
      return data;
    },
  });
}

export function useUpdateInviteStatus(): UseMutationResult<ApiMessage, Error, { member_id: number | string; status: string }> {
  return useMutation({
    mutationFn: async ({ member_id, status }) => {
      const res = await apiRequest(`/api/collaboration/invite/${member_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update invite status");
      return data;
    },
  });
}

export function useUpdateMemberPrivilege(): UseMutationResult<ApiMessage, Error, { member_id: number | string; privilege: string }> {
  return useMutation({
    mutationFn: async ({ member_id, privilege }) => {
      const res = await apiRequest(`/api/collaboration/member/${member_id}/privilege`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privilege }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update member privilege");
      return data;
    },
  });
}

export function useRemoveCollaborationMember(): UseMutationResult<ApiMessage, Error, { member_id: number | string }> {
  return useMutation({
    mutationFn: async ({ member_id }) => {
      const res = await apiRequest(`/api/collaboration/member/${member_id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to remove member");
      return data;
    },
  });
}

export function useCollaboration(collab_id?: number | string): UseQueryResult<ApiEnvelope<CollaborationDetail>, Error> {
  return useQuery({
    queryKey: ["collaboration", collab_id],
    queryFn: async () => {
      const res = await apiRequest(`/api/collaboration/${collab_id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch collaboration");
      return data;
    },
    enabled: !!collab_id,
  });
}

export function useReplaceCollaborationBusinesses(): UseMutationResult<ApiMessage, Error, { collab_id: number | string; business_ids: number[] }> {
  return useMutation({
    mutationFn: async ({ collab_id, business_ids }) => {
      const res = await apiRequest(`/api/collaboration/${collab_id}/businesses/replace`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_ids }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to replace businesses");
      return data;
    },
  });
}

export function useRemoveCollaborationBusiness(): UseMutationResult<ApiMessage, Error, { collab_id: number | string; business_id: number }> {
  return useMutation({
    mutationFn: async ({ collab_id, business_id }) => {
      const res = await apiRequest(`/api/collaboration/${collab_id}/businesses/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to remove business");
      return data;
    },
  });
}

export function useDeleteCollaboration(): UseMutationResult<ApiMessage, Error, { collab_id: number | string }> {
  return useMutation({
    mutationFn: async ({ collab_id }) => {
      const res = await apiRequest(`/api/collaboration/${collab_id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete collaboration");
      return data;
    },
  });
}

export function useUpdateCollaboration(): UseMutationResult<ApiMessage, Error, { collab_id: number | string; name?: string; description?: string }> {
  return useMutation({
    mutationFn: async ({ collab_id, ...body }) => {
      const res = await apiRequest(`/api/collaboration/${collab_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update collaboration");
      return data;
    },
  });
}
