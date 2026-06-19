import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { Bookstore, MoodEmoji } from '@/data/bookstores';
import { Button } from '@/components/primitives';
import { MOOD_GLYPH, MOOD_LABEL } from '@/hooks/useMoodTags';
import { TOKENS } from '@/lib/tokens';
import { Sparkles } from './Sparkles';

interface MoodInputModalProps {
  bookstore: Bookstore;
  visitNumber: number;
  submitting: boolean;
  onSubmit: (emoji: MoodEmoji | null) => void;
  onCancel: () => void;
}

const MOOD_KEYS: MoodEmoji[] = ['coffee', 'rain', 'music', 'quiet', 'sun'];
const SHORT_LABEL: Record<MoodEmoji, string> = {
  coffee: '독서',
  rain: '비오는',
  music: '음악',
  quiet: '한적한',
  sun: '햇살',
};

export function MoodInputModal({
  bookstore,
  visitNumber,
  submitting,
  onSubmit,
  onCancel,
}: MoodInputModalProps) {
  const [selected, setSelected] = useState<MoodEmoji | null>(null);

  // ESC 로만 닫기 — 배경 클릭은 무시
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(242,184,114,0.18) 0%, rgba(19,23,30,0.95) 60%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent 0 23px, rgba(242,234,217,0.06) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(242,234,217,0.06) 23px 24px)',
        }}
      />
      <Sparkles />

      <motion.div
        className="relative w-full max-w-sm bg-surface-01 border border-hairline-strong rounded-sheet p-7 z-[3]"
        style={{
          boxShadow: 'var(--shadow-warm), var(--shadow-glow)',
        }}
        initial={{ y: 20, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <GoldenStamp />

        <div className="font-mono text-[10px] text-lamp tracking-[3px] uppercase text-center mt-4 mb-1.5">
          STAMP COLLECTED · #{String(visitNumber).padStart(3, '0')}
        </div>
        <h2 className="font-display text-[24px] font-bold text-paper text-center tracking-[-0.5px] leading-[1.3] m-0">
          방문 인증 완료
        </h2>
        <div className="font-ui text-[13.5px] text-paper-dim text-center mt-1.5 tracking-tight">
          <span className="text-paper font-semibold">{bookstore.name}</span>
          에 다녀오셨네요.
        </div>

        <div
          className="my-5 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--hairline-strong) 20%, var(--hairline-strong) 80%, transparent)',
          }}
        />

        <div className="font-display text-[16px] font-bold text-paper text-center mb-3.5 tracking-tight">
          오늘 어떤 분위기였어요?
        </div>

        <div className="grid grid-cols-5 gap-1.5 mb-5">
          {MOOD_KEYS.map((emoji) => {
            const isSelected = selected === emoji;
            return (
              <button
                key={emoji}
                onClick={() => setSelected(emoji)}
                aria-label={MOOD_LABEL[emoji]}
                className={clsx(
                  'flex flex-col items-center gap-1 py-3 px-1 rounded-input transition-all duration-200',
                  isSelected
                    ? 'border-[1.5px] border-lamp -translate-y-0.5'
                    : 'border-[1.5px] border-hairline bg-surface-02',
                )}
                style={{
                  background: isSelected
                    ? 'linear-gradient(180deg, rgba(242,184,114,0.18), rgba(242,184,114,0.08))'
                    : undefined,
                }}
              >
                <span
                  className="text-[22px] transition-transform duration-200"
                  style={{ transform: isSelected ? 'scale(1.08)' : 'scale(1)' }}
                >
                  {MOOD_GLYPH[emoji]}
                </span>
                <span
                  className={clsx(
                    'font-ui text-[10.5px] tracking-tight',
                    isSelected ? 'text-lamp font-semibold' : 'text-paper-dim font-medium',
                  )}
                >
                  {SHORT_LABEL[emoji]}
                </span>
              </button>
            );
          })}
        </div>

        <Button onClick={() => onSubmit(selected)} disabled={submitting}>
          {submitting ? '기록 중...' : '발자취에 기록하기'}
        </Button>
        <button
          onClick={() => onSubmit(null)}
          disabled={submitting}
          className="w-full pt-3 pb-1 font-ui text-[13px] text-paper-mute font-medium"
        >
          건너뛰기
        </button>
      </motion.div>
    </motion.div>
  );
}

function GoldenStamp() {
  return (
    <div className="relative w-[72px] h-[72px] mx-auto">
      <div
        className="w-full h-full rounded-full flex items-center justify-center"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, #FFE0A0, #F5CD6E 35%, #D99852 75%, #A67035 100%)',
          boxShadow: `0 0 32px ${TOKENS.color.goldVisited}66, inset 0 -3px 6px rgba(80,40,10,0.5), inset 0 3px 3px rgba(255,240,200,0.4)`,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#1A1410" aria-hidden>
          <path d="M12 2l2.6 6.8 7.4.6-5.6 4.8 1.8 7.2L12 17.5 5.8 21.4l1.8-7.2L2 9.4l7.4-.6L12 2z" />
        </svg>
      </div>
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: -8,
          border: '1px dashed rgba(245,205,110,0.4)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
