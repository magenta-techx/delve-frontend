'use client';

import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { authAwareFetch } from '@/utils/authAwareFetch';
import { ContactFormInput } from '@/schemas/contactSchema';
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';

export interface ContactResponse {
  status: boolean;
  message: string;
}

export function useSendContactMessage(): UseMutationResult<
  ContactResponse,
  Error,
  ContactFormInput
> {
  const { handleErrorObject } = useAuthErrorHandler();

  return useMutation<ContactResponse, Error, ContactFormInput>({
    mutationFn: async (data: ContactFormInput) => {
      const res = await authAwareFetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.full_name,
          business_name: data.business_name || null,
          email: data.email,
          message: data.message,
        }),
        skipAuthRedirect: true,
      } as any);

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            'Failed to send message'
        );
      }

      return responseData;
    },
    onError: (error: Error) => {
      handleErrorObject(error);
    },
  });
}
