import { useEffect, useState } from 'react';

export function useUserChats() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchChats() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat/user`);
      if (!res.ok) throw new Error('Failed to fetch user chats');
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchChats();
  }, []);

  return { data, loading, error, refresh: fetchChats } as const;
}
