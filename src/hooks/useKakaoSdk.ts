import { useEffect, useState } from 'react';

let sdkLoadPromise: Promise<void> | null = null;

function findScript(): HTMLScriptElement | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector<HTMLScriptElement>(
    'script[src*="dapi.kakao.com/v2/maps/sdk.js"]',
  );
}

function ensureSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('window unavailable'));
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = findScript();
    if (!script) {
      reject(new Error('카카오 SDK script 태그가 없습니다'));
      return;
    }

    const tryLoad = (): boolean => {
      if (window.kakao?.maps?.load && typeof window.kakao.maps.load === 'function') {
        window.kakao.maps.load(() => {
          if (window.kakao.maps.services) {
            resolve();
          } else {
            reject(new Error('services 라이브러리가 로드되지 않았어요'));
          }
        });
        return true;
      }
      return false;
    };

    if (tryLoad()) return;

    const start = Date.now();
    const tick = () => {
      if (tryLoad()) return;
      if (Date.now() - start > 10_000) {
        reject(new Error('카카오 SDK 로드 실패 (10초 초과)'));
        return;
      }
      window.setTimeout(tick, 80);
    };
    tick();
  });
  return sdkLoadPromise;
}

export function useKakaoSdk(): { isReady: boolean; error: string | null } {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    ensureSdk()
      .then(() => {
        if (!cancelled) setIsReady(true);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          sdkLoadPromise = null;
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { isReady, error };
}
