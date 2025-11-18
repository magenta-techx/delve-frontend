import { useQuery } from '@tanstack/react-query';

export function useBusinessPerformance({ business_id, filter = 'last_12_months', metric = 'conversations' }: { business_id?: string; filter?: string; metric?: string } = {}) {
  return useQuery({
    queryKey: ['business_performance', business_id, filter, metric],
    queryFn: async () => {
      if (!business_id) throw new Error('Missing business_id');
      const res = await fetch(`/api/business/${business_id}/performance?filter=${filter}&metric=${metric}`);
      if (!res.ok) throw new Error('Failed to fetch performance data');
      return res.json();
    },
    enabled: !!business_id,
  });
}
