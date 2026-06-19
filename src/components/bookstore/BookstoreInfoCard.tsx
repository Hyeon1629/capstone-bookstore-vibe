import type { Bookstore } from '@/data/bookstores';
import { TOKENS } from '@/lib/tokens';
import { DetailRow } from './DetailRow';

interface BookstoreInfoCardProps {
  bookstore: Bookstore;
  visited: boolean;
  distanceMeters: number | null;
}

function NavIcon({ size = 14 }: { size?: number }) {
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
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function PhoneIcon({ size = 14 }: { size?: number }) {
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
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  const primary = km < 1 ? `${Math.round(meters)}m` : `${km.toFixed(1)}km`;
  const walkMin = Math.max(1, Math.round(meters / 80));
  return `현재 위치에서 ${primary} · 도보 ${walkMin}분`;
}

export function BookstoreInfoCard({ bookstore, visited, distanceMeters }: BookstoreInfoCardProps) {
  const categoryColor =
    bookstore.category === 'library' ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore;
  const categoryLabel = bookstore.category === 'library' ? '도서관 · 북카페' : '서점 · 헌책방';

  return (
    <>
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: categoryColor }}
            aria-hidden
          />
          <span className="font-ui text-[11.5px] font-medium text-paper-dim tracking-[0.4px] uppercase">
            {categoryLabel}
          </span>
          <span className="flex-1" />
          {visited && (
            <span
              className="font-mono text-[10px] text-gold-visited px-1.5 py-[2px] rounded-[6px] border border-gold-visited/40 tracking-[0.5px]"
              style={{ background: 'rgba(245,205,110,0.12)' }}
            >
              ★ 방문 완료
            </span>
          )}
        </div>
        <h1 className="font-display text-[26px] font-bold text-paper tracking-[-0.6px] leading-[1.2] m-0">
          {bookstore.name}
        </h1>
      </div>

      <div className="mx-5 h-px bg-hairline" />

      <div className="px-5 py-4 flex flex-col gap-3">
        <DetailRow
          icon={<NavIcon />}
          primary={bookstore.address}
          secondary={distanceMeters !== null ? formatDistance(distanceMeters) : bookstore.dong}
        />
        {bookstore.phone && <DetailRow icon={<PhoneIcon />} primary={bookstore.phone} />}
      </div>
    </>
  );
}
