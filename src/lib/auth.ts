import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
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
    if (err instanceof NicknameTakenError) {
      // Auth 계정은 만들어졌지만 Firestore 트랜잭션 실패
      // 시연 단순화를 위해 Auth 계정은 그대로 두고 에러만 surfacing
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
