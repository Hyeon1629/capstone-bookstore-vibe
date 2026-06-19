import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, StatusBar } from '@/components/primitives';
import { OnboardingArt } from '@/components/onboarding/OnboardingArt';
import { markOnboardingSeen } from '@/components/AuthGate';

const ONBOARDING_SLIDES = [
  {
    eyebrow: 'DISCOVERY',
    title: '동네에 책방이\n이렇게 많았어요',
    body: '성수동에만 28곳, 합정에 47곳.\n반경 2km, 지도에서 찾아드릴게요.',
    art: 'discovery' as const,
  },
  {
    eyebrow: 'VISIT',
    title: '다녀온 책방의\n스탬프를 모아요',
    body: 'GPS로 자동 인증되는 스탬프.\n오늘의 분위기 한 줄까지 같이.',
    art: 'stamp' as const,
  },
  {
    eyebrow: 'COLLECTION',
    title: '내 동네 책방 지도를\n한 점씩 채워가요',
    body: '방문 기록은 사라지지 않는\n나만의 작은 큐레이션이 됩니다.',
    art: 'shelf' as const,
  },
];

export function OnboardingPage() {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const slide = ONBOARDING_SLIDES[idx];
  const isLast = idx === ONBOARDING_SLIDES.length - 1;

  const goSignup = () => {
    markOnboardingSeen();
    navigate('/signup');
  };

  const goLogin = () => {
    markOnboardingSeen();
    navigate('/login');
  };

  const next = () => {
    if (isLast) goSignup();
    else setIdx(idx + 1);
  };

  return (
    <div className="relative min-h-screen bg-bg-midnight flex flex-col overflow-hidden">
      <StatusBar />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(242,184,114,0.16) 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(232,128,77,0.08) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 flex items-center justify-between px-5 pt-2.5">
        <div className="font-display-en italic text-[14px] text-paper-dim tracking-[0.3px]">
          숨은책방
        </div>
        <button
          onClick={goLogin}
          className="font-ui text-[12.5px] text-paper-mute py-1.5 px-1 font-medium"
        >
          건너뛰기
        </button>
      </div>

      <div className="relative z-[5] flex-1 flex items-center justify-center px-8 min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`art-${idx}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="w-full flex justify-center"
          >
            <OnboardingArt kind={slide.art} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-[5] px-8 pb-2">
        <motion.div
          key={`eye-${idx}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-mono text-[10.5px] text-lamp tracking-[3px] mb-3"
        >
          0{idx + 1} — {slide.eyebrow}
        </motion.div>
        <motion.h1
          key={`t-${idx}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-[28px] font-bold text-paper leading-[1.28] tracking-[-0.8px] whitespace-pre-line m-0"
        >
          {slide.title}
        </motion.h1>
        <motion.p
          key={`b-${idx}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-4 font-ui text-[14px] leading-[1.65] text-paper-dim whitespace-pre-line tracking-tight m-0"
        >
          {slide.body}
        </motion.p>
      </div>

      <div className="relative z-[5] px-6 pt-7 pb-9">
        <div className="flex justify-center gap-1.5 mb-5">
          {ONBOARDING_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="h-1.5 rounded-full transition-all duration-250"
              style={{
                width: i === idx ? 22 : 6,
                background: i === idx ? 'var(--accent-lamp)' : 'var(--hairline-strong)',
              }}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
        <Button onClick={next}>{isLast ? '시작하기' : '다음'}</Button>
        {isLast && (
          <button
            onClick={goLogin}
            className="block w-full mt-3.5 font-ui text-[13px] text-paper-mute"
          >
            이미 계정이 있어요 <span className="text-paper font-semibold">로그인</span>
          </button>
        )}
      </div>
    </div>
  );
}
