import { ApiEnvelope } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export function useBusinessPerformance({ business_id, filter = 'last_12_months', metric = 'conversations' }: { business_id?: string; filter?: string; metric?: string } = {}) {
  return useQuery({
    queryKey: ['business_performance', business_id, filter, metric],
    queryFn: async () => {
      if (!business_id) throw new Error('Missing business_id');
      const res = await fetch(`/api/business/${business_id}/performance?filter=${filter}&metric=${metric}`);
      if (!res.ok) throw new Error('Failed to fetch performance data');
      return (await res.json()) as ApiEnvelope<Data>;
    },
    enabled: !!business_id,
  });
}


interface Data {
  totals: Totals;
  currents: Currents;
  graph: Graph[];
}

interface Graph {
  date: string;
  label: string;
  value: number;
}

interface Currents {
  conversations: number;
  reviews: number;
  profile_visits: number;
  saved_by_users: number;
}

interface Totals {
  total_conversations: number;
  total_reviews: number;
  total_profile_visits: number;
  total_business_saves: number;
}