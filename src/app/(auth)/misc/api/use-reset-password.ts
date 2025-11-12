"use client";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";

type ResetPasswordInput = { email: string; otp: string; password: string; confirm_password: string };

export function useResetPassword(): UseMutationResult<
  { ok: true },
  Error,
  ResetPasswordInput
> {
  return useMutation({
    mutationFn: async (values: ResetPasswordInput) => {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        const message = ((): string => {
          if (typeof data === "object" && data !== null && "error" in data) {
            const err = (data as { error?: unknown }).error;
            return typeof err === "string" ? err : "Reset password failed";
          }
          return "Reset password failed";
        })();
        throw new Error(message);
      }
      return { ok: true } as const;
    },
  });
}
