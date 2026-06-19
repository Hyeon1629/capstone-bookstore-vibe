import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  label?: string;
}

export function PhoneFrame({ children, label }: PhoneFrameProps) {
  return (
    <div className="flex flex-col items-center gap-3.5">
      <div
        className="relative"
        style={{
          width: 396,
          height: 832,
          background: 'linear-gradient(180deg, #2A2018 0%, #1A140F 100%)',
          borderRadius: 56,
          padding: 10,
          boxShadow:
            '0 40px 80px -30px rgba(0,0,0,0.7), 0 2px 0 1px rgba(255,220,170,0.05) inset, 0 -2px 0 1px rgba(0,0,0,0.4) inset',
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden bg-bg-midnight"
          style={{ borderRadius: 46 }}
        >
          <div
            className="absolute top-[11px] left-1/2 z-40 -translate-x-1/2"
            style={{ width: 120, height: 32, background: '#000', borderRadius: 20 }}
          />
          {children}
        </div>
      </div>
      {label && (
        <div className="font-mono text-[11px] text-paper-mute tracking-[0.5px] uppercase">
          {label}
        </div>
      )}
    </div>
  );
}
