import { useQuery } from '@tanstack/react-query';
import { fetchUserVisits, type VisitDoc } from '@/lib/firestore';

export function useUserVisits(userId: string | null) {
  return useQuery<VisitDoc[]>({
    queryKey: ['visits', userId],
    queryFn: () => (userId ? fetchUserVisits(userId) : Promise.resolve([])),
    enabled: !!userId,
    staleTime: 30_000,
  });
}
