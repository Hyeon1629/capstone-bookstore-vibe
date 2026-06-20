import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserWithNickname, NicknameTakenError } from './firestore';

let persistenceInitialized = false;

export async function ensurePersistence(): Promise<void> {
  if (persistenceInitialized) return;
  await setPersistence(auth, browserLocalPersistence);
  persistenceInitialized = true;
}

export type AuthErrorCode =
  | 'EMAIL_IN_USE'
  | 'INVALID_EMAIL'
  | 'WEAK_PASSWORD'
  | 'WRONG_CREDENTIAL'
  | 'NETWORK'
  | 'NICKNAME_TAKEN'
  | 'UNKNOWN';

export class AuthFlowError extends Error {
  constructor(public code: AuthErrorCode, public original?: unknown) {
    super(code);
    this.name = 'AuthFlowError';
  }
}

function mapFirebaseError(err: unknown): AuthFlowError {
  const code = (err as { code?: string }).code;
  switch (code) {
    case 'auth/email-already-in-use':
      return new AuthFlowError('EMAIL_IN_USE', err);
    case 'auth/invalid-email':
      return new AuthFlowError('INVALID_EMAIL', err);
    case 'auth/weak-password':
      return new AuthFlowError('WEAK_PASSWORD', err);
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return new AuthFlowError('WRONG_CREDENTIAL', err);
    case 'auth/network-request-failed':
      return new AuthFlowError('NETWORK', err);
    default:
      return new AuthFlowError('UNKNOWN', err);
  }
}

export async function register({
  email,
  password,
  nickname,
}: {
  email: string;
  password: string;
  nickname: string;
}): Promise<User> {
  await ensurePersistence();
  let cred;
  try {
    cred = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw mapFirebaseError(err);
  }

  try {
    await createUserWithNickname({
      uid: cred.user.uid,
      email,
      nickname,
    });
  } catch (err) {
    // 프로필 생성 실패 시 방금 만든 Auth 계정은 프로필 없는 orphan 이 된다.
    // 정리해 두지 않으면 같은 이메일 재가입 시 EMAIL_IN_USE 로 막힌다 (방금 만든
    // 계정이라 재인증 없이 즉시 삭제 가능). 삭제 자체 실패는 무시하고 원인 에러를 surfacing.
    await deleteUser(cred.user).catch(() => undefined);
    if (err instanceof NicknameTakenError) {
      throw new AuthFlowError('NICKNAME_TAKEN', err);
    }
    throw mapFirebaseError(err);
  }

  return cred.user;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> {
  await ensurePersistence();
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (err) {
    throw mapFirebaseError(err);
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function watchAuthState(cb: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, cb);
}
