"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { authAwareFetch } from "@/utils/authAwareFetch";

interface ProfileData {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_image?: string | null;
  [key: string]: unknown;
}

export function useGetProfile(email: string | null | undefined): UseQueryResult<ProfileData, Error> {
  return useQuery<ProfileData, Error>({
    enabled: Boolean(email),
    queryKey: ["user", "profile", email],
    queryFn: async () => {
      const res = await authAwareFetch(`/api/user/getUser?email=${encodeURIComponent(email || "")}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch profile");
      }
      return data?.data ?? data; 
    },
  });
}
