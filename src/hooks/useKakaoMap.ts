import { useEffect, useRef, useState, type RefObject } from 'react';

interface Options {
  center: { lat: number; lng: number };
  level?: number;
}

let sdkLoadPromise: Promise<void> | null = null;

function findKakaoScript(): HTMLScriptElement | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector<HTMLScriptElement>(
    'script[src*="dapi.kakao.com/v2/maps/sdk.js"]',
  );
}

function ensureSdk(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window unavailable'));
  }
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = findKakaoScript();
    if (!script) {
      reject(
        new Error(
          'index.html 에 카카오 SDK <script> 태그가 없습니다. 빌드 캐시를 정리하고 다시 시도해주세요.',
        ),
      );
      return;
    }

    // 키 치환 확인
    if (script.src.includes('%VITE_KAKAO_JS_KEY%') || script.src.includes('appkey=&')) {
      reject(
        new Error(
          '카카오 JS 키가 치환되지 않았어요. .env.local 의 VITE_KAKAO_JS_KEY 를 확인하고 dev 서버를 재시작해주세요.',
        ),
      );
      return;
    }

    const tryLoad = () => {
      if (window.kakao && window.kakao.maps && typeof window.kakao.maps.load === 'function') {
        try {
          window.kakao.maps.load(() => {
            // load 콜백 안에서 LatLng/Map 등이 실제로 정의됨
            if (window.kakao.maps.LatLng && window.kakao.maps.Map) {
              resolve();
            } else {
              reject(
                new Error(
                  '카카오 SDK 가 응답했지만 Map/LatLng 가 초기화되지 않았어요. 카카오 개발자 콘솔의 도메인 등록을 확인해주세요.',
                ),
              );
            }
          });
        } catch (e) {
          reject(e instanceof Error ? e : new Error(String(e)));
        }
        return true;
      }
      return false;
    };

    // 이미 로드된 경우 즉시 시도
    if (tryLoad()) return;

    // 아직이면 script onload 또는 폴링 대기
    let cancelled = false;
    const onScriptLoad = () => {
      if (!cancelled) tryLoad();
    };
    const onScriptError = () => {
      if (cancelled) return;
      cancelled = true;
      reject(
        new Error(
          `카카오 SDK 스크립트 로드 실패. 네트워크 또는 도메인 등록 문제일 수 있어요. URL: ${script.src}`,
        ),
      );
    };
    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    const start = Date.now();
    const tick = () => {
      if (cancelled) return;
      if (tryLoad()) return;
      if (Date.now() - start > 10_000) {
        cancelled = true;
        const hasKakao = typeof window.kakao !== 'undefined';
        const hasMaps = hasKakao && typeof window.kakao.maps !== 'undefined';
        const hasLoad = hasMaps && typeof window.kakao.maps.load === 'function';
        reject(
          new Error(
            `카카오 SDK 로드 실패 (10초 초과) · kakao=${hasKakao} maps=${hasMaps} load=${hasLoad}. 카카오 개발자 콘솔 → 플랫폼 → Web 에 http://localhost:5173 도메인이 정확히 등록됐는지 확인하세요.`,
          ),
        );
        return;
      }
      window.setTimeout(tick, 80);
    };
    tick();
  });
  return sdkLoadPromise;
}

export function useKakaoMap(
  containerRef: RefObject<HTMLDivElement>,
  options: Options,
): { map: kakao.maps.Map | null; isReady: boolean; error: string | null } {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [, force] = useState(0);

  const initialOptionsRef = useRef(options);

  useEffect(() => {
    let cancelled = false;
    ensureSdk()
      .then(() => {
        if (cancelled) return;
        if (!containerRef.current) return;
        const opts = initialOptionsRef.current;
        const map = new window.kakao.maps.Map(containerRef.current, {
          center: new window.kakao.maps.LatLng(opts.center.lat, opts.center.lng),
          level: opts.level ?? 4,
        });
        mapRef.current = map;
        setIsReady(true);
        force((n) => n + 1);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message);
        // 다음 시도를 위해 캐시된 promise 초기화
        sdkLoadPromise = null;
      });
    return () => {
      cancelled = true;
    };
  }, [containerRef]);

  return { map: mapRef.current, isReady, error };
}
