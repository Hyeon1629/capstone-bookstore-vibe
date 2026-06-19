import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { isNative } from '@/lib/platform';

interface UseGeolocationResult {
  position: { lat: number; lng: number } | null;
  error: string | null;
  isWatching: boolean;
}

const THROTTLE_MS = 30_000;

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const lastEmitRef = useRef<number>(0);

  // 네이티브 (Capacitor) 경로
  useEffect(() => {
    if (!isNative()) return;
    let watchId: string | null = null;
    let cancelled = false;

    (async () => {
      try {
        const perm = await Geolocation.requestPermissions({ permissions: ['location'] });
        if (perm.location !== 'granted') {
          setError('위치 권한이 필요해요');
          return;
        }
        setIsWatching(true);
        watchId = await Geolocation.watchPosition({ enableHighAccuracy: false }, (pos, err) => {
          if (cancelled) return;
          if (err) {
            setError(err.message ?? String(err));
            return;
          }
          if (!pos) return;
          const now = Date.now();
          if (now - lastEmitRef.current < THROTTLE_MS) return;
          lastEmitRef.current = now;
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
      if (watchId) {
        Geolocation.clearWatch({ id: watchId }).catch(() => undefined);
      }
      setIsWatching(false);
    };
  }, []);

  // 웹 경로 — Chrome 정책 준수: 권한이 이미 'granted' 일 때만 자동 watchPosition.
  // 'prompt' 상태면 사용자 제스처(LocationPrompt 버튼)를 기다린다.
  useEffect(() => {
    if (isNative()) return;
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setError('Geolocation API 미지원');
      return;
    }

    let watchId: number | null = null;
    let permissionStatus: PermissionStatus | null = null;
    let cancelled = false;

    const startWatch = () => {
      if (cancelled || watchId !== null) return;
      setIsWatching(true);
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const now = Date.now();
          if (now - lastEmitRef.current < THROTTLE_MS) return;
          lastEmitRef.current = now;
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => setError(err.message),
        { enableHighAccuracy: false, maximumAge: 30_000, timeout: 15_000 },
      );
    };

    const stopWatch = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        setIsWatching(false);
      }
    };

    const onPermissionChange = () => {
      if (permissionStatus?.state === 'granted') {
        startWatch();
      } else {
        stopWatch();
      }
    };

    if (typeof navigator.permissions?.query === 'function') {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((status) => {
          if (cancelled) return;
          permissionStatus = status;
          if (status.state === 'granted') startWatch();
          status.addEventListener('change', onPermissionChange);
        })
        .catch(() => {
          if (!cancelled) startWatch();
        });
    } else {
      startWatch();
    }

    return () => {
      cancelled = true;
      stopWatch();
      if (permissionStatus) {
        permissionStatus.removeEventListener('change', onPermissionChange);
      }
    };
  }, []);

  return { position, error, isWatching };
}
