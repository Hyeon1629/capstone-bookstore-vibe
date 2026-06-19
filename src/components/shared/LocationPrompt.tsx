import { useState } from 'react';
import { StatusBar } from '@/components/primitives';
import { BottomNav } from '@/components/shared/BottomNav';
import { requestLocationPermission } from '@/lib/permission';

function LocationIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

/** GPS 위치가 없을 때 보여주는 위치 권한 안내 화면. 허용하면 useGeolocation 이 위치를 받아 화면이 전환된다. */
export function LocationPrompt({ title = '위치를 켜주세요' }: { title?: string }) {
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);

  const onAllow = async () => {
    setBusy(true);
    const granted = await requestLocationPermission();
    setBusy(false);
    setDenied(!granted);
  };

  return (
    <div className="relative min-h-screen bg-bg-midnight flex flex-col">
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-lamp mb-4"
          style={{ background: 'rgba(242,184,114,0.1)', border: '1px solid rgba(242,184,114,0.3)' }}
        >
          <LocationIcon />
        </div>
        <h1 className="font-display text-[22px] font-bold text-paper tracking-[-0.4px] mb-2">
          {title}
        </h1>
        <p className="font-ui text-[13px] text-paper-mute leading-relaxed mb-6 max-w-[260px]">
          내 주변 책방을 거리순으로 찾아드리려면 위치 권한이 필요해요.
        </p>
        <button
          type="button"
          onClick={onAllow}
          disabled={busy}
          className="px-6 py-3 rounded-btn bg-paper text-bg-midnight font-ui text-[14px] font-bold hover:bg-paper-soft transition-colors disabled:opacity-50"
        >
          {busy ? '확인 중...' : '위치 허용하기'}
        </button>
        {denied && (
          <p className="mt-4 font-ui text-[11.5px] text-paper-mute leading-relaxed max-w-[260px]">
            권한이 거부됐어요. 브라우저·기기 설정에서 이 사이트의 위치 권한을 허용해 주세요.
          </p>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
