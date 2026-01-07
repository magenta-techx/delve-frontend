import { useState } from 'react';
import { apiRequest } from '@/utils/apiHandler';

export function useAddImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addImage(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest(`/api/chat/add-image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to upload image');
      }
      const json = await res.json();
      return json;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { addImage, loading, error } as const;
}
