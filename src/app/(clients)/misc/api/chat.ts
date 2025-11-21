"use client";
import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import type { ApiEnvelope, ApiMessage, ChatListItem, ChatMessage } from "@/types/api";
import { apiRequest } from '@/utils/apiHandler';

export function useUserChats(): UseQueryResult<ApiEnvelope<ChatListItem[]>, Error> {
  return useQuery({
    queryKey: ["user-chats"],
    queryFn: async () => {
      const res = await apiRequest(`/api/chat/user`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch chats");
      return data;
    },
    refetchInterval: 15_000,
  });
}

export function useChatMessages(chatId?: number | string): UseQueryResult<ApiEnvelope<ChatMessage[]>, Error> {
  return useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const res = await apiRequest(`/api/chat/${chatId}/messages`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch messages");
      return data;
    },
    enabled: Boolean(chatId),
    refetchInterval: 5000,
  });
}


export function useChatMessagesII(chatId?: string | null) {
  const fetchMessages = async () => {
    if (!chatId) return null;
    const res = await apiRequest(`/api/chat/${chatId}/messages`);
    if (!res.ok) throw new Error('Failed to fetch chat messages');
    const json = await res.json();
    return json.data || json;
  };

  const {
    data,
    error,
    isLoading: loading,
    refetch: refresh,
  } = useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: fetchMessages,
    enabled: !!chatId,
  });

  return { data, loading, error: error?.message ?? null, refresh } as const;
}

export function useDeleteChatMessages(): UseMutationResult<ApiMessage, Error, { chat_id: number | string }> {
  return useMutation({
    mutationFn: async ({ chat_id }) => {
      const res = await apiRequest(`/api/chat/${chat_id}/delete`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as any)?.error || "Delete chat failed");
      return data;
    },
  });
}
