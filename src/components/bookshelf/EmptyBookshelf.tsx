import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/primitives';

export function EmptyBookshelf() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
      <EmptyShelfArt />
      <h2 className="mt-7 font-display text-[18px] font-bold text-paper tracking-[-0.3px]">
        첫 발견을 기다리는 책장이에요
      </h2>
      <p className="mt-2 font-ui text-[13px] text-paper-dim leading-[1.65]">
        지도에서 책방을 찾아 방문 인증해보세요.
        <br />한 점씩 채워가는 재미가 시작돼요.
      </p>
      <div className="mt-6 w-full max-w-[240px]">
        <Button onClick={() => navigate('/map')}>지도에서 발견하기</Button>
      </div>
    </div>
  );
}

function EmptyShelfArt() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" aria-hidden>
      <defs>
        <linearGradient id="shelf-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d242f" />
          <stop offset="100%" stopColor="#131820" />
        </linearGradient>
      </defs>
      <rect
        x="14"
        y="10"
        width="132"
        height="100"
        rx="6"
        fill="url(#shelf-bg)"
        stroke="#2b323d"
      />
      {/* 3단 책장 라인 */}
      {[40, 70, 100].map((y) => (
        <line key={y} x1="22" y1={y} x2="138" y2={y} stroke="#3a4250" strokeWidth="1" />
      ))}
      {/* 비어있음을 강조하는 작은 점선 */}
      {[
        [30, 38, 12, 12],
        [50, 38, 8, 12],
        [85, 38, 14, 12],
        [40, 68, 10, 12],
        [70, 68, 12, 12],
        [55, 98, 14, 12],
        [110, 98, 10, 12],
      ].map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y as number - (h as number)}
          width={w}
          height={h}
          fill="none"
          stroke="#847D70"
          strokeWidth="0.6"
          strokeDasharray="2 2"
          rx="1"
          opacity="0.5"
        />
      ))}
      {/* 펜던트 조명 */}
      <line x1="80" y1="0" x2="80" y2="14" stroke="#3a3328" strokeWidth="1" />
      <path d="M 70 14 Q 80 24 90 14" fill="#2a2018" stroke="#3a3328" strokeWidth="0.8" />
      <ellipse cx="80" cy="20" rx="22" ry="12" fill="#F2B872" opacity="0.12" />
    </svg>
  );
}
