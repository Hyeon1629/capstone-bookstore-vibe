import { useQuery } from '@tanstack/react-query';
import type { MoodEmoji } from '@/data/bookstores';
import { fetchAllUserMoodTags, type MoodTagDoc } from '@/lib/firestore';

export function useAllUserMoodTags(userId: string | null) {
  return useQuery<MoodTagDoc[]>({
    queryKey: ['userMoodTags', userId],
    queryFn: () => (userId ? fetchAllUserMoodTags(userId) : Promise.resolve([])),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

/** bookstoreId → 가장 최근 mood emoji 매핑 */
export function indexLatestMoodByBookstore(
  docs: MoodTagDoc[] | undefined,
): Map<string, MoodEmoji> {
  const map = new Map<string, MoodEmoji>();
  if (!docs) return map;
  for (const d of docs) {
    if (!map.has(d.bookstoreId)) {
      map.set(d.bookstoreId, d.emoji);
    }
  }
  return map;
}
