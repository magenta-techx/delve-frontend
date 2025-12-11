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

export interface ProfileUpdatePayload extends ProfileUpdateInput {
  old_password?: string;
  new_password?: string;
  profile_image?: File;
}

export function useUpdateProfile(): UseMutationResult<ApiResponse<unknown>, Error, ProfileUpdatePayload> {
  const { handleErrorObject } = useAuthErrorHandler();
  
  return useMutation<ApiResponse<unknown>, Error, ProfileUpdatePayload>({
    mutationFn: async (values: ProfileUpdatePayload) => {
      const formData = new FormData();
      
      if (values.first_name) {
        formData.append("first_name", values.first_name);
      }
      if (values.last_name) {
        formData.append("last_name", values.last_name);
      }
      if (values.old_password) {
        formData.append("old_password", values.old_password);
      }
      if (values.new_password) {
        formData.append("new_password", values.new_password);
      }
      if (values.profile_image) {
        formData.append("profile_image", values.profile_image);
      }

      const res = await authAwareFetch("/api/user/update", {
        method: "PATCH",
        body: formData,
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
