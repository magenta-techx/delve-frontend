"use client";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export function useLogin(): UseMutationResult<
  { ok: true },
  Error,
  { email: string; password: string }
> {
  return useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const res = await signIn("credentials", { redirect: false, ...values });
      if (!res || res.error) {
        throw new Error(res?.error || "Login failed");
      }
      return { ok: true } as const;
    },
  });
}
