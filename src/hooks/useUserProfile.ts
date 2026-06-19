import { useQuery } from '@tanstack/react-query';
import { getUserProfile, type UserProfile } from '@/lib/firestore';

/** Firestore users/{uid} 프로필 (닉네임 등). 캐시 키 ['userProfile', uid]. */
export function useUserProfile(userId: string | null) {
  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId],
    queryFn: () => (userId ? getUserProfile(userId) : Promise.resolve(null)),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
