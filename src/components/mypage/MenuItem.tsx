import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  right?: string;
  danger?: boolean;
  onClick?: () => void;
}

function ChevronRight({ size = 15 }: { size?: number }) {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function MenuItem({ icon, label, right, danger = false, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3.5 w-full px-4 py-3 text-left border-b border-hairline last:border-b-0',
        danger ? 'text-error' : 'text-paper',
      )}
    >
      <span
        className={clsx(
          'w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0',
          danger ? 'bg-error/10' : 'bg-surface-02',
        )}
        style={{ color: 'currentColor' }}
      >
        {icon}
      </span>
      <span className="flex-1 font-ui text-[14.5px] font-medium tracking-tight">{label}</span>
      {right && (
        <span className="font-ui text-[12px] text-paper-mute mr-1.5">{right}</span>
      )}
      <span className="text-paper-mute shrink-0">
        <ChevronRight />
      </span>
    </button>
  );
}
