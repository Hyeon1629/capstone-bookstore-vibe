import { useState } from 'react';
import { useMapStore } from '@/stores/mapStore';

function SearchIcon({ size = 16 }: { size?: number }) {
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
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}

export function SearchBar() {
  const searchQuery = useMapStore((s) => s.searchQuery);
  const setSearchQuery = useMapStore((s) => s.setSearchQuery);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-3 bg-surface-01 rounded-input border transition-colors duration-150"
      style={{
        borderColor: focused ? 'var(--accent-lamp)' : 'var(--hairline)',
      }}
    >
      <span className="text-paper-mute">
        <SearchIcon />
      </span>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="책방 이름으로 검색"
        className="flex-1 bg-transparent outline-none font-ui text-[13.5px] text-paper placeholder:text-paper-mute tracking-tight"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="font-mono text-[10px] text-paper-mute hover:text-paper px-2"
          aria-label="검색 초기화"
        >
          ✕
        </button>
      )}
    </div>
  );
}
