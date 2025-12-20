// const /api/business/[business_id]/reviews

import { ApiEnvelope, BusinessReviewThread } from "@/types/api";
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiRequest } from '@/utils/apiHandler';

export function useBusinessReviews(
  businessId?: string | number,
): UseQueryResult<ApiEnvelope<BusinessReviewThread[]>, Error> {
  return useQuery({
    queryKey: ['business-reviews', businessId],

    queryFn: async () => {
            const res = await apiRequest(
                `/api/business/${businessId}/reviews/`,
                {
                    cache: 'no-store',
                },
            );
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data?.error || data?.message || 'Failed to fetch business reviews');
            }
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

            const res = await apiRequest(`/api/business/${business_id}/reviews/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to send review');
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
                        const res = await apiRequest(`/api/business/${business_id}/reviews/reply/`, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(payload),
                        });
                        const data = await res.json().catch(() => ({}));
                        if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to send review reply');
                        return data;
        }
    });
}

export async function fetchBusinessReviewThread(
    businessId: number | string,
    reviewId: number | string,
): Promise<BusinessReviewThread | null> {
    const response = await apiRequest(
        `/api/business/${businessId}/reviews/?review_id=${reviewId}`,
        { cache: 'no-store' },
    );

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        const message = payload?.error || payload?.message || 'Failed to fetch review thread';
        throw new Error(message);
    }

    const rawData = payload?.data;
    if (!rawData) return null;

    if (Array.isArray(rawData)) {
        const matched = rawData.find((item: BusinessReviewThread) => item?.id === Number(reviewId));
        return matched ?? (rawData[0] ?? null);
    }

    if (typeof rawData === 'object' && rawData !== null) {
        return rawData as BusinessReviewThread;
    }

    return null;
}