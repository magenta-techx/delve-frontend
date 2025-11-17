import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { ApiMessage } from "@/types/api";

interface ActivateBusinessPayload {
  business_id: string | number;
  activation_status: "activate";
}

interface DeactivateBusinessPayload {
  business_id: string | number;
  activation_status: "deactivate";
  business_name: string;
  reason_for_deactivation: string;
}

export function useBusinessActivation(): UseMutationResult<ApiMessage, Error, ActivateBusinessPayload | DeactivateBusinessPayload> {
  return useMutation({
    mutationFn: async (payload) => {
      const { business_id, activation_status } = payload;
      let url = `/api/business/${business_id}/activation`;
      let body: any = { activation_status };
      if (activation_status === "deactivate") {
        body.business_name = (payload as DeactivateBusinessPayload).business_name;
        body.reason_for_deactivation = (payload as DeactivateBusinessPayload).reason_for_deactivation;
      }
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update business activation status");
      return data;
    },
  });
}
