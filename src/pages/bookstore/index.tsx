import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ActionBar } from '@/components/bookstore/ActionBar';
import { BookstoreInfoCard } from '@/components/bookstore/BookstoreInfoCard';
import { MoodTagAggregation } from '@/components/bookstore/MoodTagAggregation';
import { PhotoSlider } from '@/components/bookstore/PhotoSlider';
import { SpecialtyTags } from '@/components/bookstore/SpecialtyTags';
import { StatusBar } from '@/components/primitives';
import type { Bookstore } from '@/data/bookstores';
import { useKakaoPlaceImage } from '@/hooks/useKakaoPlaceImage';
import { useUserVisits } from '@/hooks/useUserVisits';
import { useUserBookmarks } from '@/hooks/useUserBookmarks';
import { addBookmark, removeBookmark } from '@/lib/firestore';
import { haversineMeters } from '@/lib/geo';
import { useAuthStore } from '@/stores/authStore';
import { useMapStore } from '@/stores/mapStore';
import { useRemoteBookstoresStore } from '@/stores/remoteBookstoresStore';

function ChevronLeft({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function BookmarkIcon({ size = 17, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

export function BookstoreDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const remoteById = useRemoteBookstoresStore((s) => s.byId);
  // 네비게이션 state 로 전달된 책방을 우선 사용 (발자취 등 카카오 스토어에 없을 때 대비)
  const stateBookstore = (location.state as { bookstore?: Bookstore } | null)?.bookstore;
  const bookstore = stateBookstore ?? (id ? remoteById.get(id) : undefined);
  const userLocation = useMapStore((s) => s.userLocation);
  const userId = useAuthStore((s) => s.currentUser?.uid ?? null);

  const { data: visitDocs } = useUserVisits(userId);
  const { data: bookmarkIds } = useUserBookmarks(userId);

  const visited = useMemo(
    () => (bookstore ? (visitDocs ?? []).some((v) => v.bookstoreId === bookstore.id) : false),
    [visitDocs, bookstore],
  );
  const bookmarked = bookstore ? (bookmarkIds ?? []).includes(bookstore.id) : false;

  // 카카오에 등록된 책방이면 (id 가 'kakao-' 로 시작) og:image 가져옴
  const kakaoPlaceId = bookstore?.id.startsWith('kakao-') ? bookstore.id.slice('kakao-'.length) : null;
  const { data: kakaoImage } = useKakaoPlaceImage(kakaoPlaceId);

  const photos = useMemo(() => {
    if (!bookstore) return [] as string[];
    return kakaoImage ? [kakaoImage, ...bookstore.photos] : bookstore.photos;
  }, [bookstore, kakaoImage]);

  // 북마크 낙관적 토글 — ['bookmarks', userId] 캐시를 즉시 갱신 후 Firestore 반영, 실패 시 롤백
  const onToggleBookmark = async () => {
    if (!userId || !bookstore) return;
    const key = ['bookmarks', userId];
    const prev = queryClient.getQueryData<string[]>(key) ?? [];
    const next = bookmarked
      ? prev.filter((bid) => bid !== bookstore.id)
      : [...prev, bookstore.id];
    queryClient.setQueryData(key, next);
    try {
      if (bookmarked) {
        await removeBookmark({ userId, bookstoreId: bookstore.id });
      } else {
        await addBookmark({ userId, bookstore });
      }
    } catch (err) {
      console.error(err);
      queryClient.setQueryData(key, prev);
    }
  };

  if (!bookstore) {
    return (
      <div className="relative min-h-screen bg-bg-midnight flex flex-col">
        <StatusBar />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="font-mono text-[10px] text-error tracking-[2px] uppercase mb-2">404</div>
          <h1 className="font-display text-[22px] font-bold text-paper mb-4">
            책방을 찾을 수 없어요
          </h1>
          <button
            onClick={() => navigate('/home', { replace: true })}
            className="font-ui text-[13px] text-lamp font-bold"
          >
            홈으로 돌아가기 →
          </button>
        </div>
      </div>
    );
  }

  const distanceMeters = userLocation
    ? haversineMeters(userLocation, { lat: bookstore.lat, lng: bookstore.lng })
    : null;

  return (
    <div className="relative min-h-screen bg-bg-midnight flex flex-col overflow-hidden">
      <StatusBar />

      <div className="absolute top-9 left-0 right-0 z-30 flex items-center justify-between px-4">
        <button
          onClick={() => navigate(-1)}
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-paper border border-paper/10"
          style={{ background: 'rgba(20,15,10,0.55)', backdropFilter: 'blur(8px)' }}
          aria-label="뒤로"
        >
          <ChevronLeft />
        </button>
        <div className="flex gap-2">
          <button
            onClick={onToggleBookmark}
            disabled={!userId}
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center border border-paper/10 disabled:opacity-40"
            style={{
              background: 'rgba(20,15,10,0.55)',
              backdropFilter: 'blur(8px)',
              color: bookmarked ? 'var(--accent-lamp)' : 'var(--paper)',
            }}
            aria-label={bookmarked ? '북마크 해제' : '북마크'}
            aria-pressed={bookmarked}
          >
            <BookmarkIcon filled={bookmarked} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[100px]">
        <PhotoSlider photos={photos} altPrefix={bookstore.name} />

        <BookstoreInfoCard
          bookstore={bookstore}
          visited={visited}
          distanceMeters={distanceMeters}
        />

        <div className="mx-5 h-px bg-hairline" />

        <MoodTagAggregation bookstore={bookstore} />

        <div className="mx-5 h-px bg-hairline" />

        <SpecialtyTags tags={bookstore.specialtyTags} />
      </div>

      <ActionBar bookstore={bookstore} />
    </div>
  );
}
