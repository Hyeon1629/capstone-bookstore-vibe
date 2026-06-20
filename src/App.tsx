import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthGate } from '@/components/AuthGate';
import { useAuthListener } from '@/hooks/useAuthListener';
import { OnboardingPage } from '@/pages/onboarding';
import { SignupPage } from '@/pages/signup';
import { LoginPage } from '@/pages/login';
import { HomePage } from '@/pages/home';
import { MapPage } from '@/pages/map';
import { BookstoreDetailPage } from '@/pages/bookstore';
import { BookshelfPage } from '@/pages/bookshelf';
import { MyPage } from '@/pages/mypage';
import { useAuthStore } from '@/stores/authStore';

function RequireAuth({ children }: { children: ReactNode }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  if (isAuthLoading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  useAuthListener();

  return (
    <Routes>
      <Route path="/" element={<AuthGate />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      <Route
        path="/map"
        element={
          <RequireAuth>
            <MapPage />
          </RequireAuth>
        }
      />
      <Route
        path="/bookstore/:id"
        element={
          <RequireAuth>
            <BookstoreDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/bookshelf"
        element={
          <RequireAuth>
            <BookshelfPage />
          </RequireAuth>
        }
      />
      <Route
        path="/mypage"
        element={
          <RequireAuth>
            <MyPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
