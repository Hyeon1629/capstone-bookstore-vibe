import type { ReactNode } from 'react';

interface MenuGroupProps {
  title: string;
  children: ReactNode;
}

export function MenuGroup({ title, children }: MenuGroupProps) {
  return (
    <div>
      <div className="font-mono text-[10px] text-paper-mute tracking-[1.5px] uppercase mb-2 pl-1">
        {title}
      </div>
      <div className="bg-surface-01 border border-hairline rounded-card overflow-hidden">
        {children}
      </div>
    </div>
  );
}
