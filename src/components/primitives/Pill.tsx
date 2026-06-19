import { clsx } from 'clsx';

interface PillProps {
  emoji?: string;
  label: string;
  count?: number;
  muted?: boolean;
}

export function Pill({ emoji, label, count, muted = false }: PillProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-2.5 rounded-card border',
        muted ? 'bg-surface-01 border-hairline' : 'bg-surface-02 border-hairline-strong',
      )}
    >
      {emoji && <span className="text-[17px] leading-none">{emoji}</span>}
      <span
        className={clsx(
          'font-ui text-[12.5px] font-medium tracking-tight',
          muted ? 'text-paper-mute' : 'text-paper',
        )}
      >
        {label}
      </span>
      {count !== undefined && (
        <span
          className={clsx(
            'font-mono text-[10px]',
            muted ? 'text-paper-mute' : 'text-paper-dim',
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
}
