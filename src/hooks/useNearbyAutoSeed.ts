import { useEffect, useRef } from 'react';
import type { LatLng } from '@/lib/geo';
import { searchPlacesNear } from '@/lib/kakaoPlaces';
import { useKakaoSdk } from '@/hooks/useKakaoSdk';
import { useRemoteBookstoresStore } from '@/stores/remoteBookstoresStore';

const SEED_RADIUS_M = 500;

/**
 * GPS 자동 방문 인증 후보(remoteBookstoresStore.list)가 지도 bounds에만 의존하지
 * 않도록, 내 위치 주변 책방을 카카오 location 검색으로 직접 조회해 스토어에 채운다.
 * 지도를 다른 곳으로 패닝해도 내 위치 50m 책방이 후보에서 빠지지 않게 보장한다.
 */
export function useNearbyAutoSeed(origin: LatLng | null): void {
  const { isReady } = useKakaoSdk();
  const upsert = useRemoteBookstoresStore((s) => s.upsertResults);
  const lastKeyRef = useRef<string>('');

  const lat = origin?.lat ?? null;
  const lng = origin?.lng ?? null;

  useEffect(() => {
    if (!isReady || lat === null || lng === null) return;
    // GPS 미세 변동(약 100m 이내)으로 재조회하지 않도록 키 라운딩
    const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    const controller = new AbortController();
    searchPlacesNear({ lat, lng, radiusM: SEED_RADIUS_M, signal: controller.signal })
      .then((res) => {
        if (!controller.signal.aborted && res.length) upsert(res);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [isReady, lat, lng, upsert]);
}
