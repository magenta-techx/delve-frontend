'use client';

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { ApiEnvelope } from '@/types/api';
import { apiRequest } from '@/utils/apiHandler';

export type SubmitReviewPayload = {
  business_id: number | string;
  rating: number;
  content: string;
  service_id?: number;
  service_text?: string;
};

export function useSubmitBusinessReview(): UseMutationResult<
  ApiEnvelope<unknown>,
  Error,
  SubmitReviewPayload
> {
  return useMutation({
    mutationFn: async ({ business_id, ...body }) => {
      const response = await apiRequest(
        `/api/business/${business_id}/reviews/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        undefined,
        { skipAuthRedirect: false }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message =
          data?.error || data?.message || 'Failed to submit review';
        throw new Error(message);
      }

      return data;
    },
  });
}
