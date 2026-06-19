import type { Bookstore } from '@/data/bookstores';
import { Pill } from '@/components/primitives';
import { MOOD_GLYPH, MOOD_LABEL, useMoodTags } from '@/hooks/useMoodTags';

interface MoodTagAggregationProps {
  bookstore: Bookstore;
}

export function MoodTagAggregation({ bookstore }: MoodTagAggregationProps) {
  const { aggregated, isEmpty, isLoading } = useMoodTags(bookstore);

  return (
    <div className="px-5 pt-4 pb-4">
      <div className="font-mono text-[11.5px] text-paper-mute font-semibold tracking-[0.4px] uppercase mb-2.5">
        최근 방문자가 느낀 분위기
      </div>

      {isLoading && (
        <div className="font-ui text-[12px] text-paper-mute">집계 중...</div>
      )}

      {!isLoading && isEmpty && (
        <div className="flex flex-col gap-2.5">
          <div className="font-ui text-[13px] text-paper-dim">
            첫 번째 분위기를 남겨주세요
          </div>
          <div className="flex gap-2 opacity-30">
            {(['coffee', 'rain', 'music', 'quiet', 'sun'] as const).map((emoji) => (
              <Pill key={emoji} emoji={MOOD_GLYPH[emoji]} label={MOOD_LABEL[emoji]} muted />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !isEmpty && (
        <div className="flex flex-wrap gap-2">
          {aggregated.map((m, i) => (
            <Pill
              key={m.emoji}
              emoji={MOOD_GLYPH[m.emoji]}
              label={MOOD_LABEL[m.emoji]}
              count={m.count}
              muted={i >= 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
