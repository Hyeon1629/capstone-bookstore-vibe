import { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Bookstore } from '@/data/bookstores';
import type { LatLng } from '@/lib/geo';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useRemoteBookstores } from '@/hooks/useRemoteBookstores';
import { haversineMeters } from '@/lib/geo';
import { useMapStore } from '@/stores/mapStore';
import { useRemoteBookstoresStore } from '@/stores/remoteBookstoresStore';
import { MapPinOverlay } from './MapPinOverlay';
import { PinPreviewSheet } from './PinPreviewSheet';
import { CurrentLocationFAB } from './CurrentLocationFAB';
import { UserLocationMarker } from './UserLocationMarker';

const RADIUS_METERS = 2_000;

function normalize(s: string): string {
  return s.replace(/\s+/g, '').toLowerCase();
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

interface MapHomeMapProps {
  userLocation: LatLng;
  visitedIds: Set<string>;
}

export function MapHomeMap({ userLocation, visitedIds }: MapHomeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filterCategory = useMapStore((s) => s.filterCategory);
  const searchQuery = useMapStore((s) => s.searchQuery);
  const focusedPinId = useMapStore((s) => s.focusedPinId);
  const setFocusedPinId = useMapStore((s) => s.setFocusedPinId);

  const { map, isReady, error } = useKakaoMap(containerRef, { center: userLocation, level: 5 });

  const remoteList = useRemoteBookstoresStore((s) => s.list);
  const { isSearching: remoteSearching, error: remoteError } = useRemoteBookstores(map);

  const allBookstores = useMemo<Bookstore[]>(() => [...remoteList], [remoteList]);

  const normalizedQuery = useMemo(() => normalize(searchQuery), [searchQuery]);

  const focused = focusedPinId ? allBookstores.find((b) => b.id === focusedPinId) : null;

  // 미리보기 시트의 거리 계산
  const focusedDistance = useMemo(() => {
    if (!focused) return null;
    return formatDistance(haversineMeters(userLocation, { lat: focused.lat, lng: focused.lng }));
  }, [focused, userLocation]);

  // 거리 필터 기준점 — 사용자(또는 시연) 위치
  const filterOrigin = userLocation;

  // 거리 필터 우회: 검색 중이거나 '방문 완료' 필터 활성 시
  const bypassDistanceFilter = !!normalizedQuery || filterCategory === 'visited';

  // 핀의 visible/dimmed 결정
  const pinStates = useMemo(() => {
    const states = new Map<
      string,
      { visible: boolean; dimmed: boolean; visited: boolean; withinRadius: boolean }
    >();
    for (const b of allBookstores) {
      const visited = visitedIds.has(b.id);
      const distance = haversineMeters(filterOrigin, { lat: b.lat, lng: b.lng });
      const withinRadius = distance <= RADIUS_METERS;

      let visible = true;
      if (filterCategory === 'bookstore' && b.category !== 'bookstore') visible = false;
      if (filterCategory === 'library' && b.category !== 'library') visible = false;
      if (filterCategory === 'visited' && !visited) visible = false;

      // 거리 필터: 검색 / 방문 완료 필터가 아니면 반경 내만 표시
      if (!bypassDistanceFilter && !withinRadius) visible = false;

      let dimmed = false;
      if (normalizedQuery) {
        const match = normalize(b.name).includes(normalizedQuery);
        if (!match) dimmed = true;
      }
      states.set(b.id, { visible, dimmed, visited, withinRadius });
    }
    return states;
  }, [
    allBookstores,
    filterCategory,
    normalizedQuery,
    visitedIds,
    filterOrigin,
    bypassDistanceFilter,
  ]);

  const visibleCount = useMemo(() => {
    let n = 0;
    for (const s of pinStates.values()) if (s.visible) n++;
    return n;
  }, [pinStates]);

  const searchResultCount = useMemo(() => {
    if (!normalizedQuery) return null;
    return allBookstores.filter((b) => normalize(b.name).includes(normalizedQuery)).length;
  }, [allBookstores, normalizedQuery]);

  // 검색 시 첫 매칭으로 자동 setCenter
  useEffect(() => {
    if (!map || !normalizedQuery) return;
    const match = allBookstores.find((b) => normalize(b.name).includes(normalizedQuery));
    if (match) {
      map.setCenter(new window.kakao.maps.LatLng(match.lat, match.lng));
    }
  }, [map, normalizedQuery, allBookstores]);

  const onPinTap = (id: string) => {
    setFocusedPinId(id === focusedPinId ? null : id);
    if (map) {
      const target = allBookstores.find((b) => b.id === id);
      if (target) {
        map.setCenter(new window.kakao.maps.LatLng(target.lat, target.lng));
      }
    }
  };

  const onMyLocation = () => {
    if (!map) return;
    map.setCenter(new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng));
  };

  const onDetail = (b: Bookstore) => {
    navigate(`/bookstore/${b.id}`, { state: { bookstore: b } });
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 bg-paper-soft" />

      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-midnight/70 backdrop-blur-sm pointer-events-none">
          <div className="font-mono text-[11px] text-paper-mute tracking-[2px] uppercase">
            지도를 불러오는 중...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="bg-surface-01 border border-error/40 rounded-card p-5 max-w-xs">
            <div className="font-mono text-[10px] text-error tracking-[2px] uppercase mb-2">
              SDK ERROR
            </div>
            <div className="font-ui text-[13px] text-paper">{error}</div>
            <div className="font-ui text-[11.5px] text-paper-mute mt-2 leading-relaxed">
              카카오 개발자 콘솔에서 http://localhost:5173 도메인이 등록되어 있는지 확인해주세요.
            </div>
          </div>
        </div>
      )}

      {/* 사용자 위치 핀 (또는 fallback 시연 위치) */}
      {map && (
        <UserLocationMarker map={map} lat={userLocation.lat} lng={userLocation.lng} />
      )}

      {/* 핀 — map ready 이후에만 마운트 */}
      {map &&
        allBookstores.map((b) => {
          const state = pinStates.get(b.id)!;
          return (
            <MapPinOverlay
              key={b.id}
              map={map}
              bookstore={b}
              visible={state.visible}
              dimmed={state.dimmed}
              focused={focusedPinId === b.id}
              visited={state.visited}
              onTap={onPinTap}
            />
          );
        })}

      {/* 검색 결과 0건 */}
      {searchResultCount === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-01/90 backdrop-blur border border-hairline rounded-card px-4 py-3 max-w-[260px] text-center">
          <div className="font-ui text-[12.5px] text-paper">일치하는 책방이 없어요</div>
        </div>
      )}

      {/* 거리 필터 안내 (검색 X + 반경 내 핀 0개일 때) */}
      {!normalizedQuery && filterCategory !== 'visited' && visibleCount === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-01/90 backdrop-blur border border-hairline rounded-card px-4 py-3 max-w-[280px] text-center">
          <div className="font-ui text-[12.5px] text-paper mb-1">반경 2km 안에 책방이 없어요</div>
          <div className="font-ui text-[11px] text-paper-mute leading-relaxed">
            검색바에서 다른 책방을 찾아보세요
          </div>
        </div>
      )}

      {/* 카카오 데이터 로딩·합계 인디케이터 */}
      {(remoteSearching || remoteList.length > 0 || remoteError) && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[14] px-2.5 py-1 rounded-full border border-hairline bg-bg-midnight/80 backdrop-blur font-mono text-[10px] tracking-[1px] uppercase flex items-center gap-1.5">
          {remoteSearching ? (
            <>
              <span className="w-[6px] h-[6px] rounded-full bg-lamp animate-pulse" aria-hidden />
              <span className="text-paper-dim">실시간 검색 중...</span>
            </>
          ) : remoteError ? (
            <>
              <span className="w-[6px] h-[6px] rounded-full bg-error" aria-hidden />
              <span className="text-paper-dim">카카오 검색 실패</span>
            </>
          ) : (
            <>
              <span className="w-[6px] h-[6px] rounded-full bg-ok" aria-hidden />
              <span className="text-paper-dim">실시간 {remoteList.length}곳 추가</span>
            </>
          )}
        </div>
      )}

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(13,17,22,0.45) 100%)',
        }}
      />

      <CurrentLocationFAB sheetOpen={!!focused} onClick={onMyLocation} />

      <AnimatePresence>
        {focused && (
          <PinPreviewSheet
            key={focused.id}
            bookstore={focused}
            distanceLabel={focusedDistance}
            visited={visitedIds.has(focused.id)}
            onClose={() => setFocusedPinId(null)}
            onDetail={() => onDetail(focused)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
