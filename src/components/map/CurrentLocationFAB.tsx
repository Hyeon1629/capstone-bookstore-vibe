interface CurrentLocationFABProps {
  sheetOpen: boolean;
  onClick: () => void;
}

function NavIcon({ size = 18 }: { size?: number }) {
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
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

export function CurrentLocationFAB({ sheetOpen, onClick }: CurrentLocationFABProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 w-12 h-12 rounded-full bg-surface-02 border border-hairline-strong flex items-center justify-center text-lamp shadow-soft transition-[bottom] duration-250 z-[12]"
      style={{ bottom: sheetOpen ? 168 : 24 }}
      aria-label="현재 위치로 이동"
    >
      <NavIcon />
    </button>
  );
}
