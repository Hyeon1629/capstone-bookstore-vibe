import { motion } from 'framer-motion';
import type { Bookstore, MoodEmoji } from '@/data/bookstores';
import { MOOD_GLYPH } from '@/hooks/useMoodTags';
import { TOKENS } from '@/lib/tokens';

interface VisitListItemProps {
  index: number;
  rank: number;
  bookstore: Bookstore;
  dateLabel: string;
  visitCount: number;
  moodEmoji?: MoodEmoji;
  onClick: () => void;
}

function ChevronRight({ size = 15 }: { size?: number }) {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function VisitListItem({
  index,
  rank,
  bookstore,
  dateLabel,
  visitCount,
  moodEmoji,
  onClick,
}: VisitListItemProps) {
  const color =
    bookstore.category === 'library' ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore;
  const number = rank;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: 'easeOut' }}
      className="flex items-center gap-3 w-full py-3.5 px-1 text-left border-b border-hairline"
    >
      <div
        className="w-9 h-11 rounded-[4px] flex flex-col items-center justify-center text-white shrink-0"
        style={{
          background: `linear-gradient(180deg, ${color}cc, ${color}88)`,
          boxShadow: `inset 2px 0 0 ${color}, inset -1px 0 0 rgba(0,0,0,0.2)`,
        }}
      >
        <div className="font-mono text-[9px] opacity-85 tracking-[0.5px]">NO.</div>
        <div className="font-display text-[16px] font-bold leading-none">
          {String(number).padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-display text-[15px] font-bold text-paper tracking-[-0.2px] flex items-center gap-1.5">
          <span className="truncate">{bookstore.name}</span>
          {moodEmoji && <span className="text-[14px] shrink-0">{MOOD_GLYPH[moodEmoji]}</span>}
        </div>
        <div className="flex items-center gap-1.5 mt-1 font-ui text-[11.5px] text-paper-mute">
          <span
            className="inline-block w-[5px] h-[5px] rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          {bookstore.category === 'library' ? '도서관·북카페' : '서점·헌책방'}
          <span>·</span>
          <span>{dateLabel}</span>
        </div>
      </div>

      <span
        className="shrink-0 font-mono text-[11px] text-lamp tabular-nums px-1.5 py-0.5 rounded-[6px]"
        style={{ background: 'rgba(242,184,114,0.1)', border: '1px solid rgba(242,184,114,0.25)' }}
        aria-label={`총 ${visitCount}회 방문`}
      >
        {visitCount}회
      </span>

      <span className="text-paper-mute shrink-0">
        <ChevronRight />
      </span>
    </motion.button>
  );
}
