interface DemoModeBadgeProps {
  visible: boolean;
}

export function DemoModeBadge({ visible }: DemoModeBadgeProps) {
  if (!visible) return null;
  return (
    <div className="absolute right-5 top-[60px] z-[18] px-2.5 py-1 rounded-full border border-lamp/40 bg-bg-midnight/80 backdrop-blur font-mono text-[9.5px] tracking-[2px] uppercase text-lamp flex items-center gap-1.5">
      <span className="w-[6px] h-[6px] rounded-full bg-lamp animate-pulse" aria-hidden />
      DEMO · 시연 모드
    </div>
  );
}
