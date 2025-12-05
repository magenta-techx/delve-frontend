// const /api/business/[business_id]/reviews

import { ApiEnvelope } from "@/types/api";
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query";

export function useBusinessReviews(
  businessId?: string | number,
): UseQueryResult<ApiEnvelope<{}>, Error> {
  return useQuery({
    queryKey: ['business-reviews', businessId],

    queryFn: async () => {
      const res = await fetch(
        `/api/business/${businessId}/reviews/`,
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || 'Failed to fetch business details');
      return data;
    },
    enabled: Boolean(businessId),
  });
}




export function useSendReview(): UseMutationResult<
    ApiEnvelope<{}>,
    Error,
    {
        business_id: number | string;
        service_id?: number;
        service_text?: string;
        rating: number;
        content: string;
    }
> {
    return useMutation({
        mutationFn: async ({ business_id, service_id, service_text, rating, content }) => {
            const payload: Record<string, any> = {
                rating,
                content,
            };
            if (service_id !== undefined) payload['service_id'] = service_id;
            if (service_text !== undefined) payload['service_text'] = service_text;

            const res = await fetch(`/api/business/${business_id}/reviews/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to send review');
            return data;
        },
    });
}


export function useReplyToReview(): UseMutationResult<
    ApiEnvelope<{}>,
    Error,
    {
        business_id: number | string;
        review_id: number;
        content: string;
        parent_reply_id?: number;
    }
> {
    return useMutation({
        mutationFn: async ({ business_id, review_id, content, parent_reply_id }) => {
            const payload: Record<string, any> = {
                review_id,
                content,
            };
            if (parent_reply_id !== undefined) payload['parent_reply_id'] = parent_reply_id;
            const res = await fetch(`/api/business/${business_id}/reviews/reply/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Failed to send review reply');
            return data;
        }
    });
}