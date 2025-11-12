"use client";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";

type SignupInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export function useRegister(): UseMutationResult<
  { ok: boolean },
  Error,
  SignupInput
> {
  return useMutation({
    mutationFn: async (values: SignupInput) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        const message = ((): string => {
          if (typeof data === "object" && data !== null && "error" in data) {
            const err = (data as { error?: unknown }).error;
            return typeof err === "string" ? err : "Signup failed";
          }
          return "Signup failed";
        })();
        throw new Error(message);
      }
      return { ok: true };
    },
  });
}
