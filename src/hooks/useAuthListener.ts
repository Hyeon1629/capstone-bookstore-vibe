import { useEffect } from 'react';
import { ensurePersistence, watchAuthState } from '@/lib/auth';
import { useAuthStore } from '@/stores/authStore';

export function useAuthListener(): void {
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    void (async () => {
      await ensurePersistence();
      if (cancelled) return;
      unsubscribe = watchAuthState((user) => {
        setCurrentUser(user);
        setAuthLoading(false);
      });
    })();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [setCurrentUser, setAuthLoading]);
}
