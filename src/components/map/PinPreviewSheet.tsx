import { motion } from 'framer-motion';
import type { Bookstore } from '@/data/bookstores';
import { TOKENS } from '@/lib/tokens';

interface PinPreviewSheetProps {
  bookstore: Bookstore;
  distanceLabel: string | null;
  visited: boolean;
  onDetail: () => void;
  onClose: () => void;
}

function ChevronRight({ size = 14 }: { size?: number }) {
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

function CloseIcon({ size = 16 }: { size?: number }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function PinPreviewSheet({
  bookstore,
  distanceLabel,
  visited,
  onDetail,
  onClose,
}: PinPreviewSheetProps) {
  const categoryColor =
    bookstore.category === 'library' ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore;
  const categoryLabel = bookstore.category === 'library' ? '도서관·북카페' : '서점·헌책방';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute left-3 right-3 bottom-[86px] z-[16] bg-surface-01 border border-hairline rounded-card flex gap-3 p-3.5 shadow-warm"
    >
      <div
        className="w-[72px] h-[72px] rounded-[12px] shrink-0 overflow-hidden"
        style={{
          background:
            bookstore.category === 'library'
              ? 'linear-gradient(135deg, #243029, #384a40)'
              : 'linear-gradient(135deg, #3a2a1c, #5a3d24)',
        }}
        aria-hidden
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="inline-block w-[6px] h-[6px] rounded-full"
              style={{ background: categoryColor }}
              aria-hidden
            />
            <span className="font-ui text-[10.5px] text-paper-mute uppercase tracking-[0.3px] font-medium">
              {categoryLabel}
            </span>
            {visited && (
              <span
                className="ml-1 font-mono text-[9.5px] text-gold-visited px-1.5 py-[1px] rounded-[4px] border border-gold-visited/40"
                style={{ background: 'rgba(245,205,110,0.12)' }}
              >
                ★ VISITED
              </span>
            )}
          </div>
          <div className="font-display text-[16px] font-bold text-paper tracking-[-0.3px] whitespace-nowrap overflow-hidden text-ellipsis">
            {bookstore.name}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-ui text-[11px] text-paper-mute">
              {distanceLabel ?? bookstore.dong}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 self-stretch">
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center text-paper-mute hover:text-paper rounded-full"
          aria-label="시트 닫기"
        >
          <CloseIcon />
        </button>
        <button
          onClick={onDetail}
          className="px-3.5 py-1.5 bg-paper text-bg-midnight rounded-btn font-ui text-[12.5px] font-bold inline-flex items-center gap-1 mt-auto"
        >
          상세 <ChevronRight />
        </button>
      </div>
    </motion.div>
  );
}
