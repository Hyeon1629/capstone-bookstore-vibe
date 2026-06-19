import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const ONBOARDING_SEEN_KEY = 'onboardingSeen';

export function AuthGate() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  if (isAuthLoading) {
    return <AuthSplash />;
  }

  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  const onboardingSeen =
    typeof window !== 'undefined' &&
    window.localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true';
  return <Navigate to={onboardingSeen ? '/login' : '/onboarding'} replace />;
}

function AuthSplash() {
  return (
    <div className="min-h-screen bg-bg-midnight flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lamp to-lamp-deep flex items-center justify-center shadow-glow">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#1A1410" aria-hidden>
            <path d="M5 4h11a3 3 0 013 3v13a1 1 0 01-1 1H7a2 2 0 01-2-2V4z" />
            <rect x="3" y="4" width="2.5" height="17" rx="0.5" />
          </svg>
        </div>
        <div className="font-mono text-[10px] text-paper-mute tracking-[2.5px] uppercase">
          Hidden Bookshop
        </div>
      </div>
    </div>
  );
}

export function markOnboardingSeen(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
}
