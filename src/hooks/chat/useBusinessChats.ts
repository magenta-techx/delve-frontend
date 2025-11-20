"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiEnvelope } from "@/types/api";

export interface BusinessChatItem {
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    profile_image?: string | null;
  };
  is_pinned?: boolean;
  last_message_sent_at?: string | null;
  last_message?: {
    image?: string;
    content?: string;
    is_image_message?: boolean;
    sender?: {
      id: number;
      first_name?: string;
      last_name?: string;
      profile_image?: string | null;
    };
    is_read?: boolean;
    sent_at?: string;
  } | null;
}

export function useBusinessChats(businessId: string | number | null): UseQueryResult<ApiEnvelope<BusinessChatItem[]>, Error> {
  return useQuery<ApiEnvelope<BusinessChatItem[]>, Error>({
    queryKey: ["business-chats", businessId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/business/${businessId}`);
      const data = (await res.json()) as ApiEnvelope<BusinessChatItem[]>;
      if (!res.ok) throw new Error(data?.message || "Failed to fetch business chats");
      return data;
    },
    enabled: Boolean(businessId),
    retry: 2,
  });
}


