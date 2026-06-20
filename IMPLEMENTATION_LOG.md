# IMPLEMENTATION_LOG.md

본 문서는 STEP 0~7 의 진행 상황과 핵심 결정을 기록한다.

## 진행 상황 표

| STEP | 기능 | 상태 | 완료일 | 비고 |
|------|------|------|--------|------|
| 0 | 글로벌 컨텍스트 | ✅ 완료 | 2026-05-21 | CLAUDE.md + 본 파일 작성 |
| 1 | 셋업 + 디자인 시스템 | ✅ 완료 | 2026-05-21 | 의존성 336개, primitives 6종, /preview |
| 2 | 인증 + 온보딩 | ✅ 완료 | 2026-05-21 | Firebase Auth + 닉네임 중복(runTransaction) + 3슬라이드 온보딩 |
| 3 | 지도 홈 | ✅ 완료 | 2026-05-21 | 카카오 SDK + 17곳 시드 + CustomOverlay 핀 + 검색·필터·시트 |
| 4 | 책방 상세 | ✅ 완료 | 2026-05-21 | 사진 슬라이드 + 분위기 집계 + 외부 액션 |
| 5 | GPS 인증 + 분위기 | ✅ 완료 | 2026-05-21 | watch GPS + 50m 체류 자동 인증 + radar→fade→황금 스탬프 모달 |
| 6 | 마이 북쉘프 + 마이페이지 | ✅ 완료 | 2026-05-21 | 통계 카운트업 + SVG 방문 지도 + 책 등 spine 리스트 + 프로필 카드 + 로그아웃 다이얼로그 |
| 7 | Capacitor Android | ✅ 완료 | 2026-05-21 | @capacitor/core+android+geolocation+status-bar + README_CAPACITOR |

## STEP 별 핵심 결정 기록

### STEP 0

- 프로젝트 루트에 `CLAUDE.md` 와 `IMPLEMENTATION_LOG.md` 작성.
- `CLAUDE.md` 는 매 세션 첫 컨텍스트 문서. 코드를 읽으면 알 수 있는 정보(라이브러리/버전, 일반 컨벤션) 제외하고, 어겼을 때 빌드/데이터에 영향이 가는 항목만 `YOU MUST` / `IMPORTANT` 로 강조.
- 강조 마커는 5건 이내로 제한 (다크 모드 only, 시드 데이터 위치, Firestore 사용, 카카오 맵 라이트 톤 유지, 핀은 SVG).

### STEP 1

- 설계 문서 `docs/STEP1_setup_design_system.md` 작성 후 사용자 승인 (의존성: 안정 버전 / 폰트: Pretendard npm + Google Fonts CDN / `/preview`: STEP 2 에서 제거 / Firebase 키: STEP 2 진입 시 제공).
- Vite 5 + React 18 + TS + Tailwind 3 + Firebase 10 + Framer Motion 11 + TanStack Query 5 + zustand 4 셋업. 의존성 336개 설치.
- 디자인 토큰 3중 노출: `src/styles/globals.css` CSS 변수 + `tailwind.config.ts` Tailwind 클래스 + `src/lib/tokens.ts` JS 객체 (`lighten`/`darken` 헬퍼 포함).
- Primitives 6종 (`Button`, `Chip`, `TextInput`, `MapPin`, `Pill`, `StatusBar`) + `PhoneFrame` 작성. `MapPin` 은 SVG `<path>` + `radialGradient` + 골드 별 배지 (lucide·이모지 미사용 — 0건 확인).
- `src/lib/firebase.ts` Firebase 초기화, `queryClient.ts` (staleTime 30s, refetchOnWindowFocus false), `geo.ts` haversine 시그니처 export.
- `/preview` 페이지로 6 primitives 시각 검증. 자가 검증 5/5 통과 (typecheck / build / dev 서버 200 / 필수 파일 12개 / 토큰 클래스 20건 사용).
- TextInput 타입 이슈 (Omit `onChange` 후 onChange 참조) 한 차례 발생 후 즉시 수정.

### STEP 2

- 설계 문서 `docs/STEP2_auth_onboarding.md` 작성 후 사용자 승인 (localStorage 예외 인정 / PhoneFrame 보존 / 약관 토스트 처리 / 테스트 계정 수동 가입).
- `.env.local` 에 Firebase 키 6종 저장 (hidden-bookstore 프로젝트).
- `lib/validation.ts` 이메일·비번·닉네임 형식 + `suggestNicknames` 휴리스틱. `lib/permission.ts` getCurrentPosition 단순 trigger.
- `lib/firestore.ts` `isNicknameTaken`/`createUserWithNickname` (runTransaction 으로 race 방지). `lib/auth.ts` register/login/logout/watchAuthState + `AuthFlowError` 코드 매핑 (EMAIL_IN_USE / WRONG_CREDENTIAL / NICKNAME_TAKEN 등).
- `useNicknameAvailability` hook: 300ms debounce + Firestore getDoc + 상태 5종 (empty/invalid/checking/taken/available).
- `useAuthListener` hook 을 App.tsx 에 마운트하여 `/map` 직접 진입 시에도 auth state 복원. `ensurePersistence` await 후 `watchAuthState` 설치로 race 방지.
- 3슬라이드 온보딩 (`OnboardingArt` 3종 SVG — discovery/stamp/shelf) + Framer Motion staggered fadeUp. 페이지 인디케이터 활성 22px 트랜지션.
- `/preview` 라우트·디렉토리 제거 (STEP 1 약속대로). `PhoneFrame` 은 보존.
- 자가 검증 5/5 통과 (typecheck / build 786KB gzip 214KB / dev 200 / 라우트 4건 / Firebase Auth 호출 `lib/auth.ts` 1곳에만).
- `README_TEST.md` 신규 작성 — 6개 시나리오 (가입 / 닉네임 중복 / 자동 로그인 / 온보딩 1회 / 약관 alert / 라우트 가드).

### STEP 2 미해결
- 테스트 환경에서 Firebase Console 의 Auth Email/Password + Firestore 활성화 사용자 확인 필요. 미완료 시 `auth/configuration-not-found` 발생.

### STEP 3

- 설계 문서 `docs/STEP3_map_home.md` 작성 후 사용자 승인 (핀 idle pulse P1 강등 / `/bookshelf`·`/mypage`·`/bookstore/:id` placeholder 추가 / 카카오 콘솔 localhost 도메인 등록 완료).
- `.env.local` 에 카카오 JS 키 추가. `index.html` 에 SDK `<script>` (`autoload=false`, `%VITE_KAKAO_JS_KEY%` 치환).
- `src/types/kakao.d.ts` 에 minimal 카카오 맵 타입 (Map / LatLng / CustomOverlay) 선언.
- `src/data/bookstores.ts` 17곳 시드: 마포 8 (마포구립서강도서관 02-3141-7053 + 서강대 로욜라도서관 실좌표 포함) + 성동 5 + 종로 4. `seedMoods` 가 있는 7곳 (STEP 4 분위기 집계 대비).
- `useKakaoMap` hook: `kakao.maps.load()` Promise 캐싱 + 10초 타임아웃 + 초기 옵션 ref-capture (재마운트 방지).
- `mapStore` (zustand): `filterCategory` / `searchQuery` / `focusedPinId` / `userLocation` 4필드.
- `MapPinOverlay`: `kakao.maps.CustomOverlay` + `ReactDOM.createPortal` 패턴으로 React `<MapPin>` 을 지도 위에 렌더. visible/dimmed 는 container.style 직접 조작 (overlay 재생성 회피).
- `PinPreviewSheet`: Framer Motion slide-up (`y: 20→0, opacity: 0→1, 250ms ease`). 우측 [상세] 버튼은 paper 컬러 CTA, 닫기 ✕ 함께.
- `MapHomeMap`: 핀 컴포넌트 17개 마운트, 검색·필터 메모이즈, focused 핀으로 `setCenter`, 사용자 위치 fallback 시 SEED_CENTER (마포구립서강도서관). 검색 0건 시 floating 메시지.
- `SearchBar` / `CategoryChips` / `CurrentLocationFAB` / `BottomNav` (3탭, filled-when-active 글리프).
- `/bookshelf`, `/mypage`, `/bookstore/:id` placeholder 페이지 (각각 STEP 6, STEP 6, STEP 4 예고 카드). `/mypage` 에는 로그아웃 임시 배치.
- `App.tsx` 에 4개 신규 라우트 (`RequireAuth` 가드 포함). `/map` 의 STEP 2 placeholder 제거 후 실제 지도 홈으로 교체.
- 자가 검증 6/6 통과 (typecheck / build 806KB gzip 219KB / dev 200 / 시드 17곳·district 카운트 정확 / Kakao SDK 1건 / mapStore 4필드 12회).
- `README_TEST.md` STEP 3 시나리오 6종 (G~L) 추가 — 시나리오 H 는 책방 이름 검색 강조.

### STEP 3 미해결
- 카카오 콘솔의 localhost 도메인 등록은 사용자 측에서 완료 확인 필요. 미완료 시 401 → MapHomeMap 의 error 상태로 폴백.
- Bundle 크기 806KB → Capacitor 패키징(STEP 7) 시 manual chunk split 검토.

### STEP 4

- 설계 문서 `docs/STEP4_bookstore_detail.md` 작성 후 승인 (vitest 미도입 / 사진 더 보기 P1 강등 / 영문 부카피 생략 / 북마크 UI 토글만).
- `share.ts`: `kakaoMapDirectionUrl` (`/link/to/{name},{lat},{lng}`) + `shareOrCopy` (Web Share API → 클립보드 fallback).
- `firestore.ts` 에 `MoodTagDoc` 타입과 `fetchMoodTags(bookstoreId)` (where bookstoreId == id AND createdAt >= now-7d), `aggregateMoodCounts` 추가.
- `useMoodTags` hook: TanStack Query (key `['moodTags', id]`, staleTime 60s) + 시드 moods 와 Firestore counts 머지. 카운트 내림차순 정렬 후 상위 3 active / 그 외 muted.
- 5개 컴포넌트: `PhotoSlider` (3장 크로스페이드 0.3s + 도트 + 카운터), `BookstoreInfoCard` (영업 상태 + 주소 + 전화 DetailRow), `SpecialtyTags` (#태그 칩), `MoodTagAggregation` (5개 ghost 빈 상태 포함), `ActionBar` (paper Primary 가운데 길찾기 + 좌우 surface-02 + toast).
- 페이지 교체: `/bookstore/:id` 가 실제 상세 화면. 사진 슬라이드 → 정보 카드 → 분위기 → 전문 태그 + 하단 고정 액션 바. 북마크 UI 토글 (저장 안함).
- 자가 검증 6/6 통과 (typecheck / build 837KB gzip 228KB / TanStack useQuery / tel: + map.kakao.com/link 2건 / dev 200).
- README_TEST 에 시나리오 5종 (M~P) 추가 — 책방 상세 진입과 분위기 집계 빈 상태 확인.

### STEP 5

- 설계 문서 `docs/STEP5_visit_mood.md` 작성 후 승인 (인덱스 README_TEST 안내 / watchPosition 업그레이드 / ESC 만 닫기).
- `useGeolocation`: `watchPosition` + 30초 throttle. throttle 변수명 THROTTLE_MS 30_000 ms.
- `useVisitAutoDetect`: 50m 진입 시각 기록 + 5초 체류 후 Firestore hasRecentVisit 체크 → pendingVisit 설정.
- `useUserVisits`: TanStack Query (key `['visits', uid]`, staleTime 30s), 인증 후 invalidate 로 즉시 골드 배지 반영.
- `firestore.ts`: `addVisit` / `addMoodTag` / `hasRecentVisit` (24h cutoff) / `fetchUserVisits` 추가.
- 4 컴포넌트: `RadarPulse` (3 ring staggered 0/0.6/1.2s + info 글로우), `PaperFadeOverlay` (0→0.85→0 / 600ms), `Sparkles` (7 별 staggered twinkle 3s), `MoodInputModal` (황금 스탬프 + 점선 12s linear rotate + 5 이모지 선택 + ESC 닫기).
- `MapPage` 가 시퀀스 상태 머신 (idle → radar → fade → mood) 운용. moodSubmit 시 visits + moodTags 동시 invalidate.
- 자가 검증 6/6 통과 (typecheck / build 864KB gzip 235KB / dev 200 / useGeolocation throttle 3건 / Firestore addVisit/addMoodTag/hasRecentVisit 3건 / 24h 상수 3건).
- README_TEST 시나리오 3종 (R~T) 추가 — Firestore 복합 색인 안내 포함.

### STEP 5 미해결
- 첫 인증 시도 시 Firestore `visits` 복합 인덱스 자동 생성 안내 콘솔 클릭이 사용자 측에서 필요. README_TEST 사전 조건 절에 명시.

### STEP 6

- 설계 문서 `docs/STEP6_bookshelf_mypage.md` 작성 후 승인 (방문 지도 SVG / 책방별 마지막 분위기 추가 쿼리 / Explorer 1~6/7~12/13+ / 로그아웃 별도 모달).
- `lib/explorer.ts`: `getExplorerLevel` (count→ level/label 매핑, 13+ 가 LV.3).
- `hooks/useCountUp.ts`: requestAnimationFrame 기반 easeOutCubic 카운트업 (800ms 기본).
- `lib/firestore.ts`: `fetchAllUserMoodTags(userId)` 추가 (createdAt desc 정렬).
- `hooks/useAllUserMoodTags.ts`: TanStack Query + `indexLatestMoodByBookstore` (bookstoreId → 가장 최근 emoji Map).
- 북쉘프 4 컴포넌트:
  - `StatsCard`: 누런 띠 그라데이션 1px (책 등받이) + 2열 카운트업
  - `VisitMap`: lat/lng → SVG x/y normalize, 방문 책방은 `MapPin visited`, 미방문은 회색 8px 점, 좌하단 legend
  - `VisitListItem`: 책 등 spine 36×44 + `NO.N` mono + 번호 Gowun Batang + 카테고리 dot + 분위기 이모지 + staggered fade-in (40ms 간격)
  - `EmptyBookshelf`: paper-mute 톤 3단 책장 SVG + 펜던트 글로우 + 점선 빈 책 자리 + [지도에서 발견하기] CTA
- 마이페이지 4 컴포넌트:
  - `ProfileCard`: 우상단 펜던트 글로우, 64px 아바타 (lamp 그라데이션 + 닉네임 첫 글자 + glow), Explorer 배지, 2열 MiniStat 카운트업
  - `MenuGroup`: eyebrow + bordered group container
  - `MenuItem`: 좌 아이콘 (danger 시 error 배경), 라벨, 우측 값, chevron
  - `LogoutDialog`: 풀스크린 scrim + 카드 모달 + ESC/배경 클릭/[취소] 모두 닫기, [로그아웃] 클릭 시 signOut → `/login`
- 페이지 교체: `/bookshelf` 실제 (시각 시드+Firestore visits 결합), `/mypage` STEP 5 임시 → 디자인 시안 적용본.
- 자가 검증 6/6 통과 (typecheck / build 880KB gzip 240KB / dev 200 / bookshelf+mypage 라우트 4건 / logout/signOut/navigate 9건 / EmptyBookshelf 존재 / StatsCard tabular-nums 1건).
- README_TEST 시나리오 5종 (W~AA) 추가.

### STEP 7

- 설계 문서 `docs/STEP7_capacitor_android.md` 작성 후 승인 (cleartext 디버그용 추가 / `@capacitor/geolocation` 명시 사용 / `android/` gitignore 유지 / Manifest 권한 README 안내 + 수동 수정).
- 의존성 6종 추가: `@capacitor/core@^8.3.4`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/geolocation`, `@capacitor/status-bar`, `@capacitor/preferences` (70 패키지 추가).
- `capacitor.config.ts`: appId `com.school.hiddenbookstore`, appName `숨은 책방`, webDir `dist`, `androidScheme: 'https'`, StatusBar 색 `#13171E`.
- `src/lib/platform.ts`: `isNative()` + `getPlatform()` (`'ios' | 'android' | 'web'`).
- `useGeolocation` 네이티브 분기: `isNative()` 일 때 `Geolocation.requestPermissions` → `Geolocation.watchPosition`. 웹은 `navigator.geolocation` 유지.
- `main.tsx` 에 native 환경일 때 `StatusBar.setBackgroundColor` + `setStyle(Dark)` 호출.
- `package.json` 스크립트 추가: `android` (build → cap sync → cap open), `android:sync` (build → cap sync 만).
- `README_CAPACITOR.md` 작성: 사전 조건 (Java 17 / Android Studio Hedgehog / API 34 AVD), 카카오 콘솔 도메인 3종 등록 가이드, `npx cap add android` + Manifest 권한 patch 가이드, 빌드 흐름, 트러블슈팅 6종, 환경별 차이 표.
- 자가 검증 6/6 통과 (typecheck / build 891KB gzip 244KB / dev 200 / capacitor.config 키워드 2건 / `"android":` 스크립트 1건 / README_CAPACITOR 키워드 9건 / platform.ts Capacitor 호출 / useGeolocation native 분기 3건).

### STEP 7 미해결 (사용자 측 수동 작업)
- `npx cap add android` 실행 (사용자 머신의 Android SDK 의존). 자세한 가이드는 `README_CAPACITOR.md` 2절.
- `android/app/src/main/AndroidManifest.xml` 의 위치 권한 2종 + `usesCleartextTraffic` 수동 추가. README 의 2-1절 snippet 그대로 복사.
- 카카오 콘솔에 `https://localhost` + `capacitor://localhost` 도메인 추가.

## 🎉 프로젝트 완료

| 산출물 | 위치 |
|---|---|
| 글로벌 컨텍스트 | `CLAUDE.md` |
| 진행 일지 | `IMPLEMENTATION_LOG.md` (본 문서) |
| 단계별 설계 문서 | `docs/STEP{1-7}_*.md` (7개) |
| 테스트 시나리오 | `README_TEST.md` |
| Android 빌드 가이드 | `README_CAPACITOR.md` |
| 디자인 시안 참조 | `reference/claude_design/*.jsx` (7개) |
| 코드 | `src/` (페이지 8 + 컴포넌트 30+ + lib 9 + hook 7 + store 4) |

권장 다음 단계: `git init` → 첫 커밋 + 배포 전 dry-run.

---

## 보너스 — 카카오 실 데이터 통합

- 책방 데이터는 카카오 Local API 로 조회.
- `src/types/kakao.d.ts` 에 `services.Places`, `LatLngBounds`, `event.addListener/removeListener` 타입 추가.
- `src/lib/kakaoPlaces.ts`: 3개 패스(BK9 categorySearch + "도서관" / "북카페" keywordSearch) 병렬 + 페이지네이션 최대 2페이지 + `kakaoPlaceId` 기준 dedupe + `RemoteBookstore` 타입으로 normalize.
- `src/stores/remoteBookstoresStore.ts`: id-keyed Map + 시드 좌표 80m 이내 dedupe (시드 우선) + list selector.
- `src/hooks/useRemoteBookstores.ts`: 지도 `idle` 이벤트 구독 + 500ms debounce + AbortController 로 이전 검색 취소.
- `getBookstoreById` → `getSeedBookstoreById` 로 명명 분리. 상세 페이지가 시드 + 원격 store 양쪽 lookup.
- `MapHomeMap` 가 `allBookstores = [...seed, ...remote]` 로 핀·검색·필터 전체 통합. 지도 위쪽에 검색 상태 인디케이터 (검색 중 / 완료 / 실패).
- `MapPage` 헤더 카피가 `책방 N곳 · 실시간 +M` 으로 동적. CategoryChips 의 totalCount 도 합산.
- 자가 검증 (typecheck / build 896KB gzip 245KB / dev 200) 통과.
- README_TEST 시나리오 3종 (BB~DD) 추가.

## 미해결 이슈 / 후속 작업

- (각 STEP 완료 시 발견된 이슈를 여기에 누적)
