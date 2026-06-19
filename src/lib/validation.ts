const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NICKNAME_RE = /^[가-힣a-zA-Z0-9]{2,12}$/;

export type FieldStatus = 'ok' | 'error' | 'info' | 'empty';

export interface FieldResult {
  status: FieldStatus;
  message: string;
}

export function validateEmail(value: string): FieldResult {
  if (!value) return { status: 'empty', message: '' };
  if (!EMAIL_RE.test(value)) {
    return { status: 'error', message: '이메일 형식이 올바르지 않아요' };
  }
  return { status: 'ok', message: '사용 가능한 이메일이에요' };
}

export function validatePassword(value: string): FieldResult {
  if (!value) return { status: 'empty', message: '' };
  if (value.length < 6) {
    return { status: 'error', message: `${value.length}/6 — 6자 이상 입력해주세요` };
  }
  return { status: 'ok', message: '6자 이상 입력됐어요' };
}

export function validateNicknameFormat(value: string): FieldResult {
  if (!value) return { status: 'empty', message: '' };
  if (!NICKNAME_RE.test(value)) {
    return { status: 'error', message: '2~12자 한글·영문·숫자만 사용' };
  }
  return { status: 'ok', message: '' };
}

export function suggestNicknames(base: string): string[] {
  const trimmed = base.slice(0, 10);
  return [`${trimmed}_2`, `${trimmed}1`, `${trimmed}a`];
}
