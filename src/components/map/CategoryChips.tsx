import { Chip } from '@/components/primitives';
import { TOKENS } from '@/lib/tokens';
import { useMapStore } from '@/stores/mapStore';

interface CategoryChipsProps {
  totalCount: number;
}

export function CategoryChips({ totalCount }: CategoryChipsProps) {
  const filterCategory = useMapStore((s) => s.filterCategory);
  const setFilterCategory = useMapStore((s) => s.setFilterCategory);

  return (
    <div className="flex justify-between gap-1.5 px-4 pb-3.5">
      <Chip dense active={filterCategory === 'all'} onClick={() => setFilterCategory('all')}>
        전체·{totalCount}
      </Chip>
      <Chip
        dense
        active={filterCategory === 'bookstore'}
        onClick={() => setFilterCategory('bookstore')}
        leftDot={TOKENS.color.pinBookstore}
      >
        서점·헌책방
      </Chip>
      <Chip
        dense
        active={filterCategory === 'library'}
        onClick={() => setFilterCategory('library')}
        leftDot={TOKENS.color.pinLibrary}
      >
        도서관·북카페
      </Chip>
      <Chip
        dense
        active={filterCategory === 'visited'}
        onClick={() => setFilterCategory('visited')}
        leftDot={TOKENS.color.goldVisited}
      >
        방문완료
      </Chip>
    </div>
  );
}
