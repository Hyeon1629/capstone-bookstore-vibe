import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '@/components/primitives';
import { BottomNav } from '@/components/shared/BottomNav';
import { LocationPrompt } from '@/components/shared/LocationPrompt';
import { type Bookstore } from '@/data/bookstores';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbyBookstores, type NearbyEntry } from '@/hooks/useNearbyBookstores';
import { useUserVisits } from '@/hooks/useUserVisits';
import { TOKENS } from '@/lib/tokens';
import { useAuthStore } from '@/stores/authStore';
import { useMapStore } from '@/stores/mapStore';

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

export function HomePage() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.currentUser?.uid ?? null);
  const setUserLocation = useMapStore((s) => s.setUserLocation);
  const { position } = useGeolocation();

  useEffect(() => {
    if (position) setUserLocation(position);
  }, [position, setUserLocation]);

  const { list, isLoading, isReady } = useNearbyBookstores(position);
  const { data: visitDocs } = useUserVisits(userId);
  const visitedIds = useMemo(
    () => new Set((visitDocs ?? []).map((v) => v.bookstoreId)),
    [visitDocs],
  );

  const loading = isLoading || !isReady;

  // 위치가 없으면 (권한 거부·미허용) 위치 안내 화면
  if (!position) return <LocationPrompt />;

  return (
    <div className="relative min-h-screen bg-bg-midnight flex flex-col">
      <StatusBar />

      <div className="flex-1 overflow-y-auto pb-3">
        <div className="px-5 pt-2 pb-2">
          <div className="font-mono text-[11.5px] text-paper-mute font-medium tracking-[0.4px] uppercase mb-0.5">
            HOME · 내 위치 기준
          </div>
          <h1 className="font-display text-[24px] font-bold text-paper tracking-[-0.5px] leading-[1.2]">
            가까운 책방{' '}
            {list.length > 0 && (
              <span className="font-mono text-[13px] text-lamp">{list.length}곳</span>
            )}
          </h1>
        </div>

        {loading && list.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="font-mono text-[11px] text-paper-mute tracking-[2px] uppercase">
              주변 책방 찾는 중...
            </div>
          </div>
        ) : list.length === 0 ? (
          <div className="px-8 py-20 text-center">
            <div className="font-ui text-[13px] text-paper">주변에 책방이 없어요</div>
            <div className="mt-1 font-ui text-[11.5px] text-paper-mute">
              위치를 옮기거나 지도에서 찾아보세요
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {list.map((entry, i) => (
              <HomeListItem
                key={entry.bookstore.id}
                entry={entry}
                index={i}
                visited={visitedIds.has(entry.bookstore.id)}
                onClick={() =>
                  navigate(`/bookstore/${entry.bookstore.id}`, {
                    state: { bookstore: entry.bookstore },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function HomeListItem({
  entry,
  index,
  visited,
  onClick,
}: {
  entry: NearbyEntry;
  index: number;
  visited: boolean;
  onClick: () => void;
}) {
  const b: Bookstore = entry.bookstore;
  const color = b.category === 'library' ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore;
  const categoryLabel = b.category === 'library' ? '도서관·북카페' : '서점·헌책방';

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.03, duration: 0.25, ease: 'easeOut' }}
      className="flex items-center gap-3 w-full px-5 py-3 text-left border-b border-hairline"
    >
      <div
        className="w-[60px] h-[60px] rounded-[12px] overflow-hidden shrink-0 border border-hairline"
        style={{ background: `linear-gradient(135deg, ${color}33, #1a212b)` }}
      >
        {b.photos[0] && (
          <img
            src={b.photos[0]}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            aria-hidden
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-display text-[15.5px] font-bold text-paper tracking-[-0.2px] truncate">
            {b.name}
          </span>
          {visited && (
            <span
              className="shrink-0 font-mono text-[9px] text-gold-visited px-1 py-[1px] rounded-[4px] tracking-[0.5px]"
              style={{ background: 'rgba(245,205,110,0.12)', border: '1px solid rgba(245,205,110,0.35)' }}
            >
              ★
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1 font-ui text-[11.5px] text-paper-mute">
          <span
            className="inline-block w-[5px] h-[5px] rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          <span>{categoryLabel}</span>
          {b.dong && (
            <>
              <span>·</span>
              <span className="truncate">{b.dong}</span>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-mono text-[13px] text-lamp font-medium tabular-nums">
          {formatDistance(entry.distanceM)}
        </div>
      </div>
    </motion.button>
  );
}
