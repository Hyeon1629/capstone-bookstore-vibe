import { useEffect, useMemo, useRef, useState } from 'react';
import type { Bookstore } from '@/data/bookstores';
import { haversineMeters, type LatLng } from '@/lib/geo';
import { searchPlacesNear, type RemoteBookstore } from '@/lib/kakaoPlaces';
import { useKakaoSdk } from '@/hooks/useKakaoSdk';

export interface NearbyEntry {
  bookstore: Bookstore;
  distanceM: number;
}

const RADIUS_M = 5000;

/**
 * 내 위치(origin) 기준 주변 책방을 거리순으로 반환한다 (지도 불필요).
 * 카카오 location 검색 결과를 반경 내 거리순으로 정렬.
 */
export function useNearbyBookstores(origin: LatLng | null) {
  const { isReady } = useKakaoSdk();
  const [remote, setRemote] = useState<RemoteBookstore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastKeyRef = useRef<string>('');

  const lat = origin?.lat ?? null;
  const lng = origin?.lng ?? null;

  useEffect(() => {
    if (!isReady || lat === null || lng === null) return;
    // GPS 미세 변동(약 100m 이내)으로 재검색하지 않도록 키 라운딩
    const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);

    searchPlacesNear({ lat, lng, radiusM: RADIUS_M, signal: controller.signal })
      .then((res) => {
        if (!controller.signal.aborted) setRemote(res);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [isReady, lat, lng]);

  const list = useMemo<NearbyEntry[]>(() => {
    if (lat === null || lng === null) return [];
    const origin0 = { lat, lng };
    return remote
      .map((b) => ({ bookstore: b, distanceM: haversineMeters(origin0, { lat: b.lat, lng: b.lng }) }))
      .filter((e) => e.distanceM <= RADIUS_M)
      .sort((a, b) => a.distanceM - b.distanceM);
  }, [lat, lng, remote]);

  return { list, isLoading, error, isReady };
}
