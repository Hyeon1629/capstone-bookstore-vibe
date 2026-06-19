import { TOKENS, lighten, darken } from '@/lib/tokens';

export type PinCategory = 'bookstore' | 'library';

interface MapPinProps {
  type?: PinCategory;
  visited?: boolean;
  size?: number;
  focused?: boolean;
}

function BookGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 4h11a3 3 0 013 3v13a1 1 0 01-1 1H7a2 2 0 01-2-2V4z" />
      <rect x="3" y="4" width="2.5" height="17" rx="0.5" opacity="0.85" />
    </svg>
  );
}

function CupGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 8h13v6a5 5 0 01-5 5h-3a5 5 0 01-5-5V8z" fill="currentColor" />
      <path
        d="M17 10h2a2.5 2.5 0 010 5h-2"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M7 3v3M10 3v3M13 3v3"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function MapPin({
  type = 'bookstore',
  visited = false,
  size = 36,
  focused = false,
}: MapPinProps) {
  // 방문 완료 시 핀 본체를 goldVisited 로 — 카테고리 색 대신 노란색으로 강조
  const baseColor =
    type === 'bookstore' ? TOKENS.color.pinBookstore : TOKENS.color.pinLibrary;
  const color = visited ? TOKENS.color.goldVisited : baseColor;
  const w = size;
  const h = size * 1.18;
  const gradientId = `pinGradient-${type}-${visited ? 'v' : 'u'}`;

  return (
    <div
      className="relative inline-block transition-transform duration-200"
      style={{
        width: w,
        height: h,
        filter: focused
          ? `drop-shadow(0 4px 14px ${color}88) drop-shadow(0 0 16px ${color}55)`
          : 'drop-shadow(0 4px 8px rgba(15,10,5,0.55))',
        transform: focused ? 'translateY(-4px) scale(1.08)' : 'none',
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 40 47"
        className="absolute inset-0"
      >
        <defs>
          <radialGradient id={gradientId} cx="0.5" cy="0.35" r="0.7">
            <stop offset="0%" stopColor={lighten(color, 0.18)} />
            <stop offset="60%" stopColor={color} />
            <stop offset="100%" stopColor={darken(color, 0.2)} />
          </radialGradient>
        </defs>
        <path
          d="M20 2 C 30 2 36 9 36 18 C 36 27 28 36 20 45 C 12 36 4 27 4 18 C 4 9 10 2 20 2 Z"
          fill={`url(#${gradientId})`}
          stroke={visited ? darken(TOKENS.color.goldVisited, 0.25) : 'rgba(255,235,210,0.9)'}
          strokeWidth={visited ? 1.8 : 1.5}
        />
        <circle cx="20" cy="18" r="11" fill="rgba(255,240,220,0.12)" />
      </svg>

      <div
        className="absolute left-0 flex justify-center w-full"
        style={{
          top: w * 0.18,
          color: visited ? TOKENS.color.bgMidnight : '#fff',
        }}
      >
        {type === 'bookstore' ? <BookGlyph size={w * 0.42} /> : <CupGlyph size={w * 0.42} />}
      </div>
    </div>
  );
}
