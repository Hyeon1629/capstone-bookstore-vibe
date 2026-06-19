import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { StatusBar } from '@/components/primitives';
import { BottomNav } from '@/components/shared/BottomNav';
import { ProfileCard } from '@/components/mypage/ProfileCard';
import { MenuGroup } from '@/components/mypage/MenuGroup';
import { MenuItem } from '@/components/mypage/MenuItem';
import { LogoutDialog } from '@/components/mypage/LogoutDialog';
import { useUserVisits } from '@/hooks/useUserVisits';
import { logout } from '@/lib/auth';
import { getUserProfile } from '@/lib/firestore';
import { useAuthStore } from '@/stores/authStore';

function BellIcon({ size = 17 }: { size?: number }) {
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
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function SettingsIcon({ size = 17 }: { size?: number }) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c0 .39.15.78.43 1.07l.05.05A2 2 0 0121 12a2 2 0 01-1.06 1.76l-.05.05A1.65 1.65 0 0019.4 15z" />
    </svg>
  );
}

function LogoutIcon({ size = 17 }: { size?: number }) {
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
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function isCurrentMonth(date: Date): boolean {
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function MyPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const userId = currentUser?.uid ?? null;

  const [nickname, setNickname] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { data: visits } = useUserVisits(userId);

  useEffect(() => {
    if (!currentUser) return;
    let alive = true;
    getUserProfile(currentUser.uid)
      .then((p) => {
        if (alive && p) setNickname(p.nickname);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [currentUser]);

  const total = visits?.length ?? 0;
  const thisMonth = useMemo(() => {
    if (!visits) return 0;
    return visits.filter((v) => {
      const d = v.visitedAt && typeof v.visitedAt.toDate === 'function' ? v.visitedAt.toDate() : null;
      return d ? isCurrentMonth(d) : false;
    }).length;
  }, [visits]);

  const flashToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2_500);
  };

  const onConfirmLogout = async () => {
    setLogoutBusy(true);
    try {
      await logout();
      setLogoutOpen(false);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
      setLogoutBusy(false);
      flashToast('로그아웃에 실패했어요');
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-midnight flex flex-col">
      <StatusBar />

      <div className="flex-1 overflow-y-auto pb-3">
        <div className="px-5 pt-2 pb-1">
          <div className="font-mono text-[10px] text-paper-mute tracking-[1.5px] uppercase mb-1">
            PROFILE
          </div>
          <h1 className="font-display text-[26px] font-bold text-paper tracking-[-0.6px] leading-[1.2]">
            마이페이지
          </h1>
        </div>

        <div className="px-5 mt-3">
          <ProfileCard
            nickname={nickname ?? ''}
            email={currentUser?.email ?? ''}
            totalVisits={total}
            thisMonthVisits={thisMonth}
          />
        </div>

        <div className="px-5 mt-3">
          <MenuGroup title="설정">
            <MenuItem
              icon={<BellIcon />}
              label="알림 설정"
              right="켜짐"
              onClick={() => flashToast('알림 설정은 v1에서 제공 예정이에요')}
            />
            <MenuItem
              icon={<SettingsIcon />}
              label="앱 정보"
              right="v1.0.0"
              onClick={() => flashToast('대학 과제 시연용 · v1.0.0')}
            />
          </MenuGroup>
        </div>

        <div className="px-5 mt-3">
          <MenuGroup title="계정">
            <MenuItem
              icon={<LogoutIcon />}
              label="로그아웃"
              danger
              onClick={() => setLogoutOpen(true)}
            />
          </MenuGroup>
        </div>

        <div className="text-center px-5 mt-3">
          <div className="font-mono text-[10px] text-paper-mute tracking-[0.5px]">
            숨은 책방 · v1.0.0
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[40] px-4 py-2 rounded-card bg-surface-02 border border-hairline-strong text-paper font-ui text-[12.5px] shadow-warm"
          style={{ top: 90 }}
          role="status"
        >
          {toast}
        </div>
      )}

      <AnimatePresence>
        <LogoutDialog
          key="logout"
          open={logoutOpen}
          busy={logoutBusy}
          onConfirm={onConfirmLogout}
          onCancel={() => !logoutBusy && setLogoutOpen(false)}
        />
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
