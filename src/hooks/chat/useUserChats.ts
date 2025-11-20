"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiEnvelope } from "@/types/api";

export interface UserChatItem {
  business: {
    id: string | number;
    name: string;
    logo: string;
  };
  is_pinned: boolean;
  last_message_sent_at: string | null;
  last_message: {
    image?: string;
    content?: string;
    is_image_message?: boolean;
    sender?: {
      id?: number;
      first_name?: string;
      last_name?: string;
      profile_image?: string | null;
    };
    is_read?: boolean;
    sent_at?: string;
  } | null;
}


export function useUserChats(): UseQueryResult<ApiEnvelope<UserChatItem[]>, Error> {
  return useQuery<ApiEnvelope<UserChatItem[]>, Error>({
    queryKey: ["user-chats"],
    queryFn: async () => {
      const res = await fetch(`/api/chat/user`);
      const data = (await res.json()) as ApiEnvelope<UserChatItem[]>;
      if (!res.ok) throw new Error(data?.message || "Failed to fetch user chats");
      return data;
    },
    retry: 2,
  });
}
