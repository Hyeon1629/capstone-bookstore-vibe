# 숨은 책방 — 동네 책방 발견 앱

> 학교 캡스톤 프로젝트의 일환으로, AI를 활용하여 서비스 기획부터 UI 디자인, 구현까지 전 과정을 바이브 코딩한 결과물입니다.
>
> **사용 도구:** Claude (서비스 기획 · 와이어프레임) · Claude Design (UI 디자인) · Claude Code (구현)

---

## 1. 프로젝트 개요

동네에는 의외로 많은 서점·도서관·북카페가 있지만, 작은 책방일수록 디지털 노출이 약해 사용자는 그 존재를 인지하지 못합니다. **숨은 책방**은 이 문제를 지도 기반 발견 + GPS 방문 인증이라는 메커닉으로 해결합니다.

지도에서 동네 책방을 발견하고, 직접 가서 GPS로 방문 인증하고, 나만의 책방 지도를 한 점씩 채워가는 모바일 앱입니다.

### 핵심 가치

- **발견 (Discovery)** — 지도를 열면 *"동네에 책방이 이렇게 많았어?"* 하는 인지의 순간
- **수집 (Collection)** — 방문 지도가 한 점씩 채워지는 시각적 만족감

## 2. 주요 기능

| 영역 | 구현 내용 |
|------|-----------|
| **인증** | 이메일/비밀번호 회원가입, 로그인/로그아웃, 자동 로그인, 닉네임 중복 검증 |
| **온보딩** | 컨셉 슬라이드 + 위치 권한 요청 |
| **지도 홈** | 카카오맵 기반 2색 핀 (서점·헌책방 = 주황 / 도서관·북카페 = 초록), 카테고리 토글, 책방 이름 검색, 핀 탭 시 미리보기 시트. 지도 영역의 책방을 카카오 Local API로 동적 표시 |
| **책방 상세** | 사진 슬라이드, 운영 정보, 분위기 태그 집계, 외부 연결 (전화 / 길찾기 / 공유) |
| **GPS 방문 인증** | 반경 50m + 5초 체류 시 자동 인증 |
| **분위기 이모지** | 방문 후 5개 이모지 (☕ 🌧️ 🎶 🤫 ☀️) 중 1개 선택 → 다음 사용자에게 분위기 정보 제공 |
| **마이 북쉘프** | 방문 지도 (컬러 핀 = 방문, 회색 = 미방문) + 방문 기록 리스트 |

## 3. 기술 스택

### Frontend
- **React 18**, **TypeScript**
- **Vite 5** (개발 서버 / 프로덕션 빌드)
- **Tailwind CSS** + CSS 변수 (디자인 토큰)
- **Framer Motion 11** (마이크로 인터랙션)
- **TanStack Query 5** (Firebase 데이터 패칭)
- **zustand 4** (지도 상태 관리)
- **Kakao Maps JavaScript SDK** (지도)

### Backend
- **Firebase Authentication** (이메일/비밀번호 인증)
- **Cloud Firestore** (사용자 · 방문 기록 · 분위기 태그 저장)

### Mobile
- **Capacitor 8** (웹 → Android 패키징)
- Android Studio AVD (가상 디바이스 테스트)

## 4. 프로젝트 구조

```
hidden-bookstore/
├── CLAUDE.md                    # Claude Code 컨텍스트 문서
├── IMPLEMENTATION_LOG.md        # 구현 진행 일지
├── capacitor.config.ts          # Capacitor 설정
├── index.html
├── .env.local                   # Firebase + 카카오 키 (커밋 제외)
│
├── docs/                        # 기획 · 디자인 산출물
│   ├── 숨은책방_Phase1_1차_사용자관점.md   # 페르소나 · 시나리오 · 유저 플로우
│   ├── 숨은책방_Phase1_2차_제품정의.md     # 요구사항 · 기능 명세 · IA
│   ├── 숨은책방_Phase2_와이어프레임.jsx     # 8개 화면 인터랙티브 프로토타입
│   └── Phase3_ClaudeDesign_핸드오프.md     # UI 디자인 결정 근거
│
├── reference/
│   └── claude_design/           # Claude Design UI 시안 (7개 .jsx)
│
├── src/
│   ├── components/
│   │   ├── primitives/            # Button, Chip, TextInput, MapPin 등
│   │   ├── shared/                # BottomNav, PhoneFrame 등
│   │   ├── map/ bookstore/ visit/ # 화면별 컴포넌트
│   │   └── AuthGate.tsx           # 인증 가드
│   ├── data/
│   │   └── bookstores.ts         # Bookstore 타입 정의
│   ├── hooks/                    # useKakaoMap, useGeolocation, useMoodTags 등
│   ├── lib/
│   │   ├── firebase.ts            # Firebase 초기화
│   │   ├── auth.ts                # 인증 래퍼 (register, login, logout)
│   │   ├── firestore.ts           # Firestore CRUD 헬퍼
│   │   └── geo.ts                 # haversine 거리 계산
│   ├── pages/                    # 온보딩, 회원가입, 로그인, 지도, 상세, 북쉘프, 마이
│   ├── stores/                   # zustand (mapStore, authStore 등)
│   └── styles/
│       └── globals.css            # 디자인 토큰 CSS 변수 + Tailwind
│
└── android/                     # Capacitor 자동 생성 (Android Studio 프로젝트)
```

## 5. 실행 방법

### 사전 준비
- [Node.js](https://nodejs.org) 20 이상
- [Firebase 프로젝트](https://console.firebase.google.com) (Authentication + Firestore 활성화)
- [카카오 개발자](https://developers.kakao.com) 앱 등록 (JavaScript 키 발급)
- (선택) [Android Studio](https://developer.android.com/studio) + AVD (Android 실행 시)

### 환경변수 설정
프로젝트 루트에 `.env.local` 파일 생성 (`.env.example` 복사 후 값 채우기):
```
VITE_FIREBASE_API_KEY=본인_키
VITE_FIREBASE_AUTH_DOMAIN=본인_도메인
VITE_FIREBASE_PROJECT_ID=본인_프로젝트ID
VITE_FIREBASE_STORAGE_BUCKET=본인_버킷
VITE_FIREBASE_MESSAGING_SENDER_ID=본인_센더ID
VITE_FIREBASE_APP_ID=본인_앱ID
VITE_KAKAO_JS_KEY=본인_카카오_JavaScript_키
```

### 웹 실행
```bash
npm install                  # 의존성 설치
npm run dev                  # 개발 서버 실행 → http://localhost:5173
```

### Android 실행 (선택)
```bash
npm run build                # 프로덕션 빌드
npx cap sync android         # Android 프로젝트에 동기화
npx cap open android         # Android Studio 열기 → AVD에서 [Run]
```

## 6. 책방 데이터

책방 데이터는 카카오 Local 검색(`kakao.maps.services.Places`)에서만 가져옵니다. 하드코딩 시드는 없으며, `src/data/bookstores.ts`는 `Bookstore` 타입만 정의합니다. 홈은 위치+반경으로, 지도는 영역(bounds)으로 책방·도서관·북카페를 조회합니다. 방문·북마크한 책방은 Firestore 문서에 스냅샷으로 비정규화 저장되어 발자취·상세가 복원됩니다.

## 7. 디자인 시스템

| 항목 | 값 |
|------|---|
| 베이스 | `#13171E` (잉크 미드나잇) |
| 액센트 | `#F2B872` (펜던트 앰버) |
| 서점 핀 | `#E8804D` (주황) |
| 도서관 핀 | `#8AB293` (초록) |
| 방문 배지 | `#F5CD6E` (골드) |
| 디스플레이 KR | Gowun Batang |
| 디스플레이 EN | EB Garamond |
| UI | Pretendard |
| 숫자/코드 | IBM Plex Mono |

## 8. AI 활용 워크플로우

본 프로젝트는 전 과정을 AI 도구로 진행한 바이브 코딩 프로젝트입니다.

| 단계 | 도구 | 산출물 |
|------|------|--------|
| **Phase 1** 서비스 기획 | Claude | 페르소나, 시나리오, 유저 플로우, 기능 명세 7개, IA |
| **Phase 2** 와이어프레임 | Claude | 8개 화면 인터랙티브 프로토타입 (React) |
| **Phase 3** UI 디자인 | Claude Design | "Late Bookshop" 다크 테마, 디자인 토큰, 8개 화면 고해상도 시안 |
| **Phase 4** 구현 | Claude Code | STEP 0~7 단계별 구현, Plan→Approve→Implement→Verify→Commit |

### Claude Code 워크플로우

```
STEP 0  CLAUDE.md + IMPLEMENTATION_LOG.md (코드 없이 문서만)
STEP 1  프로젝트 셋업 + 디자인 시스템 (Vite, Tailwind, 토큰, primitives)
STEP 2  인증 + 온보딩 (Firebase Auth, 닉네임 중복 검증)
STEP 3  지도 홈 (카카오맵, 카카오 API 동적 핀, 카테고리 토글, 검색)
STEP 4  책방 상세 (사진 슬라이드, 분위기 집계, 외부 연결)
STEP 5  GPS 인증 + 분위기 입력
STEP 6  마이 북쉘프 + 마이페이지
STEP 7  Capacitor Android 패키징
```

---

> 본 프로젝트는 대학교 캡스톤 과제용으로 제작되었습니다.
