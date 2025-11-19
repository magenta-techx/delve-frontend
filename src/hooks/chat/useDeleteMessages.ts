import { useState } from 'react';

export function useDeleteMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteMessages(chatId: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat/delete-messages/${chatId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to delete messages');
      }
      const json = await res.json();
      return json;
    } catch (err: any) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { deleteMessages, loading, error } as const;
}
