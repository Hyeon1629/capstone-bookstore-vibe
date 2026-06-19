import { useEffect, useMemo, useRef, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { MapPin } from '@/components/primitives';
import type { Bookstore } from '@/data/bookstores';

interface MapPinOverlayProps {
  map: kakao.maps.Map;
  bookstore: Bookstore;
  visible: boolean;
  dimmed: boolean;
  focused: boolean;
  visited: boolean;
  onTap: (id: string) => void;
}

export function MapPinOverlay({
  map,
  bookstore,
  visible,
  dimmed,
  focused,
  visited,
  onTap,
}: MapPinOverlayProps) {
  const container = useMemo(() => {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.cursor = 'pointer';
    return div;
  }, []);
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  useEffect(() => {
    const overlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(bookstore.lat, bookstore.lng),
      content: container,
      yAnchor: 1.0,
      xAnchor: 0.5,
      zIndex: focused ? 10 : 2,
    });
    overlay.setMap(map);
    overlayRef.current = overlay;
    return () => {
      overlay.setMap(null);
      overlayRef.current = null;
    };
  }, [map, bookstore.lat, bookstore.lng, container, focused]);

  useEffect(() => {
    container.style.display = visible ? 'block' : 'none';
    container.style.opacity = dimmed ? '0.3' : '1';
    container.style.transition = 'opacity .2s';
    container.style.zIndex = focused ? '10' : '2';
  }, [container, visible, dimmed, focused]);

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    onTap(bookstore.id);
  };

  return createPortal(
    <button
      type="button"
      aria-label={`${bookstore.name} 핀`}
      onClick={onClick}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <MapPin
        type={bookstore.category}
        visited={visited}
        size={focused ? 32 : 28}
        focused={focused}
      />
    </button>,
    container,
  );
}
