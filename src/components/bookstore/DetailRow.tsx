import type { ReactNode } from 'react';

interface DetailRowProps {
  icon: ReactNode;
  primary: string;
  secondary?: string;
}

export function DetailRow({ icon, primary, secondary }: DetailRowProps) {
  return (
    <div className="flex gap-3 items-start">
      <div
        className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
        style={{ background: 'var(--surface-02)', color: 'var(--paper-dim)' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-ui text-[14px] text-paper font-medium tracking-tight break-words">
          {primary}
        </div>
        {secondary && (
          <div className="font-ui text-[11.5px] text-paper-mute mt-0.5">{secondary}</div>
        )}
      </div>
    </div>
  );
}
