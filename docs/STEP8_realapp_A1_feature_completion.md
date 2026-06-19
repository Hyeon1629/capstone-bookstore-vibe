# STEP8 · 실제 앱화 A1 — 절반 기능 완성

> 데모 → 실제 작동 앱 전환의 첫 코드 STEP.
> 선행: STEP A0(실 Firebase/카카오 연결)은 아직 미완 → **런타임 검증은 A0 이후**, 본 STEP은 코드/타입/린트 레벨까지 검증.

## 0. 목표 & 범위

"절반만 만들어진 기능"을 실제 영속 데이터에 연결해 완결한다. 3개 작업:

1. **북마크 실연동** — `useState` 껍데기 → Firestore `bookmarks` 컬렉션 저장·복원·토글
2. **상세 페이지 방문 표시** — `visited={false}` 하드코딩 → 실제 방문 데이터 반영
3. **방문 중복 트랜잭션화 (최소 C)** — read-then-write 경합 제거, 원자적 24h 중복 방지

**범위 밖 (다음 STEP):** 카카오 실데이터 견고화(B), 보안 규칙 전체(C), 운영 품질(D), 마이페이지 북마크 목록 화면.

---

## 1. 북마크 실연동

### 스키마 추가 (CLAUDE.md Firestore 스키마에 반영)
```
bookmarks
  id           document id = `${userId}_${bookstoreId}` (결정적 id → 멱등·중복 불가)
  userId       string
  bookstoreId  string
  createdAt    timestamp
```
> 결정적 doc id 를 쓰는 이유: 같은 책방 북마크가 중복 문서로 쌓이지 않고, `setDoc`/`deleteDoc` 만으로 토글이 멱등하게 동작.

### `lib/firestore.ts` 추가 함수
- `addBookmark({ userId, bookstoreId })` → `setDoc(doc(db,'bookmarks',id), {...})`
- `removeBookmark({ userId, bookstoreId })` → `deleteDoc(...)`
- `fetchUserBookmarks(userId): Promise<string[]>` → `where('userId','==',userId)` 단일 쿼리 (복합 인덱스 회피), bookstoreId 배열 반환

### `hooks/useUserBookmarks.ts` (신규)
- `useUserBookmarks(userId)` → `useQuery(['bookmarks', userId])`, 반환 `Set<string>` (bookstoreId)
- `staleTime: 30_000` (useUserVisits 와 동일 패턴)

### `pages/bookstore/index.tsx` 수정
- `const [bookmarked, setBookmarked] = useState(false)` 제거
- `useAuthStore` 에서 `currentUser` → `userId`
- `useUserBookmarks(userId)` 로 초기 상태 도출: `bookmarks.has(bookstore.id)`
- 토글 핸들러: 낙관적 업데이트(`queryClient.setQueryData`) → `addBookmark`/`removeBookmark` → 실패 시 롤백 + invalidate
- 비로그인/로딩 시 버튼 disabled 처리

---

## 2. 상세 페이지 방문 표시

### `pages/bookstore/index.tsx` 수정
- `useUserVisits(userId)` 추가 (기존 훅 재사용)
- `const visited = useMemo(() => new Set(visitDocs?.map(v=>v.bookstoreId)).has(bookstore.id), ...)`
- `<BookstoreInfoCard ... visited={visited} />` — 현재 `visited={false}` 하드코딩 교체
- 추가 비용 없음: `BookstoreInfoCard` 는 이미 `visited` prop 으로 "★ 방문 완료" 배지 렌더 (line 125)

---

## 3. 방문 중복 트랜잭션화 (최소 C)

### 문제
현재 `hasRecentVisit`(읽기) → 사용자 mood 입력 → `addVisit`(쓰기) 사이 시간차 + 비원자성.
빠른 재시도·더블탭 시 중복 visit 문서 생성 가능.

### 해결: 가드 문서 + `runTransaction`
```
visitGuards
  id            document id = `${userId}_${bookstoreId}`
  userId        string
  bookstoreId   string
  lastVisitedAt timestamp   ← 마지막 인증 시각
```

`lib/firestore.ts` 신규 `recordVisit`:
```ts
export class DuplicateVisitError extends Error { ... }

export async function recordVisit({ userId, bookstoreId, emoji }): Promise<void> {
  await runTransaction(db, async (tx) => {
    const guardRef = doc(db, 'visitGuards', `${userId}_${bookstoreId}`);
    const guard = await tx.get(guardRef);
    if (guard.exists()) {
      const last = guard.data().lastVisitedAt as Timestamp | undefined;
      if (last && Date.now() - last.toMillis() < DAY_MS) {
        throw new DuplicateVisitError();
      }
    }
    const visitRef = doc(collection(db, 'visits'));
    tx.set(visitRef, { userId, bookstoreId, visitedAt: serverTimestamp() });
    tx.set(guardRef, { userId, bookstoreId, lastVisitedAt: serverTimestamp() });
    if (emoji) {
      const moodRef = doc(collection(db, 'moodTags'));
      tx.set(moodRef, { userId, bookstoreId, emoji, createdAt: serverTimestamp() });
    }
  });
}
```

### 호출부 변경 — `pages/map/index.tsx` `onSubmitMood`
- 기존 `addVisit` + 조건부 `addMoodTag` 2회 호출 → `recordVisit({ userId, bookstoreId, emoji })` 1회
- `DuplicateVisitError` catch 시: 모달 닫고 `duplicateNotice` 표시 (네비게이션 X)
- 성공 시: 기존대로 invalidate + `/bookshelf` 이동

### `useVisitAutoDetect` 의 `hasRecentVisit`
- 모달 띄우기 전 **소프트 사전 체크**로 유지 (UX: 굳이 모달 띄웠다 닫는 낭비 방지)
- 단, 최종 진실은 `recordVisit` 트랜잭션. 기존 `addVisit`/`hasRecentVisit` 함수는 호환 위해 남겨두되, MapPage 흐름은 `recordVisit` 로 일원화

> 참고: Firestore 트랜잭션은 쿼리(`where`)를 못 돌리므로 결정적 가드 doc id 로 단건 `tx.get` 한다. 이게 24h 롤링 중복 방지를 원자적으로 만드는 표준 패턴.

---

## 4. 변경 파일 요약

| 파일 | 변경 |
|------|------|
| `src/lib/firestore.ts` | `addBookmark`/`removeBookmark`/`fetchUserBookmarks`, `recordVisit`+`DuplicateVisitError` 추가 |
| `src/hooks/useUserBookmarks.ts` | 신규 |
| `src/pages/bookstore/index.tsx` | 북마크 실연동 + `visited` 실데이터 |
| `src/pages/map/index.tsx` | `onSubmitMood` → `recordVisit`, 중복 에러 처리 |
| `CLAUDE.md` | Firestore 스키마에 `bookmarks`/`visitGuards` 반영 |

신규 컬렉션 2개: `bookmarks`, `visitGuards`.

---

## 5. 자가 검증 (Verify)

A0(백엔드 연결) 전이라 런타임 불가 → 아래까지 수행:
- [ ] `npm run typecheck` 통과
- [ ] `npm run lint` 통과
- [ ] 북마크 토글 낙관적 업데이트 롤백 경로 코드 리뷰
- [ ] `recordVisit` 트랜잭션 중복 경로 / 성공 경로 코드 리뷰
- [ ] `visited` 배지 렌더 조건 확인

A0 이후 런타임 체크리스트 (다음 STEP에서):
- [ ] 북마크 토글 후 새로고침 → 상태 유지
- [ ] 방문 인증 → 상세 진입 시 "방문 완료" 배지
- [ ] 같은 책방 24h 내 재인증 → 중복 알림

---

## 6. 승인 요청

위 설계대로 진행할지 확인 부탁드립니다. 특히:
1. 신규 컬렉션 2개(`bookmarks`, `visitGuards`) 추가 — 동의하시나요?
2. 북마크 목록을 보여줄 화면(마이페이지 등)은 이번 범위에서 제외, 다음 STEP — 괜찮나요?
