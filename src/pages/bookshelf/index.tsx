import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chip, StatusBar } from '@/components/primitives';
import { BottomNav } from '@/components/shared/BottomNav';
import { EmptyBookshelf } from '@/components/bookshelf/EmptyBookshelf';
import { StatsCard } from '@/components/bookshelf/StatsCard';
import { VisitListItem } from '@/components/bookshelf/VisitListItem';
import { useUserVisits } from '@/hooks/useUserVisits';
import { useUserProfile } from '@/hooks/useUserProfile';
import {
  indexLatestMoodByBookstore,
  useAllUserMoodTags,
} from '@/hooks/useAllUserMoodTags';
import { useAuthStore } from '@/stores/authStore';
import type { VisitDoc } from '@/lib/firestore';

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((now.getTime() - date.getTime()) / msPerDay);
  if (diffDays < 1) return '오늘';
  if (diffDays < 2) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주일 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}

function isCurrentMonth(date: Date): boolean {
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function visitDate(v: VisitDoc): Date | null {
  // Timestamp 의 toDate() — null 가능성 처리
  if (!v.visitedAt || typeof v.visitedAt.toDate !== 'function') return null;
  return v.visitedAt.toDate();
}

export function BookshelfPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const userId = currentUser?.uid ?? null;
  const { data: visits, isLoading } = useUserVisits(userId);
  const { data: moodDocs } = useAllUserMoodTags(userId);

  const enriched = useMemo(() => {
    if (!visits) return [];
    // 책방별 1행 — visits 는 최신순 정렬이므로 첫 등장(=최신)만 남기고 중복 제거
    const seen = new Set<string>();
    return visits
      .map((v) => {
        if (seen.has(v.bookstoreId)) return null;
        seen.add(v.bookstoreId);
        const date = visitDate(v);
        if (!date) return null;
        return { visit: v, bookstore: v.bookstore, date };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [visits]);

  const moodByBookstore = useMemo(() => indexLatestMoodByBookstore(moodDocs), [moodDocs]);

  const visitedIds = useMemo(() => new Set(enriched.map((e) => e.visit.bookstoreId)), [enriched]);
  const total = visitedIds.size;
  const thisMonth = useMemo(
    () => enriched.filter((e) => isCurrentMonth(e.date)).length,
    [enriched],
  );

  const [sortMode, setSortMode] = useState<'recent' | 'frequent'>('recent');
  const top3 = useMemo(() => {
    const arr = [...enriched];
    if (sortMode === 'frequent') {
      arr.sort(
        (a, b) => b.visit.visitCount - a.visit.visitCount || b.date.getTime() - a.date.getTime(),
      );
    } else {
      arr.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    return arr.slice(0, 3);
  }, [enriched, sortMode]);

  const { data: profile } = useUserProfile(userId);
  const nickname = profile?.nickname ?? '';

  if (!isLoading && enriched.length === 0) {
    return (
      <div className="relative min-h-screen bg-bg-midnight flex flex-col">
        <StatusBar />
        <div className="px-5 pt-3 pb-2">
          <div className="font-mono text-[10px] text-paper-mute tracking-[1.5px] uppercase mb-1">
            MY TRACES
          </div>
          <h1 className="font-display text-[26px] font-bold text-paper tracking-[-0.6px] leading-[1.2]">
            나의 발자취
          </h1>
        </div>
        <div className="flex-1 pb-24">
          <EmptyBookshelf />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-midnight flex flex-col">
      <StatusBar />

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-5 pt-3 pb-1.5">
          <div className="font-mono text-[10px] text-paper-mute tracking-[1.5px] uppercase mb-1">
            MY TRACES
          </div>
          <h1 className="font-display text-[26px] font-bold text-paper tracking-[-0.6px] leading-[1.2]">
            {nickname ? `${nickname} 님의 발자취` : '나의 발자취'}
          </h1>
        </div>

        <div className="px-5 mt-4">
          <StatsCard total={total} thisMonth={thisMonth} />
        </div>

        <div className="px-5 mt-5">
          <SectionTitle title="방문 기록" right={`TOP 3 · 전체 ${enriched.length}곳`} />
          <div className="flex gap-1.5 mb-3">
            <Chip dense active={sortMode === 'recent'} onClick={() => setSortMode('recent')}>
              최근 방문
            </Chip>
            <Chip dense active={sortMode === 'frequent'} onClick={() => setSortMode('frequent')}>
              가장 자주
            </Chip>
          </div>
          <div className="flex flex-col">
            {top3.map((e, i) => (
              <VisitListItem
                key={e.visit.id}
                index={i}
                rank={i + 1}
                bookstore={e.bookstore}
                dateLabel={formatRelativeDate(e.date)}
                visitCount={e.visit.visitCount}
                moodEmoji={moodByBookstore.get(e.visit.bookstoreId)}
                onClick={() =>
                  navigate(`/bookstore/${e.bookstore.id}`, { state: { bookstore: e.bookstore } })
                }
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function SectionTitle({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex justify-between items-baseline mb-2.5">
      <div className="font-display text-[15px] font-bold text-paper tracking-[-0.2px]">{title}</div>
      {right && (
        <div className="font-mono text-[10px] text-paper-mute tracking-[0.5px]">{right}</div>
      )}
    </div>
  );
}
