"use client";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { ProfileUpdateInput } from "@/schemas/profileSchema";
import { authAwareFetch } from "@/utils/authAwareFetch";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export function useUpdateProfile(): UseMutationResult<ApiResponse<unknown>, Error, ProfileUpdateInput> {
  const { handleErrorObject } = useAuthErrorHandler();
  
  return useMutation<ApiResponse<unknown>, Error, ProfileUpdateInput>({
    mutationFn: async (values: ProfileUpdateInput) => {
      const res = await authAwareFetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Profile update failed");
      }
      return data;
    },
    onError: handleErrorObject,
  });
}
