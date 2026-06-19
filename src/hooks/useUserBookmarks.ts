import { useQuery } from '@tanstack/react-query';
import { fetchUserBookmarks } from '@/lib/firestore';

/** 사용자의 북마크한 책방 id 목록. 캐시 키 ['bookmarks', userId] — 낙관적 토글의 단일 진실원. */
export function useUserBookmarks(userId: string | null) {
  return useQuery<string[]>({
    queryKey: ['bookmarks', userId],
    queryFn: () => (userId ? fetchUserBookmarks(userId) : Promise.resolve([])),
    enabled: !!userId,
    staleTime: 30_000,
  });
}
