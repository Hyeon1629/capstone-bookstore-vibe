import { useState } from 'react';
import { clsx } from 'clsx';
import type { Bookstore } from '@/data/bookstores';
import { kakaoMapDirectionUrl, shareOrCopy } from '@/lib/share';

interface ActionBarProps {
  bookstore: Bookstore;
}

function PhoneIcon({ size = 16 }: { size?: number }) {
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
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function NavIcon({ size = 16 }: { size?: number }) {
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

function ShareIcon({ size = 16 }: { size?: number }) {
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export function ActionBar({ bookstore }: ActionBarProps) {
  const [toast, setToast] = useState<string | null>(null);

  const onShare = async () => {
    const result = await shareOrCopy({
      title: bookstore.name,
      text: `${bookstore.name} · ${bookstore.address}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    });
    if (result.kind !== 'failed' || result.message !== '공유를 취소했어요') {
      setToast(result.message);
      window.setTimeout(() => setToast(null), 2_000);
    }
  };

  const directionsUrl = kakaoMapDirectionUrl(bookstore.name, bookstore.lat, bookstore.lng);
  const hasPhone = Boolean(bookstore.phone);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex gap-2 px-4 pt-3.5 pb-7 border-t border-hairline"
      style={{ background: 'rgba(19, 23, 30, 0.85)', backdropFilter: 'blur(16px)' }}
    >
      <ActionButton
        as="a"
        href={hasPhone ? `tel:${bookstore.phone}` : undefined}
        icon={<PhoneIcon />}
        label="전화"
        disabled={!hasPhone}
      />
      <ActionButton
        as="a"
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        icon={<NavIcon />}
        label="길찾기"
        primary
      />
      <ActionButton as="button" onClick={onShare} icon={<ShareIcon />} label="공유" />

      {toast && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-card bg-surface-02 border border-hairline-strong text-paper font-ui text-[12.5px] shadow-warm"
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  disabled?: boolean;
} & (
  | { as: 'a'; href?: string; onClick?: never; target?: string; rel?: string }
  | { as: 'button'; onClick?: () => void; href?: never; target?: never; rel?: never }
);

function ActionButton(props: ActionButtonProps) {
  const cls = clsx(
    'flex-1 py-3 rounded-card flex flex-col items-center justify-center gap-1 font-ui text-[12px] font-bold tracking-tight',
    props.primary
      ? 'bg-paper text-bg-midnight hover:bg-paper-soft'
      : 'bg-surface-02 text-paper hover:bg-surface-03',
    props.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
  );

  if (props.as === 'a') {
    return (
      <a className={cls} href={props.href} target={props.target} rel={props.rel}>
        {props.icon}
        {props.label}
      </a>
    );
  }
  return (
    <button className={cls} onClick={props.onClick} disabled={props.disabled}>
      {props.icon}
      {props.label}
    </button>
  );
}
