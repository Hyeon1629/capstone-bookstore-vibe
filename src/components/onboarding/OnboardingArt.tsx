import { MapPin } from '@/components/primitives';
import { TOKENS, darken } from '@/lib/tokens';

export type OnboardingArtKind = 'discovery' | 'stamp' | 'shelf';

interface OnboardingArtProps {
  kind: OnboardingArtKind;
}

export function OnboardingArt({ kind }: OnboardingArtProps) {
  if (kind === 'discovery') return <DiscoveryArt />;
  if (kind === 'stamp') return <StampArt />;
  return <ShelfArt />;
}

function DiscoveryArt() {
  const pins = [
    { x: 22, y: 25, type: 'bookstore' as const },
    { x: 58, y: 35, type: 'library' as const, visited: true },
    { x: 75, y: 60, type: 'bookstore' as const },
    { x: 35, y: 68, type: 'library' as const },
    { x: 80, y: 22, type: 'bookstore' as const },
    { x: 18, y: 50, type: 'bookstore' as const },
    { x: 50, y: 80, type: 'library' as const },
  ];

  return (
    <div className="relative w-full max-w-[280px] aspect-square">
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: 28,
          background: 'radial-gradient(ellipse at 30% 30%, #2a3340 0%, #161b23 80%)',
          border: '1px solid var(--hairline-strong)',
          boxShadow: 'var(--shadow-warm)',
        }}
      >
        <svg viewBox="0 0 280 280" width="100%" height="100%">
          <g fill="#1d242f" stroke="#272f3a" strokeWidth="1">
            <polygon points="0,0 100,0 100,60 50,90 0,80" />
            <polygon points="110,0 220,0 220,70 160,90 110,55" />
            <polygon points="230,0 280,0 280,80 240,90" />
            <polygon points="0,95 80,95 110,150 60,200 0,180" />
            <polygon points="125,100 220,100 240,160 180,200 130,170" />
            <polygon points="250,100 280,100 280,220 260,200" />
            <polygon points="0,220 80,220 100,280 0,280" />
            <polygon points="115,210 200,210 220,280 110,280" />
            <polygon points="230,230 280,230 280,280 240,280" />
          </g>
          <g stroke="#3a3328" strokeWidth="0.8" opacity="0.6" fill="none">
            <line x1="0" y1="90" x2="280" y2="105" />
            <line x1="0" y1="210" x2="280" y2="225" />
            <line x1="110" y1="0" x2="115" y2="280" />
            <line x1="225" y1="0" x2="230" y2="280" />
          </g>
        </svg>

        {pins.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -100%)',
              filter: `drop-shadow(0 0 12px ${
                p.type === 'library' ? TOKENS.color.pinLibrary : TOKENS.color.pinBookstore
              }aa)`,
              animation: `float 3s ease-in-out ${i * 0.3}s infinite`,
            }}
          >
            <MapPin type={p.type} visited={'visited' in p && p.visited} size={26} />
          </div>
        ))}

        <div
          className="absolute"
          style={{
            left: '45%',
            top: '48%',
            transform: 'translate(-50%, -50%)',
            width: 14,
            height: 14,
            borderRadius: 999,
            background: TOKENS.color.info,
            border: '3px solid #fff',
            boxShadow: `0 0 0 8px ${TOKENS.color.info}33`,
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -100%) translateY(0); }
          50% { transform: translate(-50%, -100%) translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

function StampArt() {
  return (
    <div className="relative w-full max-w-[280px] aspect-square">
      <div
        className="absolute"
        style={{
          inset: '8% 14%',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #f2ead9, #e8dec8)',
          transform: 'rotate(-3deg)',
          boxShadow: 'var(--shadow-warm)',
          padding: '24px 22px',
          color: '#3a2d1c',
          fontFamily: 'var(--font-display-kr)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display-en)',
            fontStyle: 'italic',
            fontSize: 13,
            color: '#7a5a35',
            letterSpacing: 0.5,
          }}
        >
          Visit Stamp
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>성수 책방</div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9.5,
              color: '#7a5a35',
              letterSpacing: 0.5,
              marginTop: 2,
            }}
          >
            2026.05.21 · #013
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div style={{ height: 1, background: '#c2b59c' }} />
          <div style={{ height: 1, background: '#c2b59c' }} />
          <div style={{ height: 1, background: '#c2b59c', width: '70%' }} />
        </div>
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{
          right: '8%',
          top: '12%',
          width: 92,
          height: 92,
          borderRadius: 999,
          background:
            'radial-gradient(circle at 35% 30%, #FFE0A0, #F5CD6E 35%, #D99852 75%, #A67035 100%)',
          boxShadow: `0 0 32px ${TOKENS.color.goldVisited}66, inset 0 -4px 8px rgba(80,40,10,0.5), inset 0 4px 4px rgba(255,240,200,0.4)`,
          transform: 'rotate(8deg)',
          border: '3px solid rgba(255,240,200,0.3)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display-en)',
            fontStyle: 'italic',
            fontSize: 14,
            fontWeight: 600,
            color: '#3a2410',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          VISIT
          <br />
          <span style={{ fontSize: 9, letterSpacing: 1.5 }}>NO.013</span>
        </div>
      </div>
    </div>
  );
}

function ShelfArt() {
  const row1 = [
    { c: TOKENS.color.pinBookstore, h: '85%', w: 14 },
    { c: TOKENS.color.pinLibrary, h: '100%', w: 16 },
    { c: TOKENS.color.accentLamp, h: '75%', w: 12, gold: true },
    { c: TOKENS.color.pinBookstore, h: '90%', w: 18 },
    { c: TOKENS.color.pinLibrary, h: '70%', w: 14 },
    { c: TOKENS.color.pinBookstore, h: '95%', w: 16, gold: true },
    { c: TOKENS.color.pinLibrary, h: '80%', w: 14 },
    { c: '#3a4250', h: '60%', w: 13 },
    { c: '#3a4250', h: '70%', w: 14 },
  ];
  const row2 = [
    { c: TOKENS.color.pinLibrary, h: '100%', w: 14, gold: true },
    { c: TOKENS.color.pinBookstore, h: '85%', w: 16 },
    { c: TOKENS.color.pinLibrary, h: '70%', w: 12 },
    { c: TOKENS.color.pinBookstore, h: '95%', w: 18, gold: true },
    { c: TOKENS.color.pinLibrary, h: '80%', w: 14 },
    { c: '#3a4250', h: '65%', w: 13 },
    { c: '#3a4250', h: '70%', w: 14 },
    { c: '#3a4250', h: '60%', w: 12 },
    { c: '#3a4250', h: '78%', w: 14 },
  ];
  const row3 = [
    { c: TOKENS.color.pinBookstore, h: '85%', w: 16 },
    { c: TOKENS.color.pinLibrary, h: '100%', w: 14, gold: true },
    { c: '#3a4250', h: '70%', w: 12 },
    { c: '#3a4250', h: '85%', w: 18 },
    { c: '#3a4250', h: '75%', w: 14 },
    { c: '#3a4250', h: '65%', w: 13 },
    { c: '#3a4250', h: '80%', w: 14 },
    { c: '#3a4250', h: '65%', w: 14 },
    { c: '#3a4250', h: '78%', w: 13 },
  ];

  return (
    <div className="relative w-full max-w-[280px] aspect-square">
      <div
        className="absolute"
        style={{
          inset: '12% 6%',
          background: 'linear-gradient(180deg, #2a212a 0%, #1d1820 100%)',
          borderRadius: 8,
          border: '1px solid var(--hairline-strong)',
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: 'var(--shadow-warm)',
        }}
      >
        {[row1, row2, row3].map((row, idx) => (
          <ShelfRow key={idx} books={row} divider={idx < 2} />
        ))}
      </div>

      <div
        className="absolute"
        style={{
          top: '0%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 2,
          height: 36,
          background: '#3a3328',
        }}
      />
      <div
        className="absolute"
        style={{
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 50,
          height: 30,
          borderRadius: '0 0 25px 25px / 0 0 24px 24px',
          background: 'linear-gradient(180deg, #2a2018 0%, #1a140f 100%)',
          border: '1px solid #3a3328',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 120,
          borderRadius: 999,
          background: 'radial-gradient(circle, rgba(242,184,114,0.4) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}

function ShelfRow({
  books,
  divider,
}: {
  books: { c: string; h: string; w: number; gold?: boolean }[];
  divider: boolean;
}) {
  return (
    <>
      <div className="flex items-end" style={{ gap: 3, height: '33%' }}>
        {books.map((b, i) => (
          <BookSpine key={i} c={b.c} h={b.h} w={b.w} gold={b.gold} />
        ))}
      </div>
      {divider && <div style={{ height: 1, background: 'var(--hairline-strong)' }} />}
    </>
  );
}

function BookSpine({ c, h, w, gold }: { c: string; h: string; w: number; gold?: boolean }) {
  return (
    <div
      className="relative"
      style={{
        width: w,
        height: h,
        background: `linear-gradient(180deg, ${c}, ${darken(c, 0.18)})`,
        borderRadius: '1px 1px 0 0',
        borderTop: gold ? `2px solid ${TOKENS.color.goldVisited}` : 'none',
        boxShadow: gold ? `0 0 6px ${TOKENS.color.goldVisited}77` : 'none',
      }}
    >
      <div
        className="absolute"
        style={{ left: 1, right: 1, top: '20%', height: 1, background: 'rgba(255,235,200,0.15)' }}
      />
      <div
        className="absolute"
        style={{ left: 1, right: 1, bottom: '20%', height: 1, background: 'rgba(0,0,0,0.25)' }}
      />
    </div>
  );
}
