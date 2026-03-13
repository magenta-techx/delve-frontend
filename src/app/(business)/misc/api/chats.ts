'use client';
import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { BusinessId } from './business';
import type {
  ApiEnvelope,
  ApiMessage,
  BusinessChatListItem,
} from '@/types/api';

export function useBusinessChats(
  businessId: BusinessId | null
): UseQueryResult<ApiEnvelope<BusinessChatListItem[]>, Error> {
  return useQuery({
    queryKey: ['business-chats', businessId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/business/${businessId}`);
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Failed to fetch business chats');
      return data;
    },
    enabled: Boolean(businessId),
  });
}

export function useSendChatImages(): UseMutationResult<
  ApiMessage,
  Error,
  { chat_id: number | string; images: FileList | File[] }
> {
  return useMutation({
    mutationFn: async ({ chat_id, images }) => {
      const fd = new FormData();
      fd.append('chat_id', String(chat_id));
      Array.from(images).forEach(file => fd.append('images', file));
      const res = await fetch(`/api/chat/add-image`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to send chat images');
      return data;
    },
  });
}

export function usePinBusinessChat(): UseMutationResult<
  ApiMessage,
  Error,
  { chat_id: number | string; is_pinned: boolean }
> {
  return useMutation({
    mutationFn: async ({ chat_id, is_pinned }) => {
      const res = await fetch(`/api/chat/${chat_id}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pinned }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error((data as any)?.error || 'Pin chat failed');
      return data;
    },
  });
}

