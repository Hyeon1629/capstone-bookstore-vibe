import { useEffect, useRef, useState } from 'react';
import { searchPlacesInMap } from '@/lib/kakaoPlaces';
import { useRemoteBookstoresStore } from '@/stores/remoteBookstoresStore';

const DEBOUNCE_MS = 500;

interface UseRemoteBookstoresResult {
  isSearching: boolean;
  error: string | null;
}

export function useRemoteBookstores(map: kakao.maps.Map | null): UseRemoteBookstoresResult {
  const upsertResults = useRemoteBookstoresStore((s) => s.upsertResults);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!map) return;
    if (typeof window === 'undefined' || !window.kakao?.maps?.event) return;

    const trigger = () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
      timerRef.current = window.setTimeout(async () => {
        const controller = new AbortController();
        abortRef.current = controller;
        setIsSearching(true);
        setError(null);
        try {
          const results = await searchPlacesInMap({ map, signal: controller.signal });
          if (controller.signal.aborted) return;
          upsertResults(results);
        } catch (e) {
          if (!controller.signal.aborted) {
            setError(e instanceof Error ? e.message : String(e));
          }
        } finally {
          if (!controller.signal.aborted) setIsSearching(false);
        }
      }, DEBOUNCE_MS);
    };

    // 초기 1회 + idle 이벤트 구독
    trigger();
    const handler: (...args: unknown[]) => void = () => trigger();
    window.kakao.maps.event.addListener(map, 'idle', handler);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
      window.kakao.maps.event.removeListener(map, 'idle', handler);
    };
  }, [map, upsertResults]);

  return { isSearching, error };
}
