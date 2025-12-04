import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async (googleToken: string) => {
      const res = await signIn('credentials', {
        redirect: false,
        googleToken,
      });
      
      if (!res || res.error) {
        throw new Error(res?.error || 'Google login failed');
      }
      
      return { ok: true } as const;
    },
  });
}
