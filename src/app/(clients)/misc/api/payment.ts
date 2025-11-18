"use client";
import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import type { ApiEnvelope, ApiMessage, PremiumPlan } from "@/types/api";

export function usePlans(): UseQueryResult<ApiEnvelope<PremiumPlan[]>, Error> {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await fetch(`/api/payment/plans`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch premium plans");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useVerifyPayment(): UseMutationResult<ApiMessage, Error, { reference_id: string }> {
  return useMutation({
    mutationFn: async ({ reference_id }) => {
      const res = await fetch(`/api/payment/subscription/verify?reference_id=${encodeURIComponent(reference_id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Verification failed");
      return data;
    },
  });
}

export function useVerifyPaymentWithPolling(options?: { intervalMs?: number; maxAttempts?: number }): UseMutationResult<ApiMessage, Error, { reference_id: string }> {
  const intervalMs = options?.intervalMs ?? 2000;
  const maxAttempts = options?.maxAttempts ?? 15;
  return useMutation({
    mutationFn: async ({ reference_id }) => {
      let attempt = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        attempt += 1;
        const res = await fetch(`/api/payment/subscription/verify?reference_id=${encodeURIComponent(reference_id)}`);
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          // Expect ApiMessage shape
          const message: string = (data as any)?.message || "";
          const completed = /completed/i.test(message);
          const processing = /processing/i.test(message);
          if (completed) return data as ApiMessage;
          if (!processing) return data as ApiMessage; // fallback: return whatever message indicates
          if (attempt >= maxAttempts) return data as ApiMessage; // give up after attempts
          await new Promise((r) => setTimeout(r, intervalMs));
          continue;
        } else {
          // On non-2xx, throw with message so UI can show error
          const msg = (data as any)?.message || (data as any)?.error || "Verification failed";
          throw new Error(msg);
        }
      }
    },
  });
}

export function useCancelSubscription(): UseMutationResult<ApiMessage, Error, void> {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/payment/subscription/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to cancel subscription");
      return data;
    },
  });
}

export function useRetrySubscription(): UseMutationResult<ApiMessage, Error, void> {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/payment/subscription/retry`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to retry subscription");
      return data;
    },
  });
}

export function useChangeCard(): UseMutationResult<{ card_update_link: string; message: string }, Error, void> {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/payment/subscription/change-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok || !data?.card_update_link) throw new Error(data?.message || data?.error || "Failed to get change card url");
      return { card_update_link: data.card_update_link, message: data.message };
    },
  });
}
