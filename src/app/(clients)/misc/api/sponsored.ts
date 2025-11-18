import { useQuery } from "@tanstack/react-query";

interface sponsoredAdsResponse {
  status: boolean;
  message: string;
  data: SponsoredAds[];
}

export interface SponsoredAds {
  id: number;
  image: string;
  business_id: number;
  days_left: number;
}

const fetchSponsoredAds = async () => {
  const res = await fetch('/api/sponsored');
  if (!res.ok) throw new Error('Failed to fetch sponsored ads');
  return res.json() as Promise<sponsoredAdsResponse>;
};

export function useSponsoredAds() {
  return useQuery({
    queryKey: ['sponsored-ads'],
    queryFn: fetchSponsoredAds,
  })
}
