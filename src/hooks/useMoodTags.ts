import { useQuery } from '@tanstack/react-query';
import type { Bookstore, MoodEmoji } from '@/data/bookstores';
import { aggregateMoodCounts, fetchMoodTags } from '@/lib/firestore';

export interface AggregatedMood {
  emoji: MoodEmoji;
  count: number;
}

const ALL_EMOJIS: MoodEmoji[] = ['coffee', 'rain', 'music', 'quiet', 'sun'];

export function useMoodTags(bookstore: Bookstore) {
  const query = useQuery({
    queryKey: ['moodTags', bookstore.id],
    queryFn: () => fetchMoodTags(bookstore.id),
    staleTime: 60_000,
    retry: 1,
  });

  const firestoreCounts = query.data ? aggregateMoodCounts(query.data) : {};

  const aggregated: AggregatedMood[] = ALL_EMOJIS.map((emoji) => ({
    emoji,
    count: firestoreCounts[emoji] ?? 0,
  }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);

  const total = aggregated.reduce((sum, m) => sum + m.count, 0);

  return {
    aggregated,
    total,
    isEmpty: total === 0,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export const MOOD_LABEL: Record<MoodEmoji, string> = {
  coffee: '독서하기 좋은 날',
  rain: '비오는 날',
  music: '음악 흐르는',
  quiet: '한적한',
  sun: '햇살 좋은',
};

export const MOOD_GLYPH: Record<MoodEmoji, string> = {
  coffee: '☕',
  rain: '🌧️',
  music: '🎶',
  quiet: '🤫',
  sun: '☀️',
};
