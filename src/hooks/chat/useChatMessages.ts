import { useEffect, useState, useCallback } from 'react';

export function useChatMessages(chatId?: string | null) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat/${chatId}/messages`);
      if (!res.ok) throw new Error('Failed to fetch chat messages');
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    void fetchMessages();
  }, [fetchMessages]);

  return { data, loading, error, refresh: fetchMessages } as const;
}
