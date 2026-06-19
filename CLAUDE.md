# HIDDEN BOOKSHOP · CLAUDE.md

숨은 책방은 대학 과제용 모바일 앱이다. 지도에서 동네 책방·도서관·북카페를 발견하고, GPS로 방문 인증해 본인의 방문 지도를 채워간다. "동네 책방을 위한 포켓몬 고".

본 프로젝트는 학교 발표·평가용이며, 비즈니스 운영을 전제로 하지 않는다.

## 핵심 제약

- 책방 데이터는 **카카오 Local 검색에서만** 온다 (하드코딩 시드 없음 — 2026-06-19 제거). `src/data/bookstores.ts` 는 타입(`Bookstore`)만 정의. 방문/북마크한 책방 정보는 Firestore 문서에 **스냅샷으로 비정규화 저장**해, 휘발성 카카오 스토어 없이도 발자취·상세가 복원되도록 한다.
- YOU MUST 사용자·방문·분위기 태그는 Firebase Firestore 에 저장한다. localStorage 사용 금지 (자동 로그인 토큰은 예외).
- YOU MUST 다크 모드 only. 라이트 모드 자동 추가 금지.
- IMPORTANT: 카카오 맵은 라이트 톤(기본). 다크 베이스 UI 안에서 라이트 지도가 콘텐츠 영역처럼 자연스럽게 읽히도록 둠 — 인위적 다크 필터 금지.
- IMPORTANT: 핀은 SVG 로 직접 그린다. emoji 나 lucide-react 아이콘으로 대체 금지 (펜던트 글로우 효과 위해). 미방문은 카테고리 색(주황·세이지), 방문 완료는 goldVisited(노란색) 단일 색으로 전체 변경.

## 기술 스택 (요약)

- Vite + React 18 + TypeScript
- Tailwind CSS + CSS 변수 (디자인 토큰)
- Framer Motion (마이크로 인터랙션)
- Kakao Maps JavaScript SDK
- Firebase v10 (Auth + Firestore)
- TanStack Query (Firebase 데이터) + zustand (지도 상태) + useState (로컬 UI)
- Capacitor 8 (Android Studio AVD 패키징)

## 빌드 / 실행

```bash
# 개발 서버 (웹)
npm run dev          # → localhost:5173

# 프로덕션 빌드
npm run build

# Android 빌드 (Capacitor)
npm run build && npx cap sync android && npx cap open android
# → Android Studio 에서 [Run] 클릭 (AVD 선택)

# 타입 체크
npm run typecheck

# 린트
npm run lint
```

## 환경변수 (.env.local)

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_KAKAO_JS_KEY`

## 디자인 토큰 (핵심만)

- 색: `bgMidnight` `#13171E` / `surface01` `#1D232C` / `paper` `#F2EAD9`
- 액센트: `accentLamp` `#F2B872` — 단일 액센트, 동시에 풀채도 2개 사용 금지
- 핀: `pinBookstore` `#E8804D` (서점·헌책방) / `pinLibrary` `#8AB293` (도서관·북카페) / `goldVisited` `#F5CD6E` (방문 완료 배지)
- 폰트: `Gowun Batang` (display KR) / `EB Garamond` (display EN) / `Pretendard` (UI) / `IBM Plex Mono` (numbers · eyebrow)
- Phone canvas: 375 × 812

상세 토큰은 `reference/claude_design/01_design_tokens.js` 와 `docs/Phase3_ClaudeDesign_핸드오프.md` 참조.

## Firestore 컬렉션 스키마

```
users
  uid              자동 생성 (Firebase Auth)
  email            string
  nickname         string (unique)
  createdAt        timestamp

visits
  id               document id = `${userId}_${bookstoreId}` (결정적 → 책방당 1행, 중복 행 없음)
  userId           string (users.uid)
  bookstoreId      string (카카오 place id, 예: kakao-12345)
  name/category/address/dong/lat/lng/specialtyTags/photos/phone?  책방 스냅샷 (비정규화 — 시드 없이 복원용)
  visitCount       number (총 방문 횟수 — 하루 최대 +1)
  firstVisitedAt   timestamp (최초 방문)
  visitedAt        timestamp (마지막 방문)
  lastCountedDay   string 'YYYY-MM-DD' (하루 1회 카운트 경계)

moodTags
  id               자동 생성
  userId           string
  bookstoreId      string
  emoji            "coffee" | "rain" | "music" | "quiet" | "sun"
  createdAt        timestamp

nicknames
  nickname         document id (중복 검증용)
  userId           string

bookmarks
  id               document id = `${userId}_${bookstoreId}` (결정적 → 멱등 토글)
  userId           string
  bookstoreId      string
  name/category/address/dong/lat/lng/...  책방 스냅샷 (비정규화)
  createdAt        timestamp
```

## 아키텍처 결정 노트

- 책방 데이터는 카카오 Local 검색(`kakao.maps.services.Places`)에서만 온다. 하드코딩 시드·시연 모드(long-press mock)·seedMoods 는 2026-06-19 전면 제거됨. 홈은 `searchPlacesNear`(location+radius), 지도는 `useRemoteBookstores`(map bounds) 로 조회.
- 위치 없으면(권한 거부·미허용) 홈·지도는 `LocationPrompt`(위치 안내) 표시. 마포 고정 폴백 없음.
- 닉네임 중복 검증: `nicknames` 컬렉션의 document id 로 nickname 을 쓴다 (atomicity 보장).
- 분위기 태그 집계: 책방 상세 진입 시 최근 7일 `moodTags` 를 쿼리하여 카운트. 별도 집계 컬렉션 없음.
- GPS 자동 인증: 주변 카카오 책방 50m 이내 + 체류 → visits 기록 → 분위기 입력 모달. 책방당 1행(결정적 visit id), 재방문은 하루 최대 1회씩 visitCount 누적 (recordVisit 트랜잭션이 lastCountedDay 비교). 같은 날 재방문은 DuplicateVisitError.

## 데이터 흐름 단일 진실 (Single Source of Truth)

- 책방 정적 정보: 카카오 Local 검색 (런타임). 방문/북마크 책방은 Firestore 문서 스냅샷에 보존
- 사용자·방문·분위기: Firestore
- 그 외 모든 상태: zustand store 또는 컴포넌트 `useState`

## 참고 문서 위치

- 사용자 관점·페르소나: `docs/숨은책방_Phase1_1차_사용자관점.md`
- 요구사항·기능 명세·IA: `docs/숨은책방_Phase1_2차_제품정의.md`
- 와이어프레임: `docs/숨은책방_Phase2_와이어프레임.jsx`
- 비주얼 디자인 핸드오프: `docs/Phase3_ClaudeDesign_핸드오프.md`
- 디자인 시안 React 소스: `reference/claude_design/*.jsx` (7개 파일)
- 단계별 실행 가이드: `숨은책방_ClaudeCode_프롬프트.md`

## 워크플로우 5단계

모든 STEP 은 **Plan(설계 문서) → Approve(사용자 승인) → Implement(구현) → Verify(자가 검증) → Commit** 을 따른다. 각 STEP 시작 전 `docs/STEPn_*.md` 설계 문서를 먼저 작성하고 승인을 받는다.
