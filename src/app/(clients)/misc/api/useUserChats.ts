"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ApiEnvelope } from "@/types/api";
import { apiRequest } from '@/utils/apiHandler';



export interface UserChatItem {
  id: number;
  business: Business;
  is_pinned_by_customer: boolean;
  last_message_sent_at: null | string;
  last_message: Lastmessage;
}

interface Lastmessage {
  content: string;
  is_image_message: boolean;
  sender: Sender;
  is_read: boolean;
  id?: number;
  image?: string;
  sent_at?: string;
  is_deleted_by_business: boolean;
  is_deleted_by_customer: boolean;
}

interface Sender {
  first_name: string;
  last_name: string;
  id?: number;
  profile_image?: string;
}

interface Business {
  id: number;
  name: string;
  logo: string;
  is_free_trial_active?: boolean;
  owner?: {
    is_premium_plan_active?: boolean;
  };
}


export function useUserChats(): UseQueryResult<ApiEnvelope<UserChatItem[]>, Error> {
  return useQuery<ApiEnvelope<UserChatItem[]>, Error>({
    queryKey: ["user-chats"],
    queryFn: async () => {
      const res = await apiRequest(`/api/chat/user`);
      const data = (await res.json()) as ApiEnvelope<UserChatItem[]>;
      if (!res.ok) throw new Error(data?.message || "Failed to fetch user chats");
      return data;
    },
    retry: 2,
  });
}
