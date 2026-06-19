import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, StatusBar, TextInput } from '@/components/primitives';
import { useNicknameAvailability } from '@/hooks/useNicknameAvailability';
import { AuthFlowError, register } from '@/lib/auth';
import { requestLocationPermission } from '@/lib/permission';
import { validateEmail, validatePassword } from '@/lib/validation';
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

export function SignupPage() {
  const navigate = useNavigate();
  const setFallbackArea = useMapInitStore((s) => s.setFallbackArea);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);

  const emailResult = useMemo(() => validateEmail(email), [email]);
  const passwordResult = useMemo(() => validatePassword(password), [password]);
  const nicknameAvail = useNicknameAvailability(nickname);

  const allOk =
    emailResult.status === 'ok' &&
    passwordResult.status === 'ok' &&
    nicknameAvail.status === 'available' &&
    !submitting;

  const onSubmit = async () => {
    if (!allOk) return;
    setTopError(null);
    setSubmitting(true);
    try {
      await register({ email, password, nickname });
      const granted = await requestLocationPermission();
      if (!granted) setFallbackArea('성수동');
      navigate('/home', { replace: true });
    } catch (err) {
      if (err instanceof AuthFlowError) {
        setTopError(authErrorMessage(err.code));
      } else {
        setTopError('잠시 후 다시 시도해주세요');
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
          top: -100,
          right: -40,
          width: 320,
          height: 320,
          borderRadius: 999,
          background: 'radial-gradient(circle, rgba(242,184,114,0.18) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 flex items-center px-4 py-2.5">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center text-paper"
          aria-label="뒤로"
        >
          <ChevronLeft />
        </button>
      </div>

      <div className="relative z-[5] flex-1 overflow-y-auto px-6 pb-4">
        <div className="font-mono text-[10.5px] text-lamp tracking-[3px] mb-2.5">
          SIGN UP · 02
        </div>
        <h1 className="font-display text-[26px] font-bold text-paper leading-[1.25] tracking-[-0.6px] m-0">
          작은 책방의 발견,
          <br />
          {nickname || '서연'} 님의 책장을 만들어요.
        </h1>
        <p className="mt-2.5 mb-7 font-ui text-[13.5px] text-paper-dim leading-[1.6] tracking-tight">
          이메일과 비밀번호만 있으면 시작할 수 있어요.
        </p>

        {topError && (
          <div className="mb-4 px-3.5 py-2.5 rounded-input border border-error/40 bg-error/10 text-error font-ui text-[12.5px]">
            {topError}
          </div>
        )}

        <TextInput
          label="이메일"
          placeholder="example@email.com"
          value={email}
          onValueChange={setEmail}
          type="email"
          autoComplete="email"
          validation={
            emailResult.status === 'empty'
              ? undefined
              : { status: emailResult.status, message: emailResult.message }
          }
        />
        <TextInput
          label="비밀번호"
          placeholder="6자 이상"
          value={password}
          onValueChange={setPassword}
          type="password"
          autoComplete="new-password"
          validation={
            passwordResult.status === 'empty'
              ? undefined
              : { status: passwordResult.status, message: passwordResult.message }
          }
        />
        <TextInput
          label="닉네임"
          placeholder="2~12자, 한글/영문/숫자"
          value={nickname}
          onValueChange={setNickname}
          autoComplete="off"
          validation={mapNicknameToValidation(nicknameAvail)}
        />

        {nicknameAvail.status === 'taken' && nicknameAvail.suggestions.length > 0 && (
          <div className="-mt-2 mb-4 flex flex-wrap gap-2 items-center">
            <span className="font-ui text-[11px] text-paper-mute">대안:</span>
            {nicknameAvail.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setNickname(s)}
                className="px-2.5 py-1 rounded-full border border-hairline bg-surface-02 text-paper-dim font-ui text-[11.5px] hover:border-lamp hover:text-paper"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <ConsentBox />
      </div>

      <div className="relative px-6 pb-7 pt-3 bg-bg-midnight border-t border-hairline">
        <Button onClick={onSubmit} disabled={!allOk}>
          {submitting ? '가입 중...' : '가입하고 시작하기'}
        </Button>
        <p className="mt-3.5 text-center font-ui text-[12.5px] text-paper-mute">
          이미 계정이 있나요?{' '}
          <button onClick={() => navigate('/login')} className="text-lamp font-bold">
            로그인 →
          </button>
        </p>
      </div>
    </div>
  );
}

function ConsentBox() {
  return (
    <div className="flex items-start gap-2.5 px-3.5 py-3 mt-3 bg-surface-01 border border-hairline rounded-card">
      <div
        className="w-4 h-4 rounded-[4px] bg-lamp flex items-center justify-center text-bg-midnight shrink-0 mt-0.5"
        aria-hidden
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="flex-1 font-ui text-[11.5px] text-paper-dim leading-[1.55] tracking-tight">
        <button
          type="button"
          className="text-paper underline-offset-2 hover:underline"
          onClick={() => alert('약관 페이지는 v1에서 제공 예정이에요')}
        >
          이용약관
        </button>{' '}
        및{' '}
        <button
          type="button"
          className="text-paper underline-offset-2 hover:underline"
          onClick={() => alert('개인정보처리방침은 v1에서 제공 예정이에요')}
        >
          개인정보처리방침
        </button>
        에 동의합니다.
        <br />
        가입 후 위치 권한을 요청해요.
      </div>
    </div>
  );
}

function mapNicknameToValidation(a: ReturnType<typeof useNicknameAvailability>) {
  switch (a.status) {
    case 'empty':
      return undefined;
    case 'checking':
      return { status: 'info' as const, message: a.message };
    case 'available':
      return { status: 'ok' as const, message: a.message };
    case 'invalid':
    case 'taken':
      return { status: 'error' as const, message: a.message };
  }
}

function authErrorMessage(code: AuthFlowError['code']): string {
  switch (code) {
    case 'EMAIL_IN_USE':
      return '이미 가입된 이메일이에요';
    case 'INVALID_EMAIL':
      return '이메일 형식이 올바르지 않아요';
    case 'WEAK_PASSWORD':
      return '비밀번호는 6자 이상이어야 해요';
    case 'NICKNAME_TAKEN':
      return '이미 사용 중인 닉네임이에요';
    case 'NETWORK':
      return '연결이 끊겼어요 · 다시 시도해주세요';
    default:
      return '잠시 후 다시 시도해주세요';
  }
}
