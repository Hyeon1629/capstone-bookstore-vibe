# 숨은 책방 — Claude Code 단계별 실행 프롬프트

> **이 문서 사용법**
> 1. 새 Claude Code 세션 시작 (`cd ~/projects && mkdir hidden-bookstore && cd hidden-bookstore`)
> 2. 이 파일과 다음 산출물들을 프로젝트에 함께 둔다:
>    - `docs/Phase1_1차_사용자관점.md`
>    - `docs/Phase1_2차_제품정의.md`
>    - `docs/Phase2_와이어프레임.jsx`
>    - `docs/Phase3_ClaudeDesign_핸드오프.md`
>    - `reference/claude_design/*.jsx` (디자인 시안 추출본 7개 파일)
> 3. 각 STEP의 **🎯 Claude Code 프롬프트** 블록을 순서대로 복사·붙여넣기
>
> **핵심 원칙**: 모든 STEP은 **Plan(설계 문서) → Approve(사용자 승인) → Implement(구현) → Verify(자가 검증) → Commit** 5단계를 따른다.

---

## 📌 워크플로우 개요

```
STEP 0  ─ 글로벌 컨텍스트 (CLAUDE.md + IMPLEMENTATION_LOG.md)
   │
STEP 1  ─ 프로젝트 셋업 + 디자인 시스템 (토큰, 폰트, primitives)
STEP 2  ─ 인증 흐름 (F-01 회원가입/로그인 + F-02 온보딩)
STEP 3  ─ 지도 홈 (F-03) ⭐ 가장 중요
STEP 4  ─ 책방 상세 (F-04)
STEP 5  ─ GPS 방문 인증 + 분위기 입력 (F-05 + F-06)
STEP 6  ─ 마이 북쉘프 + 마이페이지 (F-07 + SC-08)
STEP 7  ─ Capacitor Android 패키징 (Android Studio AVD)
```

각 STEP은 **기능 단위**로 격리되어 다른 STEP과 분리된 채 개발·롤백 가능합니다.

---

## 📌 사전 준비

Claude Code 시작 전 다음이 준비되어 있어야 합니다.

```bash
# 1. 환경 체크
node --version    # v20 이상 권장
npm --version     # v10 이상

# 2. Firebase 프로젝트 (콘솔에서 미리 생성)
#    - Authentication: Email/Password 활성화
#    - Firestore: 위치 asia-northeast3 (서울), 테스트 모드로 시작
#    - 웹 앱 등록 → firebaseConfig 객체를 메모장에 저장

# 3. 카카오 개발자 등록 (https://developers.kakao.com)
#    - 애플리케이션 추가
#    - JavaScript 키 발급 (메모장 저장)
#    - 플랫폼 → Web → 사이트 도메인: http://localhost:5173

# 4. (선택) Android Studio 설치 + 한국어 AVD 생성 (Pixel 6 / API 34)
```

---

# STEP 0 — 글로벌 컨텍스트 설정

이 단계는 **코드를 작성하지 않는다.** `CLAUDE.md` 와 `IMPLEMENTATION_LOG.md` 두 문서만 만든다.

## STEP 0의 자가 검증

빌드가 없으므로 다음 두 가지로 자가 검증한다:
- `CLAUDE.md` 가 프로젝트 루트에 존재하고 100~200줄 범위 내
- `IMPLEMENTATION_LOG.md` 가 STEP 0~7 표 형태로 존재

---

### 🎯 STEP 0 Claude Code 프롬프트

```text
[STEP 0] 숨은 책방 프로젝트의 글로벌 컨텍스트 문서를 작성한다.
이 단계는 코드를 작성하지 않는다. 두 개의 마크다운 파일만 생성한다.

==========================================
[작업 1] CLAUDE.md 작성
==========================================

프로젝트 루트에 CLAUDE.md 파일을 생성한다.
이 파일은 매 세션마다 Claude Code가 가장 먼저 읽어야 하는 컨텍스트 문서다.

[작성 원칙]
판단 기준: "이 줄을 빼면 코드 작성 시 실수가 발생하는가?"
- Yes → 남긴다
- No → 삭제 (컨텍스트 노이즈 최소화)

[반드시 포함 (O)]
- 프로젝트의 명확한 목적 (한 줄)
- 핵심 제약 (학교 과제, Capacitor, Firebase 등)
- 빌드/실행/테스트 CLI 명령어
- 이 프로젝트만의 독특한 아키텍처 결정 (카카오 Local 검색 데이터 출처 등)
- 디자인 토큰 핵심 (베이스 색, 액센트, 핀 색) — 화면을 만들 때마다 매번 참조됨
- Firebase 컬렉션 스키마 (이게 데이터 흐름의 단일 진실)

[절대 포함 금지 (X)]
- package.json 또는 코드 보면 알 수 있는 라이브러리/버전 정보
- "클린 코드", "camelCase" 같은 일반 컨벤션
- 특정 기능의 일회성 요구사항

[강조 규칙]
- 어겼을 때 빌드 실패 / 데이터 손상 가능성이 있는 항목에만 "IMPORTANT" 또는 "YOU MUST" 사용
- 전체 문서에서 5건 이내로 제한

[CLAUDE.md 권장 골격]

# HIDDEN BOOKSHOP · CLAUDE.md

숨은 책방은 대학 과제용 모바일 앱이다. 지도에서 동네 책방·도서관·북카페를 발견하고, GPS로 방문 인증해 본인의 방문 지도를 채워간다. "동네 책방을 위한 포켓몬 고".

본 프로젝트는 학교 과제용이며, 비즈니스 운영을 전제로 하지 않는다.

## 핵심 제약 (YOU MUST / IMPORTANT)
- YOU MUST 책방 데이터는 카카오 Local 검색에서만 온다. 하드코딩 시드 없음. src/data/bookstores.ts 는 타입(Bookstore)만 정의. 방문/북마크한 책방은 Firestore 문서에 스냅샷으로 비정규화 저장.
- YOU MUST 사용자/방문/분위기 태그는 Firebase Firestore에 저장한다. localStorage 사용 금지(자동 로그인 토큰 제외).
- YOU MUST 다크 모드 only. 라이트 모드 자동 추가 금지.
- IMPORTANT: 카카오 맵은 라이트 톤(기본). 다크 베이스 UI 안에서 라이트 지도가 콘텐츠 영역처럼 자연스럽게 읽히도록 둠 — 인위적 다크 필터 금지.
- IMPORTANT: 핀은 SVG로 직접 그린다. emoji나 lucide-react 아이콘으로 대체 금지 (펜던트 글로우 효과 위해).

## 기술 스택 (요약)
- Vite + React 18 + TypeScript
- Tailwind CSS + CSS 변수 (디자인 토큰)
- Framer Motion (마이크로 인터랙션)
- Kakao Maps JavaScript SDK
- Firebase v10 (Auth + Firestore)
- TanStack Query (Firebase 데이터) + zustand (지도 상태) + useState (로컬 UI)
- Capacitor 5 (Android Studio AVD 패키징)

## 빌드 / 실행

# 개발 서버 (웹)
npm run dev          # → localhost:5173

# 프로덕션 빌드
npm run build

# Android 빌드 (Capacitor)
npm run build && npx cap sync android && npx cap open android
# → Android Studio에서 [Run] 클릭 (AVD 선택)

# 타입 체크
npm run typecheck

# 린트
npm run lint

## 환경변수 (.env.local)
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_KAKAO_JS_KEY

## 디자인 토큰 (핵심만)
색: bgMidnight #13171E / surface01 #1D232C / paper #F2EAD9
액센트: accentLamp #F2B872 (단일 액센트, 동시 2개 풀채도 금지)
핀: pinBookstore #E8804D (서점·헌책방) / pinLibrary #8AB293 (도서관·북카페) / goldVisited #F5CD6E (방문 완료 배지)
폰트: Gowun Batang (display KR) / EB Garamond (display EN) / Pretendard (UI) / IBM Plex Mono (numbers·eyebrow)
Phone canvas: 375×812

## Firestore 컬렉션 스키마

users
  uid              자동 생성 (Firebase Auth)
  email            string
  nickname         string (unique)
  createdAt        timestamp

visits
  id               document id = `${userId}_${bookstoreId}`
  userId           string (users.uid)
  bookstoreId      string (카카오 place id)
  name/category/address/dong/lat/lng/...  책방 스냅샷 (비정규화)
  visitedAt        timestamp

moodTags
  id               자동 생성
  userId           string
  bookstoreId      string
  emoji            "coffee" | "rain" | "music" | "quiet" | "sun"
  createdAt        timestamp

nicknames
  nickname         document id (중복 검증용)
  userId           string

## 아키텍처 결정 노트
- 책방 정적 정보는 카카오 Local 검색에서만 온다. 방문/북마크 책방은 Firestore 문서 스냅샷에 비정규화 보존.
- 닉네임 중복 검증: nicknames 컬렉션의 document id로 nickname을 쓴다 (atomicity 보장).
- 분위기 태그 집계: 책방 상세 진입 시 최근 7일 moodTags를 쿼리하여 카운트. 별도 집계 컬렉션 없음.

## 데이터 흐름 단일 진실
- 책방 정적 정보: 카카오 Local 검색 (런타임). 방문/북마크 책방은 Firestore 문서 스냅샷에 보존
- 사용자·방문·분위기: Firestore
- 그 외 모든 상태: zustand store 또는 컴포넌트 useState

[작성 후 자가 점검]
1. wc -l CLAUDE.md 가 100~200 범위인가
2. grep -cE "(IMPORTANT|YOU MUST)" CLAUDE.md 가 5 이하인가
3. grep -iE "(clean code|camelCase|naming convention)" CLAUDE.md 가 0건인가
4. CLAUDE.md 에 "Pretendard", "Gowun Batang", "pinBookstore", "Firestore", "bookstores.ts" 키워드 모두 포함되어 있는가

==========================================
[작업 2] IMPLEMENTATION_LOG.md 작성
==========================================

프로젝트 루트에 IMPLEMENTATION_LOG.md 파일을 생성한다.
각 STEP의 완료 여부, 핵심 결정, 미해결 이슈를 기록하는 작업 일지다.

[작성 형식]

# IMPLEMENTATION_LOG.md

본 문서는 STEP 0~7 의 진행 상황과 핵심 결정을 기록한다.

## 진행 상황 표

| STEP | 기능 | 상태 | 완료일 | 비고 |
|------|------|------|--------|------|
| 0 | 글로벌 컨텍스트 | 진행 중 | - | CLAUDE.md + 본 파일 작성 |
| 1 | 셋업 + 디자인 시스템 | - | - | - |
| 2 | 인증 + 온보딩 | - | - | - |
| 3 | 지도 홈 | - | - | - |
| 4 | 책방 상세 | - | - | - |
| 5 | GPS 인증 + 분위기 | - | - | - |
| 6 | 마이 북쉘프 + 마이페이지 | - | - | - |
| 7 | Capacitor Android | - | - | - |

## STEP별 핵심 결정 기록

### STEP 0
- (작업 완료 시 추가)

### STEP 1
- (작업 완료 시 추가)

...

## 미해결 이슈 / 후속 작업

- (각 STEP 완료 시 발견된 이슈를 여기에 누적)

==========================================
[STEP 0 완료 보고 형식]

[STEP 0 완료 보고]
- CLAUDE.md: ✅ (xx줄)
- IMPLEMENTATION_LOG.md: ✅
- 자가 검증 통과: 4/4
  ・ 줄 수 100~200 범위: ✅ (xx줄)
  ・ IMPORTANT/YOU MUST 5건 이하: ✅ (x건)
  ・ 금지 키워드 0건: ✅
  ・ 필수 키워드 포함: ✅
- 다음 단계: STEP 1 (셋업 + 디자인 시스템)
- 권장 커밋 메시지: "docs: STEP 0 글로벌 컨텍스트 문서 작성"

==========================================
이제 위 사양에 따라 CLAUDE.md 와 IMPLEMENTATION_LOG.md 를 작성하고, 자가 검증 결과를 보고하라.
```

---

# STEP 1 — 프로젝트 셋업 + 디자인 시스템

Vite 프로젝트 초기화, 의존성 설치, 디자인 토큰 정의, 공용 primitives 구현.

## 의존성 (이 STEP에서 설치)

```
react@18, react-dom@18, react-router-dom@6
typescript, vite@5, @vitejs/plugin-react
tailwindcss@3, postcss, autoprefixer
framer-motion@11
@tanstack/react-query@5
zustand@4
firebase@10
clsx
```

(폰트는 CDN 또는 npm `pretendard` + Google Fonts)

---

### 🎯 STEP 1 Claude Code 프롬프트

```text
[STEP 1] 숨은 책방 프로젝트의 셋업과 디자인 시스템을 구축한다.

[Plan 단계]
즉시 코드를 작성하지 않는다. 먼저 docs/STEP1_setup_design_system.md 라는 설계 문서를 다음 항목으로 작성하고 사용자 승인을 받는다.

1. Vite + React + TypeScript 프로젝트 셋업 방식 (`npm create vite@latest .`)
2. 설치할 의존성 목록과 버전 (위 의존성 블록 참조)
3. 폴더 구조 (예시 아래)
4. CSS 변수 토큰 전체 정의 (reference/claude_design/01_design_tokens.js 의 TOKENS 객체를 globals.css 변수로 변환)
5. Tailwind 설정에서 토큰 색을 어떻게 노출할지 (`theme.extend.colors`)
6. 폰트 로드 방식 (Pretendard npm, Gowun Batang + EB Garamond + IBM Plex Mono Google Fonts)
7. 구현할 primitive 컴포넌트 목록 (Button, Chip, TextInput, MapPin, Pill, StatusBar)
8. 수정/생성될 파일 목록

[권장 폴더 구조]
src/
  components/
    primitives/        Button, Chip, TextInput, MapPin, Pill, StatusBar
    shared/            BottomNav
  data/                bookstores.ts (다음 STEP에서 채움)
  lib/
    firebase.ts        Firebase 초기화
    queryClient.ts     TanStack Query 클라이언트
    geo.ts             haversine 거리 계산
    tokens.ts          토큰 JS 객체 export
  pages/               (다음 STEP들에서 추가)
  stores/              zustand stores
  styles/
    globals.css        CSS 변수 토큰 + 폰트 import + Tailwind directive
  App.tsx
  main.tsx

[Tailwind 색 노출 예시]
theme: {
  extend: {
    colors: {
      bg: { midnight: '#13171E', deeper: '#0D1116' },
      surface: { '01': '#1D232C', '02': '#2A313C', '03': '#353D4A' },
      paper: { DEFAULT: '#F2EAD9', soft: '#E8DEC8', dim: '#C3B9A6', mute: '#847D70' },
      lamp: { DEFAULT: '#F2B872', deep: '#D99852' },
      pin: { bookstore: '#E8804D', library: '#8AB293' },
      gold: { visited: '#F5CD6E' },
      // semantic
      ok: '#8AB293', error: '#E07A6B', info: '#7AA5C4',
    },
    fontFamily: {
      display: ['"Gowun Batang"', '"EB Garamond"', 'serif'],
      'display-en': ['"EB Garamond"', '"Gowun Batang"', 'serif'],
      ui: ['"Pretendard Variable"', '"Pretendard"', 'system-ui', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
    },
  },
}

[Implement 단계 — 승인 후]

1. 프로젝트 초기화
2. 의존성 설치
3. Tailwind 셋업 (postcss.config.js, tailwind.config.ts, src/styles/globals.css)
4. 폰트 로드 (globals.css 상단에 @import)
5. src/lib/tokens.ts 작성 (JS에서 동적으로 색을 합성할 때 사용)
6. src/lib/firebase.ts 작성 (env 변수에서 config 읽기, app/auth/db export)
7. src/lib/queryClient.ts 작성
8. src/components/primitives/ 컴포넌트 6개 작성
   - reference/claude_design/02_shared_primitives.jsx 를 참조하여 비주얼을 재현하되,
     vanilla CSS 변수가 아닌 Tailwind 클래스를 사용
9. src/App.tsx에 임시 라우터 + 6개 primitive를 보여주는 /preview 페이지 추가 (시각 검증용)

[자가 검증 — STEP 1 완료 시]

```bash
# 1) 타입 체크 통과
npm run typecheck

# 2) 빌드 성공
npm run build

# 3) 개발 서버 200 응답
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
# → 200이어야 함

# 4) 필수 파일 존재
test -f src/lib/firebase.ts
test -f src/lib/tokens.ts
test -f src/components/primitives/Button.tsx
test -f src/components/primitives/MapPin.tsx
test -f tailwind.config.ts
test -f src/styles/globals.css

# 5) 토큰 사용 확인 (Tailwind 클래스에 등장)
grep -r "bg-bg-midnight\|text-paper\|text-lamp\|bg-pin-bookstore" src/
# → 최소 한 건 이상
```

[완료 보고 형식]

[STEP 1 완료 보고]
- 프로젝트 셋업: ✅
- 의존성 설치: ✅ (개수: xx개)
- 디자인 토큰: ✅ globals.css + tailwind.config.ts + tokens.ts 3중 노출
- Primitives: ✅ (Button / Chip / TextInput / MapPin / Pill / StatusBar)
- 자가 검증: 5/5 통과
- 권장 커밋 메시지: "feat(setup): 프로젝트 셋업 + 디자인 시스템 토큰 + primitives"
- 다음 단계: STEP 2 (인증 + 온보딩)
- IMPLEMENTATION_LOG.md 갱신: 진행 표 + STEP 1 결정 기록 추가

이제 위 사양으로 작업을 시작하라. 먼저 설계 문서를 작성하고 승인을 요청하라.
```

---

# STEP 2 — 인증 흐름 (F-01 + F-02)

회원가입(이메일/비번/닉네임), 로그인, 자동 로그인, 온보딩 슬라이드, 위치 권한 요청.

---

### 🎯 STEP 2 Claude Code 프롬프트

```text
[STEP 2] 인증 흐름과 온보딩을 구현한다.

[Plan 단계]
docs/STEP2_auth_onboarding.md 를 작성하고 승인을 받는다. 포함 항목:

1. 라우팅 구조 (react-router-dom)
   - / (자동 라우팅: 로그인 상태면 /map, 첫 진입이면 /onboarding, 그 외 /login)
   - /onboarding (SC-01)
   - /signup (SC-02)
   - /login (SC-03)
   - /map, /bookstore/:id, /bookshelf, /mypage (이후 STEP)

2. 인증 흐름 명세
   - 회원가입: Firebase Auth createUserWithEmailAndPassword → users 문서 작성 → nicknames 문서 작성(atomically) → /map 이동
   - 로그인: signInWithEmailAndPassword → /map 이동
   - 자동 로그인: onAuthStateChanged 리스너로 매 진입 시 확인
   - 로그아웃: signOut

3. 입력 검증 (실시간)
   - 이메일: 정규식 + 형식 OK 시 OK 메시지
   - 비밀번호: 6자 이상 카운터 (예: "4/6")
   - 닉네임: 2~12자 + 한글/영문/숫자 + nicknames 컬렉션 중복 검사 (300ms debounce)
   - 모두 통과 시 [가입하기] 활성화

4. 닉네임 중복 검증 구체 알고리즘
   - Firestore nicknames/{nickname} document 가 존재하는지 getDoc
   - 회원가입 트랜잭션: runTransaction 으로 user 문서와 nickname 문서를 동시에 작성 (race 방지)

5. 에러 핸들링
   - 로그인 실패: 두 인풋 보더 error, 에러 메시지
   - 닉네임 중복: 인풋 보더 error, 대안 닉네임 2~3개 제안 (e.g. "서연_2", "서연1")
   - 네트워크 실패: 상단 toast

6. 온보딩
   - 슬라이드 2~3장, 좌우 스와이프 또는 [다음]
   - reference/claude_design/03_screens_onboarding_signup_login.jsx 의 ONBOARDING_SLIDES 데이터를 그대로 사용

7. 위치 권한 요청 시점
   - 회원가입 성공 직후 + 로그인 성공 직후 단 한 번
   - navigator.geolocation.getCurrentPosition 호출 (단순 trigger 용)
   - 거부 시: zustand store에 fallbackArea: '성수동' 저장. 모달로 "다음에 다시" 안내

8. 스토어
   - src/stores/authStore.ts (zustand): currentUser, isAuthLoading
   - 단, Firebase Auth 상태 자체는 firebase.auth 가 SoT. zustand는 React 컴포넌트 친화적 wrapper 용도

9. 수정/생성될 파일 목록
   - src/App.tsx (라우터)
   - src/main.tsx (QueryClientProvider, AuthProvider)
   - src/lib/auth.ts (Firebase Auth 래퍼: register, login, logout, watchAuthState)
   - src/lib/firestore.ts (users, nicknames, visits, moodTags 컬렉션 헬퍼)
   - src/stores/authStore.ts
   - src/pages/onboarding/index.tsx
   - src/pages/signup/index.tsx
   - src/pages/login/index.tsx
   - src/components/AuthGate.tsx (라우트 가드)

[Implement 단계 — 승인 후]

reference/claude_design/03_screens_onboarding_signup_login.jsx 의 비주얼을 정확히 재현한다.
- 상태바, 헤더, 폼 필드, 검증 UI, 버튼 등 컴포넌트는 STEP 1의 primitives를 사용
- Framer Motion으로 페이지 진입 fadeUp staggered (eyebrow / title / body 0.35/0.4/0.45s delay)
- 페이지 인디케이터: 활성은 width 22px로 늘어남 (250ms ease)
- 라우트 가드는 onAuthStateChanged 결과 기다린 후 렌더

[자가 검증 — STEP 2 완료 시]

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

# 3) 라우터에 4개 경로 등록되었는가
grep -E "path: ?['\"]/(onboarding|signup|login|map)['\"]" src/App.tsx | wc -l
# → 최소 4

# 4) Firebase Auth 호출이 lib/auth.ts 안에서만 일어나는가
# (분산 호출 방지)
grep -r "createUserWithEmailAndPassword\|signInWithEmailAndPassword" src/ | grep -v "src/lib/auth.ts" | wc -l
# → 0이어야 함

# 5) 수동 테스트 시나리오 작성
# Claude Code는 다음 시나리오를 README_TEST.md 에 정리해서 사용자에게 안내:
# - 신규 회원가입 → /map 이동 확인
# - 로그아웃 후 다시 진입 → /login 표시 확인
# - 잘못된 비번 로그인 → 에러 메시지
# - 닉네임 중복 시도 → 대안 제안 표시
```

[완료 보고 형식]

[STEP 2 완료 보고]
- 라우팅: ✅ (자동 가드 포함)
- 회원가입 검증: ✅ (이메일/비번/닉네임 실시간 + 중복 검사)
- 로그인: ✅ (자동 로그인 포함)
- 온보딩 슬라이드: ✅ (Framer Motion 진입 애니메이션)
- 위치 권한: ✅ (회원가입/로그인 직후 단 한 번)
- 자가 검증: 5/5 통과
- 권장 커밋 메시지: "feat(auth): 회원가입/로그인/온보딩 + 위치 권한 요청"
- 다음 단계: STEP 3 (지도 홈) ⭐
```

---

# STEP 3 — 지도 홈 (F-03) ⭐ 가장 중요

카카오 맵 + 카카오 Local 검색 책방 데이터 + SVG 핀 + 카테고리 토글 + 책방 이름 검색 + 핀 미리보기 시트.

---

### 🎯 STEP 3 Claude Code 프롬프트

```text
[STEP 3] 지도 홈 화면을 구현한다. 본 프로젝트의 가장 중요한 화면이다.

[Plan 단계]
docs/STEP3_map_home.md 를 작성하고 승인을 받는다. 포함 항목:

1. 카카오 맵 통합
   - 카카오 JS SDK CDN 로드 (index.html `<script>` 또는 useEffect 동적 로드)
   - useKakaoMap 커스텀 훅 작성: ref, center, level, mapInstance 관리
   - 라이트 톤 기본 스타일 유지 (다크 필터 적용 금지)

2. 책방 데이터 (카카오 Local 검색)
   - 하드코딩 시드 없음. kakao.maps.services.Places 키워드/카테고리 검색으로 런타임 조회
   - 홈: searchPlacesNear(location + radius), 지도: map bounds 기반 조회
   - TypeScript 인터페이스 Bookstore 정의 (src/data/bookstores.ts 는 타입만)
   - 필드: id(카카오 place id, 예: kakao-12345), name, category('bookstore'|'library'),
     address, dong, lat, lng, phone, specialtyTags, photos
   - 방문/북마크한 책방은 Firestore 문서에 스냅샷으로 비정규화 저장 (복원용)

3. SVG 핀 컴포넌트 (src/components/MapPin.tsx)
   - reference/claude_design/04_screens_map_detail.jsx 의 핀 비주얼 재현
   - 형태: 카테고리 색 원형 배경 + 흰색 글리프(서점=책 아이콘, 도서관=잔 아이콘)
   - 방문 완료: 동일 카테고리 색 + 우상단 골드 배지 (#F5CD6E)
   - 색 외에 형태 차별화도 함께 (글리프 다름 = 색약 대응)
   - 펜던트 글로우: radial-gradient lampGlow 4s loop pulse, opacity 0.6↔1.0

4. 핀을 카카오 맵 위에 올리는 방식
   - kakao.maps.CustomOverlay 사용 (HTML/SVG 가능)
   - 또는 ReactDOM.createPortal 로 React 컴포넌트를 Overlay 안에 렌더
   - 핀 클릭 핸들러를 React 시스템과 연결

5. 카테고리 토글 칩 (전체 / 서점·헌책방 / 도서관·북카페)
   - 상단 검색바 아래 가로 배치
   - 활성: 칩 bg lamp, text bg-midnight
   - 비활성: bg transparent, border hairline, text paper-dim
   - 토글에 따라 핀 필터링 (zustand mapStore 상태)

6. 책방 이름 검색바
   - 부분 일치 (대소문자/공백 무시)
   - 입력 즉시 핀 강조 (매칭 외 핀 opacity 0.3)
   - 매칭 결과 0건 시 "근처에 일치하는 책방이 없어요" 빈 상태

7. 핀 탭 → 하단 미리보기 시트
   - bottom sheet 슬라이드 업 (translateY 20→0, opacity 0→1, 250ms)
   - 시트 내용: 사진 1장 + 책방명 + 카테고리 + 거리 + 분위기 태그 상위 2개 + [상세 보기] 버튼
   - [상세 보기] → /bookstore/:id

8. 초기 진입 시 핀 staggered reveal: 80ms 간격으로 scale 0→1.08→1

9. 현재 위치 FAB (오른쪽 하단)
   - 탭 시 카카오맵 setCenter(현재 좌표)
   - lamp 색 navigation 아이콘

10. 상태 관리 (src/stores/mapStore.ts, zustand)
    - filterCategory: 'all' | 'bookstore' | 'library'
    - searchQuery: string
    - focusedPinId: string | null
    - userLocation: { lat, lng } | null

11. 수정/생성될 파일 목록
    - src/data/bookstores.ts (Bookstore 타입 정의)
    - src/lib/kakaoPlaces.ts (카카오 Local 검색 래퍼)
    - src/components/MapPin.tsx
    - src/components/PinPreviewSheet.tsx
    - src/components/MapHomeMap.tsx (카카오맵 컨테이너)
    - src/components/CategoryChips.tsx
    - src/components/SearchBar.tsx
    - src/components/CurrentLocationFAB.tsx
    - src/components/BottomNav.tsx (3개 탭: 지도/북쉘프/마이)
    - src/hooks/useKakaoMap.ts
    - src/stores/mapStore.ts
    - src/pages/map/index.tsx
    - src/lib/geo.ts (haversine)
    - index.html (카카오 SDK 스크립트)
    - vite-env.d.ts (VITE_KAKAO_JS_KEY 타입 선언)

[Implement 단계 — 승인 후]

reference/claude_design/04_screens_map_detail.jsx 를 정확히 참조하여 비주얼을 옮긴다.
- 상단(검색바, 카테고리 칩)과 하단(BottomNav)은 다크 베이스 + lamp 액센트
- 지도 영역은 라이트 톤 그대로 (인위적 다크 필터 적용 금지)
- 핀은 SVG로 그리고, 펜던트 글로우 SVG defs/filter 정의 사용

[자가 검증 — STEP 3 완료 시]

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) 카카오 Local 검색 래퍼 존재 + 하드코딩 시드 없음
test -f src/lib/kakaoPlaces.ts
grep -E "kakao.maps.services.Places" src/lib/kakaoPlaces.ts
# → 1건 이상 (런타임 검색으로 책방 조회)

# 3) 핀이 SVG로 그려지는가 (이모지/lucide 사용 금지)
grep -r "from 'lucide-react'" src/components/MapPin.tsx
# → 0이어야 함 (lucide 사용 시 펜던트 글로우 살 수 없음)

# 4) 카카오 SDK 로드 확인
grep "dapi.kakao.com" index.html
# → 1건 이상

# 5) zustand store 4 필드 정의
grep -E "(filterCategory|searchQuery|focusedPinId|userLocation)" src/stores/mapStore.ts | wc -l
# → 최소 4

# 6) 수동 테스트 시나리오 (README_TEST.md 에 작성)
# - /map 진입 시 카카오 검색 결과 핀 표시 (위치 권한 필요)
# - 카테고리 토글 → 해당 색 핀만 표시
# - 책방 이름 검색 → 매칭 핀만 강조
# - 핀 탭 → 하단 시트 슬라이드 업
# - 시트의 [상세 보기] → /bookstore/:id (다음 STEP에서 구현)
```

[완료 보고 형식]

[STEP 3 완료 보고]
- 카카오 맵 통합: ✅
- 책방 데이터: ✅ (카카오 Local 검색 런타임 조회, 하드코딩 시드 없음)
- SVG 핀: ✅ (2색 카테고리 + 골드 배지 + 펜던트 글로우)
- 카테고리 토글: ✅
- 검색바: ✅ (부분 일치 핀 강조)
- 미리보기 시트: ✅
- 자가 검증: 6/6 통과
- 권장 커밋 메시지: "feat(map): 지도 홈 + 카카오 맵 + 카카오 Local 검색 핀 + 필터·검색"
- 다음 단계: STEP 4 (책방 상세)
```

---

# STEP 4 — 책방 상세 (F-04)

사진 슬라이드, 기본 정보, 분위기 태그 집계, 외부 연결 액션.

---

### 🎯 STEP 4 Claude Code 프롬프트

```text
[STEP 4] 책방 상세 페이지를 구현한다. 정보 밀도가 가장 높은 화면이다.

[Plan 단계]
docs/STEP4_bookstore_detail.md 를 작성하고 승인을 받는다. 포함 항목:

1. 라우트
   - /bookstore/:id (useParams로 id 추출 → 카카오 검색 결과 또는 Firestore 스냅샷에서 찾기, 없으면 404 페이지)

2. 화면 구성 (위→아래)
   - 사진 슬라이드 (좌우 스와이프, 도트 인디케이터, 크로스페이드 0.3s)
   - 기본 정보 카드 (이름, 카테고리, 주소, 거리(현재 위치 기반 haversine))
   - 전문 분야 태그 (1~3개, Pill 컴포넌트)
   - 분위기 태그 집계 섹션 (Firestore moodTags 컬렉션 쿼리)
   - 하단 고정 액션 [전화] [길찾기] [공유]

3. 분위기 태그 집계 (TanStack Query)
   - queryKey: ['moodTags', bookstoreId]
   - 최근 7일 데이터만 (where createdAt >= Date.now() - 7d)
   - 이모지별 카운트
   - 빈 상태: "첫 번째 분위기를 남겨주세요" + 5개 이모지 ghost row (opacity 0.3)

4. 사진 슬라이드
   - 사진은 placeholder URL 사용 (예: https://placehold.co/600x400/{색}/F2EAD9?text=책방+사진)
   - bookstore.photos 배열의 항목들

5. 외부 연결 액션
   - [전화]: tel: URL scheme
   - [길찾기]: 카카오맵 길찾기 URL (https://map.kakao.com/link/to/{name},{lat},{lng})
   - [공유]: Web Share API 시도 → 실패 시 클립보드 복사 + toast

6. 헤더
   - 좌상단: 뒤로가기 버튼 (이전 화면 또는 /map)
   - 우상단: 공유 버튼

7. 진입 애니메이션
   - 사진 영역이 hero animation으로 부드럽게 나타남 (지도의 핀 위치에서 zoom-in은 v2)
   - 다른 영역은 fadeUp staggered

8. 수정/생성될 파일 목록
   - src/pages/bookstore/[id]/index.tsx
   - src/components/PhotoSlider.tsx
   - src/components/BookstoreInfoCard.tsx
   - src/components/SpecialtyTags.tsx
   - src/components/MoodTagAggregation.tsx
   - src/components/ActionBar.tsx (전화/길찾기/공유)
   - src/lib/share.ts
   - src/hooks/useMoodTags.ts (TanStack Query)
   - src/App.tsx (라우트 추가)

[Implement 단계 — 승인 후]

reference/claude_design/04_screens_map_detail.jsx 의 BookstoreDetailScreen 비주얼 정확히 재현.
- 다크 무드 일관성 유지
- 분위기 이모지 카운트는 IBM Plex Mono 폰트로 (수집의 만족감 강조)

[자가 검증 — STEP 4 완료 시]

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) 라우트 등록
grep "bookstore/:id" src/App.tsx | wc -l
# → 1

# 3) TanStack Query 의존성 사용
grep "useQuery" src/hooks/useMoodTags.ts
# → 1건 이상

# 4) 외부 연결 URL scheme 사용 (tel:, map.kakao.com)
grep -E "tel:|map.kakao.com/link" src/
# → 최소 2건
```

[완료 보고 형식]

[STEP 4 완료 보고]
- 책방 상세 라우트: ✅
- 사진 슬라이드: ✅ (크로스페이드 0.3s)
- 분위기 태그 집계: ✅ (최근 7일, TanStack Query)
- 외부 연결: ✅ (전화 / 길찾기 / 공유)
- 자가 검증: 4/4
- 권장 커밋 메시지: "feat(detail): 책방 상세 페이지 + 분위기 집계"
- 다음 단계: STEP 5 (GPS 인증 + 분위기 입력)
```

---

# STEP 5 — GPS 방문 인증 + 분위기 입력 (F-05 + F-06)

GPS 자동 인증, 분위기 모달.

---

### 🎯 STEP 5 Claude Code 프롬프트

```text
[STEP 5] GPS 방문 인증, 분위기 입력 모달을 구현한다.

[Plan 단계]
docs/STEP5_visit_mood.md 를 작성하고 승인을 받는다. 포함 항목:

1. GPS 인증 트리거 조건
   - 위치 허용 + 책방 좌표 50m 이내 + 체류
   - 동일 책방 24시간 내 중복 인증 방지 (Firestore visits 컬렉션 쿼리)

2. 인증 시퀀스 (Framer Motion)
   - 단계 1: 책방 50m 이내 진입 감지
   - 단계 2: 화면에 radar pulse 애니메이션 (info 컬러, 3개 ring 0.6s 간격, 2초간)
   - 단계 3: 250ms paper 컬러 fadeIn (방문 확인 신호)
   - 단계 4: 분위기 입력 모달 표시 (SC-06)

3. 분위기 입력 모달 (SC-06)
   - reference/claude_design/05_screens_mood_bookshelf_mypage.jsx 의 모달 비주얼 재현
   - 황금 스탬프 점선 링 12s linear infinite 회전
   - 배경 스파클 7개 별 (3s ease-in-out, 0~1.6s staggered delay)
   - 5개 이모지(☕ 🌧️ 🎶 🤫 ☀️) 그리드, 단일 선택
   - 선택 시 emoji scale 1→1.08, card translateY -2px
   - [건너뛰기] 옵션
   - [완료] 시 Firestore moodTags 컬렉션에 add
   - 모달 닫은 후 /bookshelf로 자동 이동

4. GPS 위치 추적 훅 (src/hooks/useGeolocation.ts)
   - navigator.geolocation.watchPosition (앱 활성 상태에서만)
   - 30초 throttle (배터리 절약)

5. 거리 기반 인증 트리거 (src/hooks/useVisitAutoDetect.ts)
   - 사용자 위치 변경 시 모든 책방과 haversine 거리 계산
   - 50m 이내 + 체류 후 트리거
   - 호출 시: visits 컬렉션에 추가 → 분위기 모달 open

6. Firestore 호출
   - addVisit(userId, bookstoreId, visitedAt)
   - addMoodTag(userId, bookstoreId, emoji)
   - hasRecentVisit(userId, bookstoreId): 24시간 내 visits 조회

7. 빈/에러 상태
   - GPS 권한 거부: 다크 모달, "위치 권한이 필요해요" + [권한 다시 요청]
   - GPS 미일치 (인증 거리 밖): 풀스크린 모달, "조금 더 가까이!" + 현재 거리 vs 50m + [지도로 보기]

8. 수정/생성될 파일 목록
   - src/hooks/useGeolocation.ts
   - src/hooks/useVisitAutoDetect.ts
   - src/components/RadarPulse.tsx
   - src/components/MoodInputModal.tsx
   - src/components/PaperFadeOverlay.tsx
   - src/lib/firestore.ts (addVisit, addMoodTag, hasRecentVisit 추가)

[Implement 단계 — 승인 후]

각 애니메이션은 Phase 3 핸드오프 문서의 명세 그대로 구현한다.
- radar pulse: 3개 ring 동심원 확장
- 황금 스탬프 회전: 12s linear infinite
- 스파클: 7개 별 staggered (0~1.6s)
- 이모지 선택 트랜지션: 180ms

[자가 검증 — STEP 5 완료 시]

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) Geolocation 훅 throttle 검증
grep -E "throttle|debounce" src/hooks/useGeolocation.ts
# → 1건 이상

# 3) Firestore 함수 시그니처
grep -E "addVisit|addMoodTag|hasRecentVisit" src/lib/firestore.ts | wc -l
# → 최소 3

# 4) 24시간 중복 인증 방지 로직
grep -i "24" src/lib/firestore.ts
# → 1건 이상 (24시간 비교 코드)

# 5) 수동 시나리오 (README_TEST.md)
# - 책방 50m 이내 진입 + 체류 → 인증 모달 + Firestore visits 1건 추가
# - 5개 이모지 중 1개 선택 → 완료 → /bookshelf 이동
# - 같은 책방 다시 인증 시도 → 중복 방지 메시지 (24시간 내)
```

[완료 보고 형식]

[STEP 5 완료 보고]
- GPS 자동 인증: ✅ (50m + 체류)
- 분위기 모달: ✅ (5 이모지 + 황금 스탬프 + 스파클)
- Firestore 연동: ✅ (visits + moodTags)
- 24시간 중복 방지: ✅
- 자가 검증: 5/5
- 권장 커밋 메시지: "feat(visit): GPS 자동 인증 + 분위기 모달"
- 다음 단계: STEP 6 (마이 북쉘프 + 마이페이지)
```

---

# STEP 6 — 마이 북쉘프 + 마이페이지 (F-07 + SC-08)

방문 지도, 방문 기록 리스트, 통계, 프로필, 로그아웃.

---

### 🎯 STEP 6 Claude Code 프롬프트

```text
[STEP 6] 마이 북쉘프와 마이페이지를 구현한다.

[Plan 단계]
docs/STEP6_bookshelf_mypage.md 를 작성하고 승인을 받는다. 포함 항목:

1. 마이 북쉘프 (/bookshelf)
   - 상단 통계: 누적 방문 수 / 이번 달 방문 수 (IBM Plex Mono)
   - 방문 지도: 카카오맵 또는 SVG 매트릭스 (방문 책방=컬러 핀, 미방문=회색 도트)
   - 방문 기록 리스트: 책방명 + 방문 일자, 최신순, 무한 스크롤
   - 리스트 항목 탭 → 책방 상세
   - 빈 상태: 빈 책장 SVG (paper-mute) + "첫 발견을 기다리는 책장이에요" + [지도로 보기] CTA

2. 마이페이지 (/mypage)
   - 프로필 카드: 닉네임 (Gowun Batang H1) + 이메일 + 누적 방문 통계
   - 메뉴 리스트:
     ・ 알림 설정 (P2, 토글 UI만, 동작 없음)
     ・ 앱 정보 (학교 과제 안내 footer)
     ・ 로그아웃 (확인 다이얼로그 → signOut → /login)

3. TanStack Query
   - useUserVisits(userId): visits 컬렉션 쿼리, orderBy visitedAt desc
   - 페이지네이션 (cursor-based, limit 20)

4. 방문 지도 렌더링
   - 카카오 지도 한 번 더 사용 vs SVG 정적 지도
   - 권장: SVG 정적 지도 (마이 북쉘프는 지도 인터랙션 불필요, 부담 줄임)
   - 서울 외곽선 또는 동 단위 단순 SVG + 책방 좌표 점 표시

5. 진입 애니메이션
   - 통계 숫자 카운터 (count-up 0 → 실제 값, 0.8s)
   - 방문 기록 리스트 staggered fade in

6. 수정/생성될 파일 목록
   - src/pages/bookshelf/index.tsx
   - src/pages/mypage/index.tsx
   - src/components/StatsCard.tsx
   - src/components/VisitMap.tsx (SVG)
   - src/components/VisitListItem.tsx
   - src/components/EmptyBookshelf.tsx
   - src/components/MenuList.tsx
   - src/components/LogoutDialog.tsx
   - src/hooks/useUserVisits.ts
   - src/App.tsx (라우트 추가)

[Implement 단계 — 승인 후]

reference/claude_design/05_screens_mood_bookshelf_mypage.jsx 의 비주얼을 재현한다.
- 누적 방문 숫자는 가장 큰 IBM Plex Mono 폰트로 강조 (수집의 만족감 핵심)
- 빈 책장 SVG 일러스트 직접 작성 (paper-mute 색)

[자가 검증 — STEP 6 완료 시]

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) 라우트 등록
grep -E "(bookshelf|mypage)" src/App.tsx | wc -l
# → 최소 2

# 3) 로그아웃 → /login 이동
grep "signOut\|navigate.*login" src/components/LogoutDialog.tsx | wc -l
# → 최소 2

# 4) 빈 상태 컴포넌트 존재
test -f src/components/EmptyBookshelf.tsx

# 5) IBM Plex Mono 사용 (통계 강조)
grep -E "font-mono|IBM Plex" src/components/StatsCard.tsx
# → 1건 이상

# 6) 수동 시나리오 (README_TEST.md)
# - 신규 가입 직후 → 빈 책장 표시 + CTA
# - 책방 방문 인증 → 마이 북쉘프 갱신 (실시간)
# - 로그아웃 → /login
```

[완료 보고 형식]

[STEP 6 완료 보고]
- 마이 북쉘프: ✅ (통계 + 방문 지도 + 리스트)
- 빈 상태: ✅ (빈 책장 SVG)
- 마이페이지: ✅ (프로필 + 로그아웃)
- 자가 검증: 6/6
- 권장 커밋 메시지: "feat(bookshelf): 마이 북쉘프 + 마이페이지"
- 다음 단계: STEP 7 (Capacitor Android)
```

---

# STEP 7 — Capacitor Android 패키징

웹 빌드를 Capacitor로 감싸 Android Studio AVD에서 실행.

---

### 🎯 STEP 7 Claude Code 프롬프트

```text
[STEP 7] Capacitor를 추가하여 Android Studio AVD에서 앱을 실행 가능하게 한다.

[Plan 단계]
docs/STEP7_capacitor_android.md 를 작성하고 승인을 받는다. 포함 항목:

1. Capacitor 추가
   - npm install @capacitor/core @capacitor/cli
   - npx cap init "숨은 책방" com.school.hiddenbookstore --web-dir=dist

2. capacitor.config.ts
   - appId: com.school.hiddenbookstore
   - appName: "숨은 책방"
   - webDir: dist
   - server: 개발용 livereload 옵션 (옵션)

3. Android 플랫폼 추가
   - npm install @capacitor/android
   - npx cap add android
   - android/ 폴더가 생성됨 (Android Studio 프로젝트)

4. AVD 네트워킹 (이게 핵심)
   - Firebase는 인터넷으로 작동 (문제 없음)
   - 카카오맵 SDK도 인터넷 의존 (문제 없음)
   - 만약 백엔드 로컬 서버를 호출할 일이 있다면 (현재는 없지만):
     ・ AVD에서 host PC의 localhost → 10.0.2.2 로 접근
     ・ Capacitor.isNativePlatform() 으로 환경 감지 후 분기

5. 카카오맵 도메인 추가
   - 카카오 개발자 콘솔 → 앱 설정 → 플랫폼 → Web 사이트 도메인에 다음 추가:
     ・ capacitor://localhost
     ・ http://localhost
   - 사용자에게 이 작업을 README_CAPACITOR.md 로 안내

6. Capacitor 플러그인 (P0 한정)
   - @capacitor/geolocation (GPS) — STEP 5의 navigator.geolocation을 이걸로 교체
   - @capacitor/preferences (자동 로그인 토큰 등, 선택)
   - @capacitor/status-bar (상태바 색)

7. AndroidManifest 권한
   - ACCESS_FINE_LOCATION
   - ACCESS_COARSE_LOCATION
   - INTERNET

8. 빌드 + 동기화 흐름
   npm run build           # Vite 빌드 → dist/
   npx cap sync android    # dist/ 를 android/ 안으로 복사
   npx cap open android    # Android Studio 열기

9. README_CAPACITOR.md 작성
   - 사용자(실행자)가 따라할 단계별 가이드
   - 카카오 개발자 콘솔 설정 추가 안내
   - AVD 생성 안내 (Pixel 6, API 34, 한국어)
   - Android Studio에서 [Run] 클릭하는 위치 스크린샷 또는 단계 설명

10. 수정/생성될 파일 목록
    - capacitor.config.ts
    - android/ (Capacitor 자동 생성)
    - src/lib/platform.ts (네이티브/웹 환경 분기 헬퍼)
    - src/hooks/useGeolocation.ts (Capacitor Geolocation으로 점진 교체)
    - README_CAPACITOR.md
    - package.json (스크립트 추가: "android": "npm run build && cap sync android && cap open android")

[Implement 단계 — 승인 후]

GPS는 Capacitor Geolocation 플러그인을 우선 사용하되, 웹에서는 navigator.geolocation fallback.

[자가 검증 — STEP 7 완료 시]

```bash
# 1) Capacitor 셋업 확인
test -f capacitor.config.ts
test -d android
grep "com.school.hiddenbookstore" capacitor.config.ts
grep "숨은 책방" capacitor.config.ts

# 2) AndroidManifest 권한 3개 추가됨
grep -c "uses-permission" android/app/src/main/AndroidManifest.xml
# → 3 이상

# 3) package.json android 스크립트
grep "\"android\":" package.json
# → 1건

# 4) README_CAPACITOR.md 카카오 도메인 안내 포함
grep -E "capacitor://localhost|10.0.2.2|개발자 콘솔" README_CAPACITOR.md | wc -l
# → 최소 2

# 5) 빌드 + 동기화 성공
npm run build
npx cap sync android
# → 둘 다 exit 0

# 6) 수동 시나리오 (README_CAPACITOR.md 에 안내)
# - npx cap open android 로 Android Studio 열림
# - AVD 시작 후 [Run] → 앱 설치 및 실행
# - 회원가입 → 지도 표시 → 책방 50m 이내 접근 → 인증 모달
```

[완료 보고 형식]

[STEP 7 완료 보고]
- Capacitor 셋업: ✅ (com.school.hiddenbookstore + 숨은 책방)
- Android 플랫폼: ✅
- 권한 3종: ✅ (FINE_LOCATION, COARSE_LOCATION, INTERNET)
- Capacitor Geolocation 통합: ✅
- README_CAPACITOR.md: ✅
- 자가 검증: 5/5 + 수동 AVD 실행 확인 필요
- 권장 커밋 메시지: "feat(android): Capacitor 통합 + Android Studio AVD 빌드"
- 프로젝트 완료 🎉
```

---

## 📦 프로젝트 최종 산출물

모든 STEP 완료 시 사용자가 가지게 되는 것:

```
hidden-bookstore/
├─ CLAUDE.md                       ← Claude 컨텍스트
├─ IMPLEMENTATION_LOG.md           ← 진행 일지
├─ README.md
├─ README_CAPACITOR.md             ← Android 빌드 가이드
├─ README_TEST.md                  ← 수동 테스트 시나리오
├─ capacitor.config.ts
├─ package.json
├─ tailwind.config.ts
├─ vite.config.ts
├─ tsconfig.json
├─ index.html
├─ .env.example                    ← Firebase + 카카오 키 템플릿
├─ docs/
│  ├─ Phase1_1차_사용자관점.md
│  ├─ Phase1_2차_제품정의.md
│  ├─ Phase2_와이어프레임.jsx
│  ├─ Phase3_ClaudeDesign_핸드오프.md
│  ├─ STEP1_setup_design_system.md
│  ├─ STEP2_auth_onboarding.md
│  ├─ STEP3_map_home.md
│  ├─ STEP4_bookstore_detail.md
│  ├─ STEP5_visit_mood.md
│  ├─ STEP6_bookshelf_mypage.md
│  └─ STEP7_capacitor_android.md
├─ reference/
│  └─ claude_design/                ← 디자인 시안 참조 (.jsx 7개)
├─ src/
│  ├─ ...
├─ android/                         ← Capacitor 생성
└─ dist/                            ← 빌드 결과
```

## 🚦 STEP 간 의존성 그래프

```
STEP 0 (문서)
   ↓
STEP 1 (셋업 + 디자인 시스템)
   ↓
STEP 2 (인증 + 온보딩)        ─┐
   ↓                           │
STEP 3 (지도 홈) ⭐ 가장 중요    │
   ↓                           │
STEP 4 (책방 상세) ─────────────┤
   ↓                           │
STEP 5 (GPS 인증 + 분위기)
   ↓                           │
STEP 6 (마이 북쉘프 + 마이페이지)
   ↓                           │
STEP 7 (Capacitor Android) ────┘
```

각 STEP의 설계 문서(`docs/STEPn_*.md`)는 다음 STEP에서 참조하므로 누적된다.

---

*문서 끝. 본 가이드를 따라 STEP 0부터 순서대로 진행하면 동작하는 MVP가 완성됩니다.*
