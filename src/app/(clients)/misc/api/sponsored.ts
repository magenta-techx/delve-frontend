import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

import { apiRequest } from '@/utils/apiHandler';

const fetchSponsoredAds = async () => {
  const res = await apiRequest('/api/sponsored');
  if (!res.ok) throw new Error('Failed to fetch sponsored ads');
  return res.json() as Promise<sponsoredAdsResponse>;
};

async function patchSponsoredAdImage({
  advertisementId,
  image,
}: {
  advertisementId: number | string;
  image: File;
}) {
  const formData = new FormData();
  formData.append('advertisment_image', image);

  const res = await apiRequest(
    `/api/sponsored?advertisement_id=${encodeURIComponent(String(advertisementId))}`,
    {
      method: 'PATCH',
      body: formData,
    }
  );

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMessage =
      (json as { message?: string; error?: string })?.error ||
      (json as { message?: string; error?: string })?.message ||
      'Failed to update advert image';
    throw new Error(errorMessage);
  }

  return json;
}

export function useSponsoredAds() {
  return useQuery({
    queryKey: ['sponsored-ads'],
    queryFn: fetchSponsoredAds,
  })
}

export function useUpdateSponsoredAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchSponsoredAdImage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sponsored-ads'] });
      void queryClient.invalidateQueries({ queryKey: ['business-campaign-analytics'] });
    },
  });
}
