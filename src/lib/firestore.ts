import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Bookstore, BookstoreCategory, MoodEmoji } from '@/data/bookstores';

export class NicknameTakenError extends Error {
  constructor() {
    super('NICKNAME_TAKEN');
    this.name = 'NicknameTakenError';
  }
}

export interface UserProfile {
  uid: string;
  email: string;
  nickname: string;
  createdAt: Timestamp;
}

export async function isNicknameTaken(nickname: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, 'nicknames', nickname));
  return snapshot.exists();
}

export async function createUserWithNickname({
  uid,
  email,
  nickname,
}: {
  uid: string;
  email: string;
  nickname: string;
}): Promise<void> {
  await runTransaction(db, async (tx) => {
    const nickRef = doc(db, 'nicknames', nickname);
    const existing = await tx.get(nickRef);
    if (existing.exists()) {
      throw new NicknameTakenError();
    }
    tx.set(nickRef, { userId: uid, createdAt: serverTimestamp() });
    tx.set(doc(db, 'users', uid), {
      email,
      nickname,
      createdAt: serverTimestamp(),
    });
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', uid));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    uid,
    email: data.email,
    nickname: data.nickname,
    createdAt: data.createdAt,
  };
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export interface MoodTagDoc {
  id: string;
  userId: string;
  bookstoreId: string;
  emoji: MoodEmoji;
  createdAt: Timestamp;
}

export async function fetchMoodTags(bookstoreId: string): Promise<MoodTagDoc[]> {
  // 복합 인덱스 회피: bookstoreId 만 서버 where 후 클라이언트 측 7일 필터
  const cutoffMs = Date.now() - SEVEN_DAYS_MS;
  const q = query(collection(db, 'moodTags'), where('bookstoreId', '==', bookstoreId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: data.userId,
        bookstoreId: data.bookstoreId,
        emoji: data.emoji,
        createdAt: data.createdAt,
      } as MoodTagDoc;
    })
    .filter((m) => {
      const ts = m.createdAt;
      return ts && typeof ts.toMillis === 'function' && ts.toMillis() >= cutoffMs;
    });
}

export function aggregateMoodCounts(
  docs: MoodTagDoc[],
): Partial<Record<MoodEmoji, number>> {
  const counts: Partial<Record<MoodEmoji, number>> = {};
  for (const d of docs) {
    counts[d.emoji] = (counts[d.emoji] ?? 0) + 1;
  }
  return counts;
}

// ── 책방 스냅샷 (비정규화) ───────────────────────────────────────────────────
// 시드가 없으므로 책방 정보를 visits/bookmarks 문서에 함께 저장해, 휘발성 카카오
// 스토어 없이도 발자취·상세·북마크가 동작하도록 한다.

function bookstoreSnapshot(b: Bookstore): Record<string, unknown> {
  const snap: Record<string, unknown> = {
    name: b.name,
    category: b.category,
    address: b.address,
    dong: b.dong,
    lat: b.lat,
    lng: b.lng,
    specialtyTags: b.specialtyTags ?? [],
    photos: b.photos ?? [],
  };
  if (b.phone) snap.phone = b.phone; // Firestore 는 undefined 불가 → 있을 때만
  return snap;
}

function bookstoreFromDoc(id: string, data: DocumentData): Bookstore {
  return {
    id,
    name: data.name ?? '',
    category: (data.category as BookstoreCategory) ?? 'bookstore',
    address: data.address ?? '',
    dong: data.dong ?? '',
    lat: data.lat ?? 0,
    lng: data.lng ?? 0,
    phone: data.phone,
    specialtyTags: data.specialtyTags ?? [],
    photos: data.photos ?? [],
  };
}

// ── visits 컬렉션 ──────────────────────────────────────────────────────────

export interface VisitDoc {
  id: string;
  userId: string;
  bookstoreId: string;
  bookstore: Bookstore; // 스냅샷에서 복원
  visitedAt: Timestamp; // 마지막 방문 시각
  visitCount: number; // 총 방문 횟수 (하루 최대 +1)
}

/** 로컬 기준 'YYYY-MM-DD' — 하루 1회 카운트 경계 판정용 */
function localDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function hasVisitedToday({
  userId,
  bookstoreId,
}: {
  userId: string;
  bookstoreId: string;
}): Promise<boolean> {
  // 오늘 이미 카운트됐는지 (사전 체크용) — 같은 책방은 하루 1회만 +1
  const snap = await getDoc(doc(db, 'visits', `${userId}_${bookstoreId}`));
  if (!snap.exists()) return false;
  return snap.data().lastCountedDay === localDayKey();
}

export class DuplicateVisitError extends Error {
  constructor() {
    super('DUPLICATE_VISIT');
    this.name = 'DuplicateVisitError';
  }
}

/**
 * 방문 인증을 원자적으로 기록한다. 책방당 1개의 결정적 visit doc(`${userId}_${bookstoreId}`).
 * 책방 정보 스냅샷을 함께 저장해 이후 카카오 스토어 없이도 복원 가능.
 * - 처음 방문: visitCount=1 로 생성.
 * - 재방문: 같은 날이면 DuplicateVisitError(하루 최대 +1), 다른 날이면 visitCount +1.
 */
export async function recordVisit({
  userId,
  bookstore,
  emoji,
}: {
  userId: string;
  bookstore: Bookstore;
  emoji?: MoodEmoji | null;
}): Promise<void> {
  const today = localDayKey();
  const snap = bookstoreSnapshot(bookstore);
  await runTransaction(db, async (tx) => {
    const visitRef = doc(db, 'visits', `${userId}_${bookstore.id}`);
    const existing = await tx.get(visitRef);
    if (existing.exists()) {
      const data = existing.data();
      if (data.lastCountedDay === today) {
        throw new DuplicateVisitError(); // 오늘 이미 카운트됨
      }
      tx.update(visitRef, {
        ...snap,
        visitCount: (data.visitCount ?? 1) + 1,
        visitedAt: serverTimestamp(),
        lastCountedDay: today,
      });
    } else {
      tx.set(visitRef, {
        userId,
        bookstoreId: bookstore.id,
        ...snap,
        visitCount: 1,
        firstVisitedAt: serverTimestamp(),
        visitedAt: serverTimestamp(),
        lastCountedDay: today,
      });
    }
    if (emoji) {
      const moodRef = doc(collection(db, 'moodTags'));
      tx.set(moodRef, { userId, bookstoreId: bookstore.id, emoji, createdAt: serverTimestamp() });
    }
  });
}

function tsMillis(ts: Timestamp | null | undefined): number {
  if (!ts || typeof ts.toMillis !== 'function') return 0;
  return ts.toMillis();
}

export async function fetchAllUserMoodTags(userId: string): Promise<MoodTagDoc[]> {
  // 복합 인덱스 회피를 위해 orderBy 없이 단일 where 만 사용 + 클라이언트 측 정렬
  const q = query(collection(db, 'moodTags'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      bookstoreId: data.bookstoreId,
      emoji: data.emoji,
      createdAt: data.createdAt,
    } as MoodTagDoc;
  });
  docs.sort((a, b) => tsMillis(b.createdAt) - tsMillis(a.createdAt));
  return docs;
}

export async function fetchUserVisits(userId: string): Promise<VisitDoc[]> {
  // 복합 인덱스 회피를 위해 orderBy 없이 단일 where 만 사용 + 클라이언트 측 정렬
  const q = query(collection(db, 'visits'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      bookstoreId: data.bookstoreId,
      bookstore: bookstoreFromDoc(data.bookstoreId, data),
      visitedAt: data.visitedAt,
      visitCount: data.visitCount ?? 1,
    } as VisitDoc;
  });
  docs.sort((a, b) => tsMillis(b.visitedAt) - tsMillis(a.visitedAt));
  return docs;
}

// ── bookmarks 컬렉션 ───────────────────────────────────────────────────────
// 결정적 doc id = `${userId}_${bookstoreId}` → 멱등 토글, 중복 문서 불가.

function bookmarkId(userId: string, bookstoreId: string): string {
  return `${userId}_${bookstoreId}`;
}

export async function addBookmark({
  userId,
  bookstore,
}: {
  userId: string;
  bookstore: Bookstore;
}): Promise<void> {
  await setDoc(doc(db, 'bookmarks', bookmarkId(userId, bookstore.id)), {
    userId,
    bookstoreId: bookstore.id,
    ...bookstoreSnapshot(bookstore),
    createdAt: serverTimestamp(),
  });
}

export async function removeBookmark({
  userId,
  bookstoreId,
}: {
  userId: string;
  bookstoreId: string;
}): Promise<void> {
  await deleteDoc(doc(db, 'bookmarks', bookmarkId(userId, bookstoreId)));
}

export async function fetchUserBookmarks(userId: string): Promise<string[]> {
  // 복합 인덱스 회피: 단일 where 만 사용 (토글 상태용 — id 만 필요)
  const q = query(collection(db, 'bookmarks'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().bookstoreId as string);
}
