import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, StatusBar, TextInput } from '@/components/primitives';
import { AuthFlowError, login } from '@/lib/auth';
import { requestLocationPermission } from '@/lib/permission';
import { useMapInitStore } from '@/stores/mapInitStore';

function ChevronLeft({ size = 22 }: { size?: number }) {
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
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const setFallbackArea = useMapInitStore((s) => s.setFallbackArea);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.length > 0 && password.length > 0 && !submitting;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      const granted = await requestLocationPermission();
      if (!granted) setFallbackArea('성수동');
      navigate('/home', { replace: true });
    } catch (err) {
      if (err instanceof AuthFlowError) {
        setError(loginErrorMessage(err.code));
      } else {
        setError('잠시 후 다시 시도해주세요');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-midnight flex flex-col">
      <StatusBar />

      <div
        className="absolute pointer-events-none"
        style={{
          top: -80,
          left: -40,
          width: 320,
          height: 320,
          borderRadius: 999,
          background: 'radial-gradient(circle, rgba(242,184,114,0.16) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 flex items-center px-4 py-2.5">
        <button
          onClick={() => navigate('/onboarding')}
          className="w-9 h-9 flex items-center justify-center text-paper"
          aria-label="뒤로"
        >
          <ChevronLeft />
        </button>
      </div>

      <div className="relative z-[5] flex-1 overflow-y-auto px-6 pb-4">
        <div className="mt-2 mb-8 flex flex-col items-start gap-1">
          <div
            className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-3.5"
            style={{
              background: 'linear-gradient(135deg, var(--accent-lamp), var(--accent-lamp-deep))',
              boxShadow: '0 0 28px rgba(242,184,114,0.4)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#1A1410" aria-hidden>
              <path d="M5 4h11a3 3 0 013 3v13a1 1 0 01-1 1H7a2 2 0 01-2-2V4z" />
              <rect x="3" y="4" width="2.5" height="17" rx="0.5" />
            </svg>
          </div>
          <div className="font-mono text-[10.5px] text-lamp tracking-[3px]">LOG IN · 03</div>
          <h1 className="mt-2 font-display text-[26px] font-bold text-paper leading-[1.25] tracking-[-0.6px] m-0">
            다시 오신 걸 환영해요
          </h1>
          <p className="mt-2 font-ui text-[13.5px] text-paper-dim tracking-tight m-0">
            오늘은 어느 책방에 들러볼까요?
          </p>
        </div>

        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded-input border border-error/40 bg-error/10 text-error font-ui text-[12.5px]">
            {error}
          </div>
        )}

        <TextInput
          label="이메일"
          placeholder="example@email.com"
          value={email}
          onValueChange={setEmail}
          type="email"
          autoComplete="email"
        />
        <TextInput
          label="비밀번호"
          placeholder="비밀번호 입력"
          value={password}
          onValueChange={setPassword}
          type="password"
          autoComplete="current-password"
        />

        <div className="flex justify-between items-center -mt-2">
          <label className="flex items-center gap-2 font-ui text-[12.5px] text-paper-dim">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-[4px] bg-surface-02 border border-hairline-strong">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            자동 로그인
          </label>
          <button
            onClick={() => alert('비밀번호 찾기는 v1에서 제공 예정이에요')}
            className="font-ui text-[12.5px] text-paper-dim font-medium"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      <div className="relative px-6 pb-7 pt-3 bg-bg-midnight">
        <Button onClick={onSubmit} disabled={!canSubmit}>
          {submitting ? '로그인 중...' : '로그인'}
        </Button>
        <p className="mt-3.5 text-center font-ui text-[12.5px] text-paper-mute">
          계정이 없나요?{' '}
          <button onClick={() => navigate('/signup')} className="text-lamp font-bold">
            회원가입 →
          </button>
        </p>
      </div>
    </div>
  );
}

function loginErrorMessage(code: AuthFlowError['code']): string {
  switch (code) {
    case 'WRONG_CREDENTIAL':
      return '이메일 또는 비밀번호가 일치하지 않아요';
    case 'INVALID_EMAIL':
      return '이메일 형식이 올바르지 않아요';
    case 'NETWORK':
      return '연결이 끊겼어요 · 다시 시도해주세요';
    default:
      return '잠시 후 다시 시도해주세요';
  }
}
