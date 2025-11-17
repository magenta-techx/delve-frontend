import { useMutation, type UseMutationResult } from "@tanstack/react-query";

export function usePromotionCheckout() {
  return useMutation({
    mutationFn: async (payload: {
      business_id: number | string;
      plan_id: number | string;
      custom_number_of_days?: number;
      campaign_extension?: boolean;
    }) => {
      const res = await fetch(`/api/payment/plans/checkout/business-promotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.checkout_url) throw new Error(data?.message || data?.error || "Failed to create checkout session");
      return data;
    },
  });
}

export function useAdvertCheckout() {
  return useMutation({
    mutationFn: async (payload: {
      business_id: number | string;
      plan_id: number | string;
      advertisment_image?: File;
      campaign_extension?: boolean;
    }) => {
      const formData = new FormData();
      formData.append("business_id", String(payload.business_id));
      formData.append("plan_id", String(payload.plan_id));
      if (payload.advertisment_image) formData.append("advertisment_image", payload.advertisment_image);
      if (payload.campaign_extension !== undefined) formData.append("campaign_extension", payload.campaign_extension ? "true" : "false");
      const res = await fetch(`/api/payment/plans/checkout/advertisment`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data?.checkout_url) throw new Error(data?.message || data?.error || "Failed to create checkout session");
      return data;
    },
  });
}
