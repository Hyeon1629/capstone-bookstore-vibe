import type { Bookstore } from '@/data/bookstores';
import { classifyPlace } from '@/lib/placeCategory';

export interface RemoteBookstore extends Bookstore {
  source: 'kakao';
  kakaoPlaceId: string;
  placeUrl: string;
}

const PLACEHOLDER_PHOTO = (name: string, idx: number) =>
  `https://placehold.co/600x400/3a2a1c/F2EAD9?text=${encodeURIComponent(name)}+%23${idx}`;

function toRemoteBookstore(place: kakao.maps.services.PlaceResult): RemoteBookstore | null {
  const category = classifyPlace(place);
  if (!category) return null;

  const lat = parseFloat(place.y);
  const lng = parseFloat(place.x);

  // 동 이름 추출 (주소에서 "OO동" 패턴)
  const dongMatch = place.address_name.match(/[가-힣]+동/);
  const dong = dongMatch ? dongMatch[0] : '';

  return {
    id: `kakao-${place.id}`,
    name: place.place_name,
    category,
    address: place.road_address_name || place.address_name,
    dong,
    lat,
    lng,
    phone: place.phone || undefined,
    specialtyTags: place.category_name
      ? place.category_name
          .split('>')
          .slice(-2)
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    photos: [PLACEHOLDER_PHOTO(place.place_name, 1), PLACEHOLDER_PHOTO(place.place_name, 2)],
    source: 'kakao',
    kakaoPlaceId: place.id,
    placeUrl: place.place_url,
  };
}

function normalizeResults(places: kakao.maps.services.PlaceResult[]): RemoteBookstore[] {
  const out: RemoteBookstore[] = [];
  for (const p of places) {
    const r = toRemoteBookstore(p);
    if (r) out.push(r);
  }
  return out;
}

interface SearchOptions {
  map: kakao.maps.Map;
  signal?: AbortSignal;
}

interface SearchPass {
  keyword: string;
  categoryCode?: string;
}

const PASSES: SearchPass[] = [
  { keyword: '서점', categoryCode: 'BK9' },
  { keyword: '도서관' },
  { keyword: '북카페' },
];

function runOnePass(pass: SearchPass, map: kakao.maps.Map): Promise<RemoteBookstore[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.kakao?.maps?.services) {
      resolve([]);
      return;
    }
    const places = new window.kakao.maps.services.Places(map);
    const collected: kakao.maps.services.PlaceResult[] = [];

    const cb: Parameters<kakao.maps.services.Places['categorySearch']>[1] = (
      result,
      status,
      pagination,
    ) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        resolve(normalizeResults(collected));
        return;
      }
      collected.push(...result);
      // 최대 2페이지만 (~30개) 가져옴 — 시연용 충분
      if (pagination.hasNextPage && pagination.current < 2) {
        pagination.nextPage();
      } else {
        resolve(normalizeResults(collected));
      }
    };

    if (pass.categoryCode) {
      places.categorySearch(pass.categoryCode, cb, { useMapBounds: true });
    } else {
      places.keywordSearch(pass.keyword, cb, { useMapBounds: true });
    }
  });
}

/**
 * 현재 지도 영역의 모든 책방·도서관·북카페를 카카오 API 로 조회.
 * 3개 패스(BK9 / 도서관 / 북카페)를 병렬 실행하고 결과를 dedupe.
 * 책방·도서관·북카페가 아닌 결과(음식점·은행·숙박 등)는 자동 필터링됨.
 */
export async function searchPlacesInMap({ map, signal }: SearchOptions): Promise<RemoteBookstore[]> {
  if (signal?.aborted) return [];
  const passResults = await Promise.all(PASSES.map((p) => runOnePass(p, map)));
  if (signal?.aborted) return [];

  return dedupeByPlaceId(passResults.flat());
}

function dedupeByPlaceId(items: RemoteBookstore[]): RemoteBookstore[] {
  const seen = new Set<string>();
  const unique: RemoteBookstore[] = [];
  for (const r of items) {
    if (seen.has(r.kakaoPlaceId)) continue;
    seen.add(r.kakaoPlaceId);
    unique.push(r);
  }
  return unique;
}

function runOnePassNear(
  pass: SearchPass,
  location: kakao.maps.LatLng,
  radius: number,
): Promise<RemoteBookstore[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.kakao?.maps?.services) {
      resolve([]);
      return;
    }
    const places = new window.kakao.maps.services.Places();
    const collected: kakao.maps.services.PlaceResult[] = [];

    const cb: Parameters<kakao.maps.services.Places['categorySearch']>[1] = (
      result,
      status,
      pagination,
    ) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        resolve(normalizeResults(collected));
        return;
      }
      collected.push(...result);
      if (pagination.hasNextPage && pagination.current < 2) {
        pagination.nextPage();
      } else {
        resolve(normalizeResults(collected));
      }
    };

    const opts = { location, radius, useMapBounds: false };
    if (pass.categoryCode) {
      places.categorySearch(pass.categoryCode, cb, opts);
    } else {
      places.keywordSearch(pass.keyword, cb, opts);
    }
  });
}

/**
 * 지도 없이 좌표(location) + 반경(radius) 기준으로 주변 책방을 조회.
 * 홈 리스트(거리순)용 — 카카오가 location 기준 거리순으로 반환한다.
 */
export async function searchPlacesNear({
  lat,
  lng,
  radiusM = 5000,
  signal,
}: {
  lat: number;
  lng: number;
  radiusM?: number;
  signal?: AbortSignal;
}): Promise<RemoteBookstore[]> {
  if (signal?.aborted) return [];
  if (typeof window === 'undefined' || !window.kakao?.maps?.services) return [];
  const location = new window.kakao.maps.LatLng(lat, lng);
  const passResults = await Promise.all(PASSES.map((p) => runOnePassNear(p, location, radiusM)));
  if (signal?.aborted) return [];
  return dedupeByPlaceId(passResults.flat());
}
