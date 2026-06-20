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
 * (실제 GPS 위치 기준)
 */
export function useVisitAutoDetect(userId: string | null): UseVisitAutoDetectResult {
  const userLocation = useMapStore((s) => s.userLocation);
  const nearby = useRemoteBookstoresStore((s) => s.list);

  const [pendingVisit, setPendingVisit] = useState<PendingVisit | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);
  // 체류 시간 재평가를 위한 강제 리렌더 신호 (GPS 좌표가 안 바뀌어도 타이머로 깨운다)
  const [tick, setTick] = useState(0);

  // 책방별 첫 50m 이내 진입 시각 기록
  const enterTimesRef = useRef<Map<string, number>>(new Map());
  const triggeredRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userId || !userLocation) return;

    let cancelled = false;
    const now = Date.now();
    // 50m 이내지만 아직 체류 미달이라 나중에 재평가가 필요한 책방이 있는지
    let needsRecheck = false;

    for (const b of nearby) {
      const dist = haversineMeters(userLocation, { lat: b.lat, lng: b.lng });
      if (dist <= PROXIMITY_M) {
        if (!enterTimesRef.current.has(b.id)) {
          enterTimesRef.current.set(b.id, now);
        }
        const enteredAt = enterTimesRef.current.get(b.id)!;
        if (triggeredRef.current.has(b.id)) continue;
        if (now - enteredAt >= LINGER_MS) {
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
            .catch(() => {
              // 일시적 네트워크/Firestore 오류 — 트리거를 해제해 다음 틱에 재시도되도록 한다.
              triggeredRef.current.delete(b.id);
            });
        } else {
          // 아직 체류 미달 — GPS가 멈춰 있어도 LINGER 후 깨어나 재평가하도록 타이머 예약
          needsRecheck = true;
        }
      } else {
        enterTimesRef.current.delete(b.id);
        triggeredRef.current.delete(b.id);
      }
    }

    let timer: number | undefined;
    if (needsRecheck) {
      timer = window.setTimeout(() => {
        if (!cancelled) setTick((t) => t + 1);
      }, LINGER_MS);
    }

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [userId, userLocation, nearby, tick]);

  const notifyDuplicate = useCallback((message: string) => setDuplicateNotice(message), []);
  const dismissDuplicate = useCallback(() => setDuplicateNotice(null), []);
  const dismissPending = useCallback(() => {
    setPendingVisit((prev) => {
      if (prev) {
        // 모달을 닫으면(취소 포함) 트리거·진입시각을 해제해, 같은 자리에 다시
        // 체류하면 재인증할 수 있게 한다. (해제 안 하면 50m 밖으로 나가기 전까지 재인증 불가)
        triggeredRef.current.delete(prev.bookstore.id);
        enterTimesRef.current.delete(prev.bookstore.id);
      }
      return null;
    });
  }, []);

  return {
    pendingVisit,
    duplicateNotice,
    notifyDuplicate,
    dismissDuplicate,
    dismissPending,
  };
}
