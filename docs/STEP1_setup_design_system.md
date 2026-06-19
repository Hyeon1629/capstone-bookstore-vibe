# STEP 1 — 프로젝트 셋업 + 디자인 시스템 (설계 문서)

> 본 문서는 코드 작성 전에 사용자 승인을 받기 위한 Plan 단계 산출물이다.
> 승인 후 본 명세대로 구현한다.

---

## 1. 프로젝트 초기화 방식

```bash
# 현재 디렉토리(hidden-bookstore)에서 Vite 프로젝트 생성
npm create vite@latest . -- --template react-ts
```

기존 파일(`CLAUDE.md`, `IMPLEMENTATION_LOG.md`, `docs/`, `reference/`, `숨은책방_ClaudeCode_프롬프트.md`)은 보존한다. Vite 가 생성하는 기본 `src/App.tsx` / `src/main.tsx` / `index.html` / `package.json` / `tsconfig.json` / `vite.config.ts` 는 그대로 받아들이고, 이후 단계에서 우리 사양에 맞춰 덮어 쓴다.

기본 README 와 `src/App.css` / `src/index.css` / `src/assets/` 등 Vite 보일러플레이트 파일은 삭제하거나 빈 파일로 교체.

---

## 2. 설치할 의존성 (버전 고정)

### 런타임
| 패키지 | 버전 | 용도 |
|---|---|---|
| `react` | `^18.3.0` | UI 프레임워크 |
| `react-dom` | `^18.3.0` | DOM 렌더링 |
| `react-router-dom` | `^6.26.0` | 라우팅 (STEP 2에서 본격 사용) |
| `framer-motion` | `^11.3.0` | 마이크로 인터랙션 |
| `@tanstack/react-query` | `^5.51.0` | Firebase 데이터 캐싱 |
| `zustand` | `^4.5.0` | 지도·시연 모드 상태 |
| `firebase` | `^10.13.0` | Auth + Firestore |
| `clsx` | `^2.1.0` | 조건부 className |
| `pretendard` | `^1.3.9` | 본문 폰트 (npm self-host) |

### 개발 의존성
| 패키지 | 버전 | 용도 |
|---|---|---|
| `typescript` | `^5.5.0` | 타입 시스템 |
| `vite` | `^5.4.0` | 빌드 도구 |
| `@vitejs/plugin-react` | `^4.3.0` | React 플러그인 |
| `tailwindcss` | `^3.4.0` | 유틸리티 CSS |
| `postcss` | `^8.4.0` | Tailwind 의존성 |
| `autoprefixer` | `^10.4.0` | 벤더 프리픽스 |
| `@types/react` | `^18.3.0` | 타입 |
| `@types/react-dom` | `^18.3.0` | 타입 |
| `eslint` | `^9.9.0` | 린트 |
| `@typescript-eslint/parser` | `^8.0.0` | TS 린트 파서 |
| `@typescript-eslint/eslint-plugin` | `^8.0.0` | TS 린트 룰 |

설치 후 `package.json` 의 `scripts` 에 다음 항목을 보장한다:
```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc -b --noEmit",
  "lint": "eslint . --ext .ts,.tsx"
}
```

---

## 3. 폴더 구조 (STEP 1 종료 시점)

```
hidden-bookstore/
├─ CLAUDE.md
├─ IMPLEMENTATION_LOG.md
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ postcss.config.js
├─ .env.example                  # Firebase + Kakao 키 템플릿
├─ .gitignore
├─ docs/                         # (기존)
├─ reference/                    # (기존)
└─ src/
   ├─ main.tsx                   # QueryClientProvider 마운트
   ├─ App.tsx                    # 라우터 + /preview 임시 페이지
   ├─ vite-env.d.ts              # VITE_* env 타입 선언
   ├─ components/
   │  ├─ primitives/
   │  │  ├─ Button.tsx
   │  │  ├─ Chip.tsx
   │  │  ├─ TextInput.tsx
   │  │  ├─ MapPin.tsx
   │  │  ├─ Pill.tsx
   │  │  └─ StatusBar.tsx
   │  └─ shared/
   │     └─ PhoneFrame.tsx       # /preview 데모용
   ├─ data/                      # (STEP 3에서 채움)
   ├─ lib/
   │  ├─ firebase.ts             # Firebase 초기화 (app, auth, db)
   │  ├─ queryClient.ts          # TanStack Query 클라이언트
   │  ├─ geo.ts                  # haversine (STEP 3에서 사용, 시그니처만 export)
   │  └─ tokens.ts               # JS 토큰 (lighten/darken 헬퍼 포함)
   ├─ pages/
   │  └─ preview/index.tsx       # 6 primitives 시각 검증 페이지
   ├─ stores/                    # (STEP 2부터 채움)
   └─ styles/
      └─ globals.css             # @import 폰트 + CSS 변수 + Tailwind directives
```

---

## 4. CSS 변수 토큰 (`src/styles/globals.css`)

`reference/claude_design/01_design_tokens.js` 의 `TOKENS` 객체를 CSS 변수로 1:1 매핑.

```css
:root {
  /* base */
  --bg-midnight: #13171E;
  --bg-deeper: #0D1116;
  --surface-01: #1D232C;
  --surface-02: #2A313C;
  --surface-03: #353D4A;
  --hairline: #2B323D;
  --hairline-strong: #3A4250;

  /* paper */
  --paper: #F2EAD9;
  --paper-soft: #E8DEC8;
  --paper-dim: #C3B9A6;
  --paper-mute: #847D70;

  /* accent (단 하나) */
  --accent-lamp: #F2B872;
  --accent-lamp-deep: #D99852;

  /* category pins */
  --pin-bookstore: #E8804D;
  --pin-library: #8AB293;
  --gold-visited: #F5CD6E;

  /* semantic */
  --ok: #8AB293;
  --error: #E07A6B;
  --info: #7AA5C4;

  /* font */
  --font-display-kr: '"Gowun Batang", "EB Garamond", serif';
  --font-display-en: '"EB Garamond", "Gowun Batang", serif';
  --font-ui: '"Pretendard Variable", "Pretendard", system-ui, sans-serif';
  --font-mono: '"IBM Plex Mono", ui-monospace, monospace';

  /* radius */
  --r-btn: 10px;
  --r-input: 12px;
  --r-card: 16px;
  --r-sheet: 24px;

  /* shadow */
  --shadow-soft: 0 8px 24px -10px rgba(30, 20, 12, 0.5);
  --shadow-warm: 0 18px 36px -16px rgba(30, 20, 12, 0.55), 0 4px 12px -2px rgba(20, 14, 8, 0.4);
  --shadow-glow: 0 0 28px -4px rgba(242, 184, 114, 0.33);
}

html, body, #root {
  height: 100%;
  background: var(--bg-midnight);
  color: var(--paper);
  font-family: var(--font-ui);
}
```

`@tailwind base/components/utilities` 디렉티브가 상단에, 폰트 `@import` 가 그 위에 위치한다.

---

## 5. Tailwind 설정 (`tailwind.config.ts`)

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class', // 사용은 안 하지만 명시
  theme: {
    extend: {
      colors: {
        bg: { midnight: '#13171E', deeper: '#0D1116' },
        surface: { '01': '#1D232C', '02': '#2A313C', '03': '#353D4A' },
        hairline: { DEFAULT: '#2B323D', strong: '#3A4250' },
        paper: { DEFAULT: '#F2EAD9', soft: '#E8DEC8', dim: '#C3B9A6', mute: '#847D70' },
        lamp: { DEFAULT: '#F2B872', deep: '#D99852' },
        pin: { bookstore: '#E8804D', library: '#8AB293' },
        gold: { visited: '#F5CD6E' },
        ok: '#8AB293',
        error: '#E07A6B',
        info: '#7AA5C4',
      },
      fontFamily: {
        display: ['"Gowun Batang"', '"EB Garamond"', 'serif'],
        'display-en': ['"EB Garamond"', '"Gowun Batang"', 'serif'],
        ui: ['"Pretendard Variable"', '"Pretendard"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { btn: '10px', input: '12px', card: '16px', sheet: '24px' },
      boxShadow: {
        soft: '0 8px 24px -10px rgba(30, 20, 12, 0.5)',
        warm: '0 18px 36px -16px rgba(30, 20, 12, 0.55), 0 4px 12px -2px rgba(20, 14, 8, 0.4)',
        glow: '0 0 28px -4px rgba(242, 184, 114, 0.33)',
      },
    },
  },
  plugins: [],
};

export default config;
```

CSS 변수 외에 Tailwind 클래스로도 동일 색을 노출하여 컴포넌트 작성을 단순화한다 (3중 노출: CSS 변수 / Tailwind 클래스 / `lib/tokens.ts` JS 객체).

---

## 6. 폰트 로드 전략

`src/styles/globals.css` 최상단에 다음을 작성:

```css
@import "pretendard/dist/web/variable/pretendardvariable.css";

@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

- **Pretendard**: `pretendard` npm 패키지 self-host (CDN 의존도 ↓)
- **Gowun Batang / EB Garamond / IBM Plex Mono**: Google Fonts CDN — 학교 시연 환경에서 인터넷 사용 가능 가정

오프라인 시연이 필요해지면 STEP 2 이후 self-host woff2 로 전환 (현재 결정: CDN 유지).

---

## 7. 구현할 Primitive 컴포넌트 (6개)

`reference/claude_design/02_shared_primitives.jsx` 의 비주얼을 재현하되, vanilla `style={}` 대신 Tailwind 클래스를 사용. 컴포넌트 시그니처는 다음 표 참조.

| Primitive | 주요 Props | 디자인 참조 |
|---|---|---|
| `Button` | `variant: 'primary' \| 'secondary'`, `fullWidth`, `disabled`, `onClick`, `children` | `PrimaryButton` / `SecondaryButton` |
| `Chip` | `active`, `leftDot?: string`, `onClick`, `children` | `Chip` (카테고리 토글용) |
| `TextInput` | `label`, `placeholder`, `value`, `onChange`, `type`, `validation?: { status: 'ok'\|'error'\|'info', message: string }` | `TextInput` (실시간 검증 UI) |
| `MapPin` | `type: 'bookstore' \| 'library'`, `visited?: boolean`, `size?: number`, `focused?: boolean` | `MapPin` SVG (`<path>` + `<defs>` + 골드 별 배지) |
| `Pill` | `emoji?: string`, `label`, `count?: number`, `muted?: boolean` | `MoodPill` 분위기 태그 표시용 |
| `StatusBar` | `tint?: 'paper' \| 'dark'` | iOS 풍 9:41 + 신호·와이파이·배터리 SVG |

핀은 **SVG `<path>` + radialGradient** 로 그린다 (이모지·lucide 사용 금지 — CLAUDE.md 핵심 제약).

각 컴포넌트는 named export, 파일당 1개. `src/components/primitives/index.ts` barrel export 추가.

---

## 8. `src/lib/*` 파일 명세

### `src/lib/firebase.ts`
```ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### `src/lib/queryClient.ts`
TanStack Query `QueryClient` 인스턴스 export. `staleTime: 30s`, `refetchOnWindowFocus: false`.

### `src/lib/geo.ts`
`haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number` 시그니처. STEP 3 에서 실제로 호출됨.

### `src/lib/tokens.ts`
`reference/claude_design/01_design_tokens.js` 의 `TOKENS` 객체를 TS 로 옮김. `lighten(hex, amt)` / `darken(hex, amt)` 헬퍼 동봉. `MapPin` 의 radialGradient 색 합성에 사용.

---

## 9. `/preview` 시각 검증 페이지

`src/pages/preview/index.tsx` — STEP 1 종료 시 시각 검증용. 6 primitives 를 모두 한 화면에 나열:

- Button (primary/secondary, 활성/비활성)
- Chip (전체/서점·헌책방/도서관·북카페/방문 완료)
- TextInput (검증 ok / error / 기본 상태 3종)
- MapPin (`bookstore`×미방문/방문 + `library`×미방문/방문 4종)
- Pill (☕ ×12 / 🤫 ×8 / 🌧️ ×4 muted)
- StatusBar

`src/App.tsx` 의 라우터에 단일 라우트 `/preview` 만 등록. 추후 STEP 2 에서 실제 라우트로 교체.

---

## 10. 환경변수 템플릿 (`.env.example`)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_KAKAO_JS_KEY=
```

`.gitignore` 에 `.env.local` 추가. 시연자는 `.env.example` 을 `.env.local` 로 복사 후 값 채움. **STEP 1 단계에서는 Firebase 실호출 없이 초기화만 수행** — 키가 비어 있어도 빌드/타입체크는 통과해야 함 (Firebase SDK 가 lazy 초기화).

---

## 11. 수정·생성 파일 목록 (총 23개)

**생성:**
- `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`
- `tailwind.config.ts`, `postcss.config.js`
- `index.html`
- `.env.example`, `.gitignore`
- `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`
- `src/styles/globals.css`
- `src/lib/firebase.ts`, `src/lib/queryClient.ts`, `src/lib/geo.ts`, `src/lib/tokens.ts`
- `src/components/primitives/{Button,Chip,TextInput,MapPin,Pill,StatusBar}.tsx`
- `src/components/primitives/index.ts`
- `src/components/shared/PhoneFrame.tsx`
- `src/pages/preview/index.tsx`

**수정:** 없음 (`CLAUDE.md`, `IMPLEMENTATION_LOG.md` 는 STEP 1 완료 시점에 진행 상황만 갱신).

---

## 12. STEP 1 자가 검증 (구현 후 실행)

```bash
# 1) 타입 체크 통과
npm run typecheck

# 2) 빌드 성공
npm run build

# 3) 개발 서버 200 응답
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
# → 200

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

---

## 13. 권장 커밋 메시지

```
feat(setup): 프로젝트 셋업 + 디자인 시스템 토큰 + primitives
```

---

## 14. 승인 필요 사항

다음 항목에 대해 사용자 승인 후 구현 시작:

1. **의존성 버전**: 위 표대로 진행할지 (Vite 5 / React 18 / Tailwind 3 / Firebase 10 — 안정 버전)
2. **폰트 로드 방식**: Pretendard npm + 나머지 3종 Google Fonts CDN (인터넷 시연 가정). 오프라인 필요 시 self-host woff2 로 변경 가능
3. **`/preview` 페이지 보존 여부**: STEP 1 검증용으로 만들고 STEP 2 에서 실제 라우트로 교체할 예정 — 일단 생성 후 STEP 2 에서 제거하는 흐름 OK?
4. **`tsc -b` 빌드 vs `tsc --noEmit`**: 위에서는 `build` 가 `tsc -b && vite build` 형태. 표준 Vite 템플릿 형태 유지

승인이 떨어지면 위 순서대로 셋업 → 의존성 설치 → 디자인 토큰 → primitives → preview 페이지 → 자가 검증 실행 → IMPLEMENTATION_LOG 갱신을 수행한다.
