import { useQuery } from '@tanstack/react-query';

const CORS_PROXY = 'https://corsproxy.io/?';
const PLACE_PAGE = 'https://place.map.kakao.com/';

const OG_IMAGE_RE = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i;
const OG_IMAGE_RE_ALT = /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i;

function normalizeImageUrl(raw: string): string {
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('http://')) return raw.replace('http://', 'https://');
  return raw;
}

async function fetchImage(kakaoPlaceId: string): Promise<string | null> {
  const target = `${PLACE_PAGE}${encodeURIComponent(kakaoPlaceId)}`;
  const url = `${CORS_PROXY}${encodeURIComponent(target)}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'text/html' } });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(OG_IMAGE_RE) ?? html.match(OG_IMAGE_RE_ALT);
    if (!match) return null;
    const raw = match[1].trim();
    return raw ? normalizeImageUrl(raw) : null;
  } catch {
    return null;
  }
}

/** 카카오 책방 페이지의 og:image 만 가져온다. (영업시간은 공식 API 부재로 미지원) */
export function useKakaoPlaceImage(kakaoPlaceId: string | null) {
  return useQuery<string | null>({
    queryKey: ['kakaoPlaceImage', kakaoPlaceId],
    queryFn: () => (kakaoPlaceId ? fetchImage(kakaoPlaceId) : Promise.resolve(null)),
    enabled: !!kakaoPlaceId,
    staleTime: 60 * 60 * 1000,
    retry: 1,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
