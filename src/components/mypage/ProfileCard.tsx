import { useCountUp } from '@/hooks/useCountUp';
import { getExplorerLevel } from '@/lib/explorer';

interface ProfileCardProps {
  nickname: string;
  email: string;
  totalVisits: number;
  thisMonthVisits: number;
}

export function ProfileCard({ nickname, email, totalVisits, thisMonthVisits }: ProfileCardProps) {
  const level = getExplorerLevel(totalVisits);
  const initial = nickname ? nickname[0] : '·';
  const total = useCountUp(totalVisits);
  const month = useCountUp(thisMonthVisits);

  return (
    <div
      className="relative rounded-card border border-hairline-strong overflow-hidden p-4"
      style={{ background: 'linear-gradient(135deg, #1f2731 0%, #1a212b 100%)' }}
    >
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          background: 'radial-gradient(circle, rgba(242,184,114,0.22) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative flex items-center gap-3.5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center font-display text-[26px] font-bold border-2"
          style={{
            background: 'linear-gradient(135deg, #d99852 0%, #f2b872 60%, #f5cd6e 100%)',
            color: '#1A1410',
            borderColor: 'rgba(255,235,200,0.3)',
            boxShadow: '0 0 24px rgba(242,184,114,0.33)',
          }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-[19px] font-bold text-paper tracking-[-0.3px] truncate">
            {nickname || '...'}
          </div>
          <div className="mt-0.5 font-ui text-[12px] text-paper-mute tracking-tight truncate">
            {email}
          </div>
          <div className="mt-1.5 inline-flex items-center gap-1 font-mono text-[9.5px] text-lamp px-1.5 py-[3px] rounded-[4px] tracking-[0.5px]"
            style={{ background: 'rgba(242,184,114,0.1)', border: '1px solid rgba(242,184,114,0.3)' }}
          >
            ★ EXPLORER · {level.label}
          </div>
        </div>
      </div>

      <div className="my-3 h-px bg-hairline" />

      <div className="grid grid-cols-2 gap-1">
        <MiniStat value={total} label="누적 방문" />
        <MiniStat value={month} label="이번 달" />
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-1">
      <div
        className="font-display text-[22px] font-bold text-paper tracking-[-0.5px] leading-none"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </div>
      <div className="mt-1 font-ui text-[10.5px] text-paper-mute font-medium">{label}</div>
    </div>
  );
}
