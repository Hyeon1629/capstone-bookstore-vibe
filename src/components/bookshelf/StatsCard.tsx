import { useCountUp } from '@/hooks/useCountUp';

interface StatsCardProps {
  total: number;
  thisMonth: number;
}

export function StatsCard({ total, thisMonth }: StatsCardProps) {
  return (
    <div
      className="relative rounded-card border border-hairline-strong overflow-hidden p-5"
      style={{ background: 'linear-gradient(135deg, #1f2731 0%, #1a212b 100%)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px] opacity-70"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--accent-lamp) 20%, var(--gold-visited) 80%, transparent)',
        }}
        aria-hidden
      />
      <div className="grid grid-cols-2 gap-3">
        <StatItem value={total} label="누적 방문" accent />
        <StatItem value={thisMonth} label="이번 달" />
      </div>
    </div>
  );
}

function StatItem({
  value,
  label,
  accent = false,
}: {
  value: number;
  label: string;
  accent?: boolean;
}) {
  const animated = useCountUp(value);
  return (
    <div>
      <div
        className={`font-display text-[28px] font-bold leading-none tracking-[-1px] ${
          accent ? 'text-lamp' : 'text-paper'
        }`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {animated}
      </div>
      <div className="mt-1 font-ui text-[11px] text-paper-mute font-medium tracking-tight">
        {label}
      </div>
    </div>
  );
}
