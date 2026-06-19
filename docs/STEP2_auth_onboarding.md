# STEP 2 — 인증 흐름 + 온보딩 (설계 문서)

> Plan 단계 산출물. 사용자 승인 후 본 명세대로 구현한다.

---

## 1. 라우팅 구조

`react-router-dom` v6 의 nested routes 패턴을 사용한다.

| 경로 | 컴포넌트 | 가드 |
|---|---|---|
| `/` | `<AuthGate>` (auto-redirect dispatcher) | Firebase Auth 상태 결정 후 분기 |
| `/onboarding` | `OnboardingScreen` | 비로그인 + `localStorage.onboardingSeen !== 'true'` |
| `/signup` | `SignupScreen` | 비로그인 |
| `/login` | `LoginScreen` | 비로그인 |
| `/map` | placeholder (STEP 3 에서 본격 구현) | 로그인 |
| `*` | 404 → `/` redirect | — |

### `/` 자동 라우팅 결정 트리

```
사용자 진입
  └─ onAuthStateChanged 첫 emit 까지 대기 (로딩 스피너)
      ├─ user 존재 → /map
      └─ user null
          ├─ localStorage.onboardingSeen === 'true' → /login
          └─ else → /onboarding
```

`onboardingSeen` 은 첫 온보딩 완료 시점에 set 한다. Firestore 가 아닌 localStorage 인 이유: 사용자 식별 전 단계라 Firestore 에 저장 불가, 그리고 디바이스 단위 1회 노출이 의도된 동작이다 (`CLAUDE.md` 의 "localStorage 사용 금지" 제약은 사용자 데이터 한정 — 익명 UI 상태는 예외 명시).

### `/preview` 라우트
STEP 1 종료 시 약속대로 STEP 2 에서 제거. `App.tsx` 라우터에서 `<Route path="/preview">` 삭제, `src/pages/preview/` 디렉토리 삭제.

---

## 2. Firebase 인증 흐름 명세

### 회원가입 시퀀스 (`lib/auth.ts: register`)

```ts
async function register({ email, password, nickname }): Promise<User> {
  // 1) nicknames/{nickname} 문서 사전 체크 (UX: 빠른 실패)
  //    실시간 검증에서 이미 막혀야 하지만 race condition 대비
  // 2) createUserWithEmailAndPassword(auth, email, password)
  // 3) runTransaction:
  //    - read nicknames/{nickname} → 존재 시 throw 'NICKNAME_TAKEN'
  //    - write nicknames/{nickname} = { userId: uid, createdAt: now }
  //    - write users/{uid} = { email, nickname, createdAt: now }
  // 4) 위치 권한 요청 trigger
  // 5) navigate('/map')
}
```

### 로그인 시퀀스 (`lib/auth.ts: login`)
- `signInWithEmailAndPassword(auth, email, password)`
- 성공 시 위치 권한 요청 → `navigate('/map')`
- 실패 시 `error.code` 에 따라 한국어 메시지 매핑

### 자동 로그인
- Firebase Auth 의 `setPersistence(auth, browserLocalPersistence)` 로 디바이스 영속화
- `onAuthStateChanged` 리스너가 `<AuthGate>` 진입 시 사용자 상태 복원

### 로그아웃
- `signOut(auth)` → `<AuthGate>` 가 자동으로 `/login` 으로 redirect
- 마이페이지 로그아웃은 STEP 6 에서 구현. STEP 2 에서는 `lib/auth.ts: logout` 함수만 export.

---

## 3. 입력 검증 (실시간)

### 이메일
- 정규식: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- OK: "사용 가능한 이메일이에요"
- 형식 오류: "이메일 형식이 올바르지 않아요"

### 비밀번호
- 6자 이상
- 카운터 표시: `${value.length}/6` (현재 길이가 6 미만일 때만)
- OK: "6자 이상 입력됐어요"
- 부족: `${length}/6 — 6자 이상 입력해주세요`

### 닉네임 (가장 복잡)
- 형식: 2~12자, 한글/영문/숫자 (`/^[가-힣a-zA-Z0-9]{2,12}$/`)
- 형식 통과 후 300ms debounce → Firestore `nicknames/{nickname}` getDoc
- 상태:
  - 형식 오류: "2~12자 한글·영문·숫자만 사용"
  - 검사 중: "확인 중..." (status: 'info')
  - 중복: "이미 사용 중이에요" + 대안 제안 (`서연_2`, `서연1`, `서연a`)
  - 통과: "사용 가능한 닉네임이에요" (status: 'ok')

#### 대안 닉네임 생성 알고리즘
```ts
function suggestNicknames(base: string): string[] {
  // base 가 12자에 가까우면 절단
  const trimmed = base.slice(0, 10);
  return [`${trimmed}_2`, `${trimmed}1`, `${trimmed}a`];
}
```
(시연용 단순 휴리스틱. 제안된 후보도 잠재적으로 중복일 수 있으나 학교 과제 범위에서는 사용자에게 보여주기만 함.)

### [가입하기] 버튼 활성 조건
세 필드 모두 `status === 'ok'` 일 때만 활성화. 그 외 disabled.

---

## 4. 닉네임 중복 검증 — Race Condition 방지

`nicknames` 컬렉션의 **document id 로 nickname 자체를 사용**하여 atomic 보장:

```
nicknames/
  서연 → { userId: "abc123", createdAt: ts }
  지원 → { userId: "def456", createdAt: ts }
```

회원가입 트랜잭션에서:
```ts
await runTransaction(db, async (tx) => {
  const nickRef = doc(db, 'nicknames', nickname);
  const existing = await tx.get(nickRef);
  if (existing.exists()) throw new Error('NICKNAME_TAKEN');
  tx.set(nickRef, { userId: uid, createdAt: serverTimestamp() });
  tx.set(doc(db, 'users', uid), { email, nickname, createdAt: serverTimestamp() });
});
```

실시간 검증의 getDoc 은 UX 용이고, 진짜 race 방지는 트랜잭션이 한다.

---

## 5. 에러 핸들링 매핑

| Firebase error.code | 한국어 메시지 | UI |
|---|---|---|
| `auth/email-already-in-use` | "이미 가입된 이메일이에요" | 이메일 인풋 error |
| `auth/invalid-email` | "이메일 형식이 올바르지 않아요" | 이메일 인풋 error |
| `auth/weak-password` | "비밀번호는 6자 이상이어야 해요" | 비번 인풋 error |
| `auth/invalid-credential` / `auth/wrong-password` / `auth/user-not-found` | "이메일 또는 비밀번호가 일치하지 않아요" | 두 인풋 모두 error |
| `auth/network-request-failed` | "연결이 끊겼어요" | 상단 토스트 |
| `NICKNAME_TAKEN` (커스텀) | "이미 사용 중이에요" + 대안 | 닉네임 인풋 error |
| 그 외 | "잠시 후 다시 시도해주세요" | 상단 토스트 |

토스트는 `react-router-dom` 의 상태 또는 zustand 의 transient 알림. 본 STEP 에서는 간단히 컴포넌트 로컬 `useState` 로 처리 (STEP 5 의 분위기 입력 시 본격 토스트 라이브러리 도입 고려).

---

## 6. 온보딩 슬라이드

`reference/claude_design/03_screens_onboarding_signup_login.jsx` 의 `ONBOARDING_SLIDES` 데이터 (3개 슬라이드) 그대로 사용.

```ts
const ONBOARDING_SLIDES = [
  { eyebrow: 'DISCOVERY', title: '동네에 책방이\n이렇게 많았어요', body: '...', art: 'discovery' },
  { eyebrow: 'VISIT', title: '다녀온 책방의\n스탬프를 모아요', body: '...', art: 'stamp' },
  { eyebrow: 'COLLECTION', title: '내 동네 책방 지도를\n한 점씩 채워가요', body: '...', art: 'shelf' },
];
```

### 인터랙션
- 좌우 스와이프 (Framer Motion `<motion.div drag="x">`) 또는 [다음] 버튼
- 페이지 인디케이터: 활성은 width 22px 로 늘어남 (250ms ease)
- eyebrow / title / body 가 fadeUp staggered (0.35 / 0.4 / 0.45s delay, translateY 8→0) — Framer Motion `variants`
- 마지막 슬라이드의 CTA: "시작하기" → `/signup`
- 우상단 [건너뛰기] → `/login`

### 일러스트
원본의 `discovery` (다크 지도 카드 + 핀들 + 사용자 위치), `stamp` (종이 노트 + 황금 스탬프), `shelf` (책장 + 펜던트 조명) SVG 추상 일러스트 3종을 그대로 재현. `src/components/onboarding/OnboardingArt.tsx` 에 분리.

---

## 7. 위치 권한 요청

### 요청 시점
- 회원가입 성공 직후 (트랜잭션 완료 후)
- 로그인 성공 직후

### 동작
- `navigator.geolocation.getCurrentPosition` 호출. 권한 모달이 OS 레벨에서 뜸
- **결과는 STEP 2 에서 저장하지 않는다.** 단순 권한 trigger 용
- 허용 시: 자연스럽게 `/map` 으로 이동
- 거부 시: zustand `mapStore` (STEP 3 에서 본격 생성) 또는 임시 `mapInitStore` 에 `fallbackArea: '성수동'` 저장. STEP 2 에서는 이 store 의 skeleton 만 만들고 STEP 3 에서 확장
- 사용자에게 보여지는 모달: **OS 권한 모달만** 의존. 거부 후 별도 안내 모달은 STEP 5 (GPS 인증) 에서 본격 처리. STEP 2 는 trigger 만.

### 구현 위치
`src/lib/permission.ts` 에 `requestLocationPermission(): Promise<boolean>` 헬퍼 export. 회원가입·로그인 핸들러에서 호출.

---

## 8. 상태 관리

### `src/stores/authStore.ts` (zustand)

```ts
interface AuthState {
  currentUser: User | null;
  isAuthLoading: boolean;
  setCurrentUser: (u: User | null) => void;
  setAuthLoading: (b: boolean) => void;
}
```

**역할 분담**:
- Firebase Auth (`auth.currentUser` + `onAuthStateChanged`) = Source of Truth
- `authStore` = React 컴포넌트가 구독 가능한 wrapper
- `<AuthGate>` 가 마운트 시 `onAuthStateChanged` 리스너 설치 → store 갱신

### `src/stores/mapInitStore.ts` (skeleton)
```ts
interface MapInitState {
  fallbackArea: string | null;
  setFallbackArea: (s: string | null) => void;
}
```
STEP 3 에서 본 `mapStore` 로 통합.

---

## 9. Firestore 헬퍼 (`src/lib/firestore.ts`)

STEP 2 에서는 다음만 export. STEP 4·5 에서 visits/moodTags 추가.

```ts
export async function isNicknameTaken(nickname: string): Promise<boolean>;
export async function createUserWithNickname(args: { uid, email, nickname }): Promise<void>; // runTransaction
export async function getUserProfile(uid: string): Promise<UserProfile | null>;
```

---

## 10. 비주얼 재현 — 디자인 시안

`reference/claude_design/03_screens_onboarding_signup_login.jsx` 의 비주얼을 정확히 재현:

- 다크 베이스 + 따뜻한 펜던트 글로우 (회원가입은 우상단 320px radial, 로그인은 좌상단)
- 헤더 카피: "작은 책방의 발견, 서연 님의 책장을 만들어요." (Gowun Batang 26px / -0.6 letterspacing)
  - 닉네임 입력 시 placeholder `서연` 부분을 동적으로 사용자 입력값 또는 기본값으로
- eyebrow: `SIGN UP · 02` / `LOG IN · 03` (IBM Plex Mono, lamp 색, letter-spacing 3)
- 동의 박스 + 약관/개인정보처리방침 링크 (시연용 — 실제 페이지는 없음. 클릭 시 "v1 에서 제공 예정" 토스트만)
- 로그인 화면의 책 아이콘 로고 (lamp 그라데이션 + glow)
- 자동 로그인 체크박스 + 비밀번호 찾기 링크 (시연용)

### Framer Motion 사용
- 페이지 진입 시 staggered fadeUp
- 온보딩 슬라이드 전환 시 `AnimatePresence` + key change

---

## 11. 수정·생성 파일 목록

### 생성
- `src/pages/onboarding/index.tsx`
- `src/pages/signup/index.tsx`
- `src/pages/login/index.tsx`
- `src/pages/map/index.tsx` (placeholder — STEP 3 에서 본격 구현)
- `src/components/onboarding/OnboardingArt.tsx` (3종 SVG 일러스트)
- `src/components/AuthGate.tsx` (라우트 가드)
- `src/lib/auth.ts` (Firebase Auth 래퍼: register, login, logout, watchAuthState)
- `src/lib/firestore.ts` (nicknames/users 헬퍼)
- `src/lib/permission.ts` (위치 권한 요청 헬퍼)
- `src/lib/validation.ts` (이메일·비번·닉네임 검증 + 대안 제안)
- `src/stores/authStore.ts`
- `src/stores/mapInitStore.ts`
- `src/hooks/useNicknameAvailability.ts` (300ms debounce + Firestore 체크)

### 수정
- `src/App.tsx` — `/preview` 제거, AuthGate 진입점 + 4개 라우트 추가
- `src/main.tsx` — Firebase Auth persistence 초기화 (`setPersistence(auth, browserLocalPersistence)`)
- `IMPLEMENTATION_LOG.md` — STEP 2 완료 표시

### 삭제
- `src/pages/preview/` 디렉토리 전체
- `src/components/shared/PhoneFrame.tsx` — preview 외 사용처 없음. 단, STEP 3·4 폰 프레임 데모용으로 보존 의견 있으면 유지 검토

---

## 12. STEP 2 자가 검증

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) 라우팅 파일 존재
test -f src/pages/onboarding/index.tsx
test -f src/pages/signup/index.tsx
test -f src/pages/login/index.tsx
test -f src/components/AuthGate.tsx
test -f src/lib/auth.ts
test -f src/lib/firestore.ts

# 3) 4개 경로 라우터에 등록
grep -E "path=['\"]/(onboarding|signup|login|map)['\"]" src/App.tsx | wc -l
# → 4

# 4) Firebase Auth 호출이 lib/auth.ts 안에서만 일어나는가
grep -r "createUserWithEmailAndPassword\|signInWithEmailAndPassword" src/ | grep -v "src/lib/auth.ts" | wc -l
# → 0

# 5) Dev 서버 200 응답
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
# → 200

# 6) 수동 시연 시나리오 (README_TEST.md 생성)
#    - 신규 가입 → /map placeholder 진입
#    - 로그아웃 후 다시 진입 → /login 표시 (onboarding 스킵)
#    - 잘못된 비번 로그인 → 에러 메시지
#    - 닉네임 중복 시도 → 대안 제안
```

---

## 13. Firebase 콘솔 사전 작업 (사용자 확인 필요)

이미 키를 받았으니 다음 두 가지가 콘솔에서 완료되어 있어야 함:

1. **Authentication → Email/Password 활성화**
2. **Firestore Database 생성** — 위치 `asia-northeast3` (서울), 시작은 **테스트 모드** (30일간 모든 read/write 허용)

> 테스트 모드 30일 후 보안 규칙이 강제됨. 학교 과제 시연 종료까지는 테스트 모드 유지 가정.

미완료 시 회원가입 시도하면 `auth/configuration-not-found` 또는 Firestore permission-denied 발생 → 사용자에게 콘솔 설정 가이드.

---

## 14. 권장 커밋 메시지

```
feat(auth): 회원가입/로그인/온보딩 + 위치 권한 요청
```

---

## 15. 승인 필요 사항

1. **`onboardingSeen` localStorage 키**: 사용자 데이터가 아닌 디바이스 UI 상태로 분류해 예외 인정. OK?
2. **PhoneFrame 보존 여부**: STEP 3·4 데모용으로 남겨둘지, 함께 삭제할지 (남기는 쪽 권장 — 추후 시연 도구로 활용)
3. **약관·개인정보처리방침 페이지**: 실제 페이지 없이 토스트만으로 대체 OK? (학교 과제 범위)
4. **이메일 인증 메일 / 비밀번호 찾기**: 시연 범위 외 — 회원가입 시 즉시 활성 / 비밀번호 찾기 링크는 클릭 시 "v1 제공 예정" 토스트만
5. **테스트 계정**: 시연 직전 `test@test.com` / `test1234` / `서연` 1개 미리 생성. 본 STEP 자동 생성 대신 시연 직전 수동 가입으로?

승인이 떨어지면 위 순서대로 lib 헬퍼 → store → 라우터 가드 → 3개 화면 → /preview 제거 → 자가 검증을 수행한다.
