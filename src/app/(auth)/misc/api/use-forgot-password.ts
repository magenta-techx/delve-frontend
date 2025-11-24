"use client";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";

type ForgotPasswordInput = { email: string };

export function useForgotPassword(): UseMutationResult<
  { ok: true; message?: string },
  Error,
  ForgotPasswordInput
> {
  return useMutation({
    mutationFn: async (values: ForgotPasswordInput) => {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = ((): string => {
          if (typeof data === "object" && data !== null && "error" in data) {
            const err = (data as { error?: unknown }).error;
            return typeof err === "string" ? err : "Forgot password failed";
          }
          return "Forgot password failed";
        })();
        throw new Error(message);
      }
      const message = ((): string | undefined => {
        if (typeof data === "object" && data !== null && "message" in data) {
          const msg = (data as { message?: unknown }).message;
          return typeof msg === "string" ? msg : undefined;
        }
        return undefined;
      })();
      return message ? { ok: true, message } : ({ ok: true } as { ok: true });
    },
  });
}
