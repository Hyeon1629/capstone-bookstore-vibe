import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

type TabKey = 'home' | 'map' | 'bookshelf' | 'mypage';

interface Item {
  key: TabKey;
  label: string;
  path: string;
  Icon: (props: { size?: number; filled?: boolean }) => JSX.Element;
}

const items: Item[] = [
  { key: 'home', label: '홈', path: '/home', Icon: IconHome },
  { key: 'map', label: '지도', path: '/map', Icon: IconMap },
  { key: 'bookshelf', label: '발자취', path: '/bookshelf', Icon: IconShelf },
  { key: 'mypage', label: '마이', path: '/mypage', Icon: IconUser },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeKey: TabKey = location.pathname.startsWith('/home')
    ? 'home'
    : location.pathname.startsWith('/bookshelf')
      ? 'bookshelf'
      : location.pathname.startsWith('/mypage')
        ? 'mypage'
        : 'map';

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-surface-01 border-t border-hairline flex pt-2.5 pb-6 z-20">
      {items.map((item) => {
        const isActive = activeKey === item.key;
        return (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={clsx(
              'flex-1 flex flex-col items-center justify-center gap-1 px-1 py-1.5',
              isActive ? 'text-lamp' : 'text-paper-mute',
            )}
            aria-label={item.label}
          >
            <item.Icon size={22} filled={isActive} />
            <span
              className={clsx(
                'font-ui text-[10.5px] tracking-[0.3px]',
                isActive ? 'font-semibold' : 'font-medium',
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function IconHome({ size = 22, filled = false }: { size?: number; filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M11.3 2.6a1 1 0 011.4 0l8 7.2A1 1 0 0120 11.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8.5a1 1 0 01.3-.7z" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 10.5L12 3l8 7.5" />
      <path d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function IconMap({ size = 22, filled = false }: { size?: number; filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C8 2 5 5.1 5 8.9c0 5.5 7 12.1 7 12.1s7-6.6 7-12.1C19 5.1 16 2 12 2zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function IconShelf({ size = 22, filled = false }: { size?: number; filled?: boolean }) {
  const stroke = filled ? 'currentColor' : 'currentColor';
  const fill = filled ? 'currentColor' : 'none';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="3.5" height="18" rx="0.5" />
      <rect x="7.5" y="5" width="3.5" height="16" rx="0.5" />
      <rect x="12" y="3" width="3.5" height="18" rx="0.5" />
      <rect x="16.5" y="6" width="3.5" height="15" rx="0.5" transform="rotate(8 18.25 13.5)" />
    </svg>
  );
}

function IconUser({ size = 22, filled = false }: { size?: number; filled?: boolean }) {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}
