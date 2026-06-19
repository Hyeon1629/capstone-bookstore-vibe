import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '@/components/primitives';
import { BottomNav } from '@/components/shared/BottomNav';
import { LocationPrompt } from '@/components/shared/LocationPrompt';
import { SearchBar } from '@/components/map/SearchBar';
import { CategoryChips } from '@/components/map/CategoryChips';
import { MapHomeMap } from '@/components/map/MapHomeMap';
import { MoodInputModal } from '@/components/visit/MoodInputModal';
import { PaperFadeOverlay } from '@/components/visit/PaperFadeOverlay';
import { RadarPulse } from '@/components/visit/RadarPulse';
import type { MoodEmoji } from '@/data/bookstores';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useVisitAutoDetect } from '@/hooks/useVisitAutoDetect';
import { useUserVisits } from '@/hooks/useUserVisits';
import { haversineMeters } from '@/lib/geo';
import { DuplicateVisitError, recordVisit } from '@/lib/firestore';
import { useAuthStore } from '@/stores/authStore';
import { useMapStore } from '@/stores/mapStore';
import { useRemoteBookstoresStore } from '@/stores/remoteBookstoresStore';

const RADIUS_METERS = 2_000;

type Step = 'idle' | 'radar' | 'fade' | 'mood';

export function MapPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.currentUser);
  const setUserLocation = useMapStore((s) => s.setUserLocation);

  const { position } = useGeolocation();

  // mapStore.userLocation 동기화 (상세 페이지 거리 계산 등에서 사용)
  useEffect(() => {
    if (position) setUserLocation(position);
  }, [position, setUserLocation]);

  const userId = currentUser?.uid ?? null;
  const { data: visitDocs } = useUserVisits(userId);
  const visitedIds = useMemo(
    () => new Set((visitDocs ?? []).map((v) => v.bookstoreId)),
    [visitDocs],
  );
  const visitCount = visitDocs?.length ?? 0;

  const remoteList = useRemoteBookstoresStore((s) => s.list);

  const nearbyCount = useMemo(() => {
    if (!position) return 0;
    let n = 0;
    for (const b of remoteList) {
      if (haversineMeters(position, { lat: b.lat, lng: b.lng }) <= RADIUS_METERS) n++;
    }
    return n;
  }, [position, remoteList]);

  const { pendingVisit, duplicateNotice, notifyDuplicate, dismissDuplicate, dismissPending } =
    useVisitAutoDetect(userId);

  const [step, setStep] = useState<Step>('idle');
  const [submitting, setSubmitting] = useState(false);

  // pendingVisit 변화 → 인증 시퀀스 진행
  useEffect(() => {
    if (!pendingVisit) {
      setStep('idle');
      return;
    }
    setStep('radar');
    const t1 = window.setTimeout(() => setStep('fade'), 1800);
    const t2 = window.setTimeout(() => setStep('mood'), 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pendingVisit]);

  const onSubmitMood = async (emoji: MoodEmoji | null) => {
    if (!pendingVisit || !userId) return;
    setSubmitting(true);
    try {
      await recordVisit({ userId, bookstore: pendingVisit.bookstore, emoji });
      await queryClient.invalidateQueries({ queryKey: ['visits', userId] });
      await queryClient.invalidateQueries({ queryKey: ['moodTags', pendingVisit.bookstore.id] });
      dismissPending();
      navigate('/bookshelf');
    } catch (err) {
      if (err instanceof DuplicateVisitError) {
        dismissPending();
        setSubmitting(false);
        notifyDuplicate('오늘 이미 방문 인증한 책방이에요');
        return;
      }
      console.error(err);
      setSubmitting(false);
    }
  };

  const onCancelMood = () => {
    if (submitting) return;
    dismissPending();
  };

  // 중복 알림 자동 dismiss
  useEffect(() => {
    if (!duplicateNotice) return;
    const t = window.setTimeout(dismissDuplicate, 2_500);
    return () => window.clearTimeout(t);
  }, [duplicateNotice, dismissDuplicate]);

  // 위치가 없으면 위치 안내 화면
  if (!position) return <LocationPrompt />;

  return (
    <div className="relative min-h-screen bg-bg-midnight flex flex-col">
      <StatusBar />

      <div className="relative z-[15] px-5 pt-2 pb-3">
        <div className="mb-2.5">
          <div className="font-mono text-[11.5px] text-paper-mute font-medium tracking-[0.4px] uppercase mb-0.5">
            MY LOCATION · 내 위치 기준
          </div>
          <div className="font-display text-[19px] font-bold text-paper tracking-[-0.4px] leading-[1.25]">
            반경 2km 안에{' '}
            <span className="text-lamp whitespace-nowrap">책방 {nearbyCount}곳</span>
          </div>
        </div>
        <SearchBar />
      </div>

      <CategoryChips totalCount={nearbyCount} />

      <MapHomeMap userLocation={position} visitedIds={visitedIds} />

      {duplicateNotice && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[40] px-4 py-2 rounded-card bg-surface-02 border border-hairline-strong text-paper font-ui text-[12.5px] shadow-warm"
          style={{ top: 90 }}
          role="status"
        >
          {duplicateNotice}
        </div>
      )}

      <AnimatePresence>{step === 'radar' && <RadarPulse key="radar" />}</AnimatePresence>
      <AnimatePresence>{step === 'fade' && <PaperFadeOverlay key="fade" />}</AnimatePresence>
      <AnimatePresence>
        {step === 'mood' && pendingVisit && (
          <MoodInputModal
            key="mood"
            bookstore={pendingVisit.bookstore}
            visitNumber={visitCount + 1}
            submitting={submitting}
            onSubmit={onSubmitMood}
            onCancel={onCancelMood}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
