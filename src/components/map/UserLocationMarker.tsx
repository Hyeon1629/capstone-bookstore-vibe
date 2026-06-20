import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TOKENS } from '@/lib/tokens';

interface UserLocationMarkerProps {
  map: kakao.maps.Map;
  lat: number;
  lng: number;
  /** GPS 미허용 등으로 SEED_CENTER 를 fallback 으로 쓰는 경우 true */
  isFallback?: boolean;
}

export function UserLocationMarker({ map, lat, lng, isFallback = false }: UserLocationMarkerProps) {
  const container = useMemo(() => {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.pointerEvents = 'none';
    return div;
  }, []);
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  useEffect(() => {
    const overlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(lat, lng),
      content: container,
      yAnchor: 0.5,
      xAnchor: 0.5,
      zIndex: 5,
    });
    overlay.setMap(map);
    overlayRef.current = overlay;
    return () => {
      overlay.setMap(null);
      overlayRef.current = null;
    };
  }, [map, lat, lng, container]);

  const color = TOKENS.color.info;

  return createPortal(
    <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
      {/* 외곽 펄스 ring (fallback 일 땐 정적) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `${color}33`,
          animation: isFallback ? undefined : 'userLocationPulse 2.4s ease-out infinite',
        }}
      />
      {/* 내부 점 */}
      <div
        aria-label={isFallback ? '대략적 위치 (GPS 미사용)' : '내 위치'}
        style={{
          position: 'relative',
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: color,
          border: isFallback ? `3px dashed ${color}` : '3.5px solid #fff',
          boxShadow: `0 0 0 9px ${color}33, 0 0 24px ${color}aa`,
        }}
      />
      <style>{`
        @keyframes userLocationPulse {
          0% { transform: scale(0.5); opacity: 0.9; }
          80% { transform: scale(2); opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>,
    container,
  );
}
