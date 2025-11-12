"use client";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { ChangePasswordInput } from "@/schemas/profileSchema";
import { authAwareFetch } from "@/utils/authAwareFetch";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export function useChangePassword(): UseMutationResult<ApiResponse<unknown>, Error, ChangePasswordInput> {
  const { handleErrorObject } = useAuthErrorHandler();
  
  return useMutation<ApiResponse<unknown>, Error, ChangePasswordInput>({
    mutationFn: async (values: ChangePasswordInput) => {
      const res = await authAwareFetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Password change failed");
      }
      return data;
    },
    onError: handleErrorObject,
  });
}
