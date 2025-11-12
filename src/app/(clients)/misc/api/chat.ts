"use client";
import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import type { ApiEnvelope, ApiMessage, ChatListItem, ChatMessage } from "@/types/api";

export function useUserChats(): UseQueryResult<ApiEnvelope<ChatListItem[]>, Error> {
  return useQuery({
    queryKey: ["user-chats"],
    queryFn: async () => {
      const res = await fetch(`/api/chat/user`);
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
      const res = await fetch(`/api/chat/${chatId}/messages`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch messages");
      return data;
    },
    enabled: Boolean(chatId),
    refetchInterval: 5000,
  });
}

export function useDeleteChatMessages(): UseMutationResult<ApiMessage, Error, { chat_id: number | string }> {
  return useMutation({
    mutationFn: async ({ chat_id }) => {
      const res = await fetch(`/api/chat/${chat_id}/delete`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as any)?.error || "Delete chat failed");
      return data;
    },
  });
}
