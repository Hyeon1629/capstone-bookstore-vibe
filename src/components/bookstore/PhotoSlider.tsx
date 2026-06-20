import { useState } from 'react';

interface PhotoSliderProps {
  photos: string[];
  altPrefix: string;
}

export function PhotoSlider({ photos, altPrefix }: PhotoSliderProps) {
  const [idx, setIdx] = useState(0);

  // 사진이 없으면(카카오 미제공 + og:image 크롤링 실패 등) 빈 슬라이더 대신 플레이스홀더
  if (photos.length === 0) {
    return (
      <div className="relative w-full h-[320px] overflow-hidden bg-surface-02 flex items-center justify-center">
        <div className="font-mono text-[11px] text-paper-mute tracking-[0.4px]">
          사진 준비 중
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(19,23,30,0.55) 0%, rgba(19,23,30,0) 50%, rgba(19,23,30,0.85) 100%)',
          }}
        />
      </div>
    );
  }

  // idx 가 범위를 벗어나면(데이터 변경 등) 0 으로 보정
  const safeIdx = idx < photos.length ? idx : 0;
  const multiple = photos.length > 1;

  return (
    <div className="relative w-full h-[320px] overflow-hidden bg-surface-02">
      {photos.map((p, i) => (
        <img
          key={p}
          src={p}
          alt={`${altPrefix} 사진 ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: safeIdx === i ? 1 : 0 }}
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

      {/* dots — 2장 이상일 때만 */}
      {multiple && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="h-1.5 rounded-full transition-all duration-200"
              style={{
                width: safeIdx === i ? 18 : 6,
                background: safeIdx === i ? 'var(--paper)' : 'rgba(242,234,217,0.4)',
              }}
              aria-label={`사진 ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* counter — 2장 이상일 때만 */}
      {multiple && (
        <div
          className="absolute right-4 bottom-3.5 font-mono text-[10px] text-paper px-2 py-[3px] rounded-[6px] border border-paper/15 tracking-[0.4px]"
          style={{ background: 'rgba(20,15,10,0.55)' }}
        >
          {safeIdx + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
