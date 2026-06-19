import { useState } from 'react';

interface PhotoSliderProps {
  photos: string[];
  altPrefix: string;
}

export function PhotoSlider({ photos, altPrefix }: PhotoSliderProps) {
  const [idx, setIdx] = useState(0);

  return (
    <div className="relative w-full h-[320px] overflow-hidden bg-surface-02">
      {photos.map((p, i) => (
        <img
          key={p}
          src={p}
          alt={`${altPrefix} 사진 ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: idx === i ? 1 : 0 }}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(19,23,30,0.55) 0%, rgba(19,23,30,0.2) 18%, rgba(19,23,30,0) 50%, rgba(19,23,30,0.85) 100%)',
        }}
      />

      {/* dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="h-1.5 rounded-full transition-all duration-200"
            style={{
              width: idx === i ? 18 : 6,
              background: idx === i ? 'var(--paper)' : 'rgba(242,234,217,0.4)',
            }}
            aria-label={`사진 ${i + 1}`}
          />
        ))}
      </div>

      {/* counter */}
      <div
        className="absolute right-4 bottom-3.5 font-mono text-[10px] text-paper px-2 py-[3px] rounded-[6px] border border-paper/15 tracking-[0.4px]"
        style={{ background: 'rgba(20,15,10,0.55)' }}
      >
        {idx + 1} / {photos.length}
      </div>
    </div>
  );
}
