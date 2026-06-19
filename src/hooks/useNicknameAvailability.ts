import { useEffect, useState } from 'react';
import { isNicknameTaken } from '@/lib/firestore';
import { suggestNicknames, validateNicknameFormat } from '@/lib/validation';

type Status = 'empty' | 'invalid' | 'checking' | 'taken' | 'available';

export interface NicknameAvailability {
  status: Status;
  message: string;
  suggestions: string[];
}

const DEBOUNCE_MS = 300;

export function useNicknameAvailability(nickname: string): NicknameAvailability {
  const [result, setResult] = useState<NicknameAvailability>({
    status: 'empty',
    message: '',
    suggestions: [],
  });

  useEffect(() => {
    const fmt = validateNicknameFormat(nickname);
    if (fmt.status === 'empty') {
      setResult({ status: 'empty', message: '', suggestions: [] });
      return;
    }
    if (fmt.status === 'error') {
      setResult({ status: 'invalid', message: fmt.message, suggestions: [] });
      return;
    }

    setResult({ status: 'checking', message: '확인 중...', suggestions: [] });

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const taken = await isNicknameTaken(nickname);
        if (cancelled) return;
        if (taken) {
          setResult({
            status: 'taken',
            message: '이미 사용 중이에요',
            suggestions: suggestNicknames(nickname),
          });
        } else {
          setResult({
            status: 'available',
            message: '사용 가능한 닉네임이에요',
            suggestions: [],
          });
        }
      } catch {
        if (cancelled) return;
        setResult({
          status: 'invalid',
          message: '잠시 후 다시 시도해주세요',
          suggestions: [],
        });
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [nickname]);

  return result;
}
