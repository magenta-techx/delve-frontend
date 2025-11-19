import { useEffect, useState } from 'react';

export function useBusinessChats(businessId: string | number | null) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchChats() {
    if (!businessId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat/business/${businessId}`);
      if (!res.ok) throw new Error('Failed to fetch business chats');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  return { data, loading, error, refresh: fetchChats } as const;
}
