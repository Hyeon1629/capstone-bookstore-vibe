import { useCallback, useEffect, useRef, useState } from 'react';
import type { Bookstore } from '@/data/bookstores';
import { haversineMeters } from '@/lib/geo';
import { hasVisitedToday } from '@/lib/firestore';
import { useMapStore } from '@/stores/mapStore';
import { useRemoteBookstoresStore } from '@/stores/remoteBookstoresStore';

interface PendingVisit {
  bookstore: Bookstore;
}

interface UseVisitAutoDetectResult {
  pendingVisit: PendingVisit | null;
  duplicateNotice: string | null;
  notifyDuplicate: (message: string) => void;
  dismissDuplicate: () => void;
  dismissPending: () => void;
}

const PROXIMITY_M = 50;
const LINGER_MS = 5_000;

/**
 * 주변 카카오 책방 50m 이내 + 체류 시 방문 인증 대상으로 잡는다.
 * (시드·시연 long-press 제거됨 — 실제 GPS 위치 기준)
 */
export function useVisitAutoDetect(userId: string | null): UseVisitAutoDetectResult {
  const userLocation = useMapStore((s) => s.userLocation);
  const nearby = useRemoteBookstoresStore((s) => s.list);

  const [pendingVisit, setPendingVisit] = useState<PendingVisit | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);

  // 책방별 첫 50m 이내 진입 시각 기록
  const enterTimesRef = useRef<Map<string, number>>(new Map());
  const triggeredRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userId || !userLocation) return;

    let cancelled = false;
    const now = Date.now();

    for (const b of nearby) {
      const dist = haversineMeters(userLocation, { lat: b.lat, lng: b.lng });
      if (dist <= PROXIMITY_M) {
        if (!enterTimesRef.current.has(b.id)) {
          enterTimesRef.current.set(b.id, now);
        }
        const enteredAt = enterTimesRef.current.get(b.id)!;
        if (now - enteredAt >= LINGER_MS && !triggeredRef.current.has(b.id)) {
          triggeredRef.current.add(b.id);
          hasVisitedToday({ userId, bookstoreId: b.id })
            .then((visitedToday) => {
              if (cancelled) return;
              if (visitedToday) {
                setDuplicateNotice('오늘 이미 방문 인증한 책방이에요');
                return;
              }
              setPendingVisit({ bookstore: b });
            })
            .catch(() => undefined);
        }
      } else {
        enterTimesRef.current.delete(b.id);
        triggeredRef.current.delete(b.id);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [userId, userLocation, nearby]);

  const notifyDuplicate = useCallback((message: string) => setDuplicateNotice(message), []);
  const dismissDuplicate = useCallback(() => setDuplicateNotice(null), []);
  const dismissPending = useCallback(() => setPendingVisit(null), []);

  return {
    pendingVisit,
    duplicateNotice,
    notifyDuplicate,
    dismissDuplicate,
    dismissPending,
  };
}
