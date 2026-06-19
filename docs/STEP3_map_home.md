# STEP 3 — 지도 홈 (설계 문서) ⭐

> 본 프로젝트의 가장 중요한 화면. "동네에 책방이 이렇게 많았다" 의 와우 모먼트.
> Plan 단계 산출물. 사용자 승인 후 본 명세대로 구현한다.

---

## 1. 카카오 맵 SDK 통합

### 로드 방식
**`index.html` 정적 스크립트** + `autoload=false` + JS 동적 `load()` 호출.

```html
<!-- index.html <body> 안, root 위에 -->
<script
  type="text/javascript"
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=%VITE_KAKAO_JS_KEY%&autoload=false"
></script>
```

Vite 는 `index.html` 에서 `%VITE_*%` 토큰을 빌드 시 치환한다. `autoload=false` 로 두면 `kakao.maps.load(cb)` 호출 시점에 본 SDK 가 init 됨 → 라우트 진입 시 동기 로드 효과 + `useKakaoMap` hook 이 ready 시점 보장 가능.

### 타입 선언
`@types/kakao.maps.d.ts` 또는 `src/types/kakao.d.ts` 에 최소한의 declare:

```ts
declare global {
  interface Window {
    kakao: typeof kakao;
  }
}
declare namespace kakao.maps {
  function load(cb: () => void): void;
  // Map, LatLng, CustomOverlay, ... 필요한 것만 추가
}
```

타입을 너무 정밀하게 짜면 시연용 범위 초과. 필요한 것만 minimal 하게.

### `useKakaoMap` 커스텀 훅
`src/hooks/useKakaoMap.ts`

```ts
interface Options {
  center: { lat: number; lng: number };
  level?: number; // 카카오 zoom level (1~14, 낮을수록 줌인)
}
export function useKakaoMap(containerRef: RefObject<HTMLDivElement>, options: Options): {
  map: kakao.maps.Map | null;
  isReady: boolean;
};
```

- `kakao.maps.load(...)` 콜백 안에서 `new kakao.maps.Map(...)` 생성
- 라이트 톤 기본 스타일 유지 (다크 필터 ❌ — CLAUDE.md 제약)
- `map` 인스턴스를 ref/state 로 노출하여 컴포넌트가 CustomOverlay 추가 가능

---

## 2. 책방 시드 데이터

`src/data/bookstores.ts`. 총 **17곳** (마포 8 + 성동 5 + 종로 4).

### TypeScript 인터페이스
```ts
export type BookstoreCategory = 'bookstore' | 'library';

export interface Bookstore {
  id: string;
  name: string;
  category: BookstoreCategory;
  address: string;
  dong: string;
  lat: number;
  lng: number;
  hours: string;       // "09:00-22:00" 또는 "평일 09:00-22:00, 주말 09:00-20:00"
  phone?: string;
  specialtyTags: string[];   // 1~3개
  photos: string[];          // placeholder URL
  seedMoods?: { emoji: 'coffee' | 'rain' | 'music' | 'quiet' | 'sun'; count: number }[];
}
```

### 17곳 명단 (마포 8)

| id | 이름 | 카테고리 | 동 | 좌표 | 비고 |
|---|---|---|---|---|---|
| `mapo-seogang-lib` | **마포구립서강도서관** | library | 신수동 | 37.5485 / 126.9430 | **실제 좌표 + 02-3141-7053** |
| `mapo-sogang-loyola` | **서강대학교 로욜라도서관** | library | 신수동 | 37.5510 / 126.9415 | **실제 좌표** |
| `mapo-banpo-books` | 반포 책방 | bookstore | 합정동 | 37.5505 / 126.9136 | |
| `mapo-late-shelf` | 늦은 책장 | bookstore | 망원동 | 37.5556 / 126.9101 | seedMoods (☕ 8) |
| `mapo-indie-press` | 독립출판 라운지 | bookstore | 연남동 | 37.5598 / 126.9242 | seedMoods (🤫 5) |
| `mapo-gureum` | 구름책방 | bookstore | 상수동 | 37.5466 / 126.9230 | |
| `mapo-namu-cafe` | 나무북카페 | library | 동교동 | 37.5562 / 126.9180 | seedMoods (☕ 12) |
| `mapo-warm-pendant` | 따뜻한 펜던트 | library | 합정동 | 37.5495 / 126.9128 | seedMoods (☀️ 4) |

### 5곳 (성동 5)
| id | 이름 | 카테고리 | 동 | 좌표 |
|---|---|---|---|---|
| `seong-seongsu` | 성수 책방 | library | 성수동1가 | 37.5446 / 127.0559 |
| `seong-indie-lounge` | 독립 책방 A | bookstore | 성수동2가 | 37.5424 / 127.0578 |
| `seong-quiet-lib` | 책 사이 도서관 | library | 성수동1가 | 37.5460 / 127.0540 |
| `seong-yagan` | 야간 독서실 | library | 뚝섬 | 37.5470 / 127.0470 |
| `seong-noteandpage` | 노트 앤 페이지 | library | 옥수동 | 37.5400 / 127.0220 |

### 4곳 (종로 4)
| id | 이름 | 카테고리 | 동 | 좌표 |
|---|---|---|---|---|
| `jongno-deep-book` | 책방 모래 | bookstore | 인사동 | 37.5719 / 126.9858 |
| `jongno-buchnara` | 부엌나라 헌책방 | bookstore | 종로5가 | 37.5704 / 126.9990 |
| `jongno-lamp-lib` | 등잔 도서관 | library | 익선동 | 37.5732 / 126.9885 |
| `jongno-papershop` | 종이서점 | bookstore | 청운동 | 37.5847 / 126.9700 |

### 시연 핵심
**검색 → "서강" 입력 → 마포구립서강도서관 + 서강대 로욜라 2곳 강조** 가 발표 시연 7번 순서.

### 사진
모두 placeholder URL: `https://placehold.co/600x400/{색}/F2EAD9?text=책방+사진+N` 형태로 2~3장씩.

### 시드 분위기 태그 (5~7곳)
위 표의 `seedMoods` 컬럼이 있는 4곳 + 추가 3곳 (성수 책방, 책 사이 도서관, 책방 모래). 본 데이터는 **데이터 객체 안에 직접 포함**되어 STEP 4 의 분위기 집계가 Firestore 가 비어 있어도 의미 있게 표시되도록 한다. STEP 5 에서 Firestore moodTags 가 채워지면 자연스럽게 그쪽이 우선 표시되도록 책방 상세에서 `Math.max(seed.count, firestore.count)` 합산 로직 적용 예정.

---

## 3. SVG 핀을 카카오 맵 위에 올리는 방식

### `kakao.maps.CustomOverlay` + ReactDOM.createPortal

```ts
// 1) 컨테이너 div 를 메모리에 생성
const el = document.createElement('div');
// 2) CustomOverlay 에 등록
new kakao.maps.CustomOverlay({
  position: new kakao.maps.LatLng(lat, lng),
  content: el,
  yAnchor: 1.0,  // 핀 끝이 좌표를 가리키도록
});
// 3) React 컴포넌트를 portal 로 렌더
createPortal(<MapPin .../>, el);
```

이 방식의 장점: 카카오 SDK 의 좌표·줌·패닝은 그대로 활용, 핀 비주얼은 100% React + SVG.

### 핀 클릭 핸들러
overlay 의 `el` 에 `onClick` 을 React 트리에서 등록. 직접 `el.addEventListener` 도 가능하지만 React 트리에 통합되어 zustand 호출이 자연스러움.

### 펜던트 글로우
`MapPin` 의 focused prop 으로 이미 구현됨 (STEP 1). 본 STEP 에서 `focusedPinId === pin.id` 일 때 focused 전달.

핀 자체의 항상-pulse 글로우 (`lampGlow` 4s loop)는 우선순위 P1 으로 강등. 시연에 영향 없으면 STEP 3 에서는 호버 시 글로우만 적용하고, 핀 자체의 idle pulse 는 향후 작업으로 남김. **(승인 항목 1)**

---

## 4. 카테고리 토글 칩

상단 검색바 아래 가로 배치.

| 칩 | 활성 시 | 상태값 |
|---|---|---|
| 전체 · 17 | bg paper, text bg-midnight, font-semibold | `category: 'all'` |
| 서점·헌책방 | leftDot pin-bookstore | `category: 'bookstore'` |
| 도서관·북카페 | leftDot pin-library | `category: 'library'` |
| 방문 완료 · N | leftDot gold-visited | `category: 'visited'` (필터링 적용) |

`방문 완료` 칩은 본 STEP 에서 비활성 디스플레이로 두고 (visit 데이터 없음), STEP 5/6 에서 실제 필터 활성.

토글에 따라 `filteredPins` 가 변경되고, **mapStore 의 `filterCategory` 가 SoT**. CustomOverlay 들은 매번 `setMap(null)` → 재추가하지 않고, `el.style.display = filtered ? 'block' : 'none'` 으로 토글 (성능 최적화).

---

## 5. 책방 이름 검색바

- 부분 일치 (대소문자/공백 무시: `String.prototype.normalize` 와 lowercase 후 includes)
- 입력 즉시 핀 강조 — `searchQuery` 가 비어있지 않으면 매칭 핀은 z-index ↑, 비매칭 핀 opacity 0.3
- 입력 0건이면 빈 상태 carrousel: "근처에 일치하는 책방이 없어요" (지도 위 floating 메시지)

검색바는 헤더에 위치. 클릭 시 expand 애니메이션은 P1 (생략 OK).

---

## 6. 핀 탭 → 미리보기 시트

`PinPreviewSheet` 컴포넌트:
- 좌측: 사진 1장 (placeholder, 72×72 rounded)
- 중앙: 카테고리 dot + 카테고리명(uppercase mono) + VISITED 배지 + 책방명 + 영업상태/거리
- 우측: [상세] 버튼 → `/bookstore/:id` (STEP 4 에서 실제 화면)

시트 진입 애니메이션: `translateY 20→0, opacity 0→1, 250ms ease` — Framer Motion `<motion.div initial animate>`.

FAB 위치 보정: 시트 열리면 `bottom 24 → 168` 트랜지션 (250ms).

---

## 7. 초기 진입 핀 staggered reveal

`useEffect` 에서 핀 배열을 순회하면서 80ms 간격으로 각 핀의 `visible` 플래그를 true 로 set. CSS transition `scale 0→1.08→1` (CSS `@keyframes` + `animation: pinReveal 0.4s ease`).

---

## 8. 현재 위치 FAB

- 오른쪽 하단, 시트 미오픈 시 `bottom: 24px`, 시트 오픈 시 `168px`
- lamp 색 navigation 글리프 (SVG)
- 탭 시 `map.setCenter(userLatLng)` 호출
- 사용자 위치 없으면 (권한 거부) 마포구립서강도서관 좌표를 fallback center 로 사용

---

## 9. BottomNav (3개 탭)

`src/components/shared/BottomNav.tsx` 신규 생성. STEP 6 까지 공유.

| 탭 | 경로 | 아이콘 (filled when active) |
|---|---|---|
| 지도 | `/map` | IconMap |
| 북쉘프 | `/bookshelf` | IconShelf |
| 마이 | `/mypage` | IconUser |

`/bookshelf`, `/mypage` 는 본 STEP 에서 라우트만 추가하고 placeholder 페이지 (STEP 6 에서 구현). 또는 disabled 상태로 두고 클릭 시 "곧 만나요" alert. **(승인 항목 2)** — placeholder 페이지 권장.

---

## 10. 상태 관리 — `src/stores/mapStore.ts` (zustand)

```ts
interface MapState {
  filterCategory: 'all' | 'bookstore' | 'library' | 'visited';
  searchQuery: string;
  focusedPinId: string | null;
  userLocation: { lat: number; lng: number } | null;

  setFilterCategory: (c: MapState['filterCategory']) => void;
  setSearchQuery: (q: string) => void;
  setFocusedPinId: (id: string | null) => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
}
```

기존 `mapInitStore` 는 통합되지 않고 별도 유지 (`fallbackArea` 만 담당). 분리 유지 OK?

---

## 11. 초기 중심점 결정

- `userLocation` 이 있으면 그것
- 없으면 마포구립서강도서관 좌표 (`37.5485, 126.9430`) — 시연 데이터 분포 중심
- level: 4 (반경 약 1km 내 핀들이 한 화면에 들어옴)

---

## 12. 비주얼 일관성

`reference/claude_design/04_screens_map_detail.jsx` 의 비주얼 노트:
- 상단 헤더: `SEONGSU · 성수동` eyebrow (IBM Plex Mono 10.5px, 트래킹 3) + "반경 2km 안에 책방 N곳" 헤드라인
- 검색바: surface-01 배경, 활성 시 lamp 보더
- ⌘K 캡션 (시연에는 굳이 안 쓰여도 비주얼 일치)
- 미리보기 시트: surface-01 + hairline + shadow-warm + [상세] 버튼 paper 컬러

지도 자체는 **카카오 라이트 톤 유지**. CLAUDE.md 제약대로 인위적 다크 필터 적용 금지. 헤더와 BottomNav 만 다크.

---

## 13. 수정·생성 파일 목록

### 생성
- `src/data/bookstores.ts`
- `src/hooks/useKakaoMap.ts`
- `src/types/kakao.d.ts`
- `src/stores/mapStore.ts`
- `src/components/map/MapPinOverlay.tsx` (CustomOverlay + portal 매니저)
- `src/components/map/PinPreviewSheet.tsx`
- `src/components/map/CategoryChips.tsx`
- `src/components/map/SearchBar.tsx`
- `src/components/map/CurrentLocationFAB.tsx`
- `src/components/map/MapHomeMap.tsx` (카카오 맵 컨테이너 + 핀 매니저)
- `src/components/shared/BottomNav.tsx`
- `src/pages/bookshelf/index.tsx` (placeholder)
- `src/pages/mypage/index.tsx` (placeholder)

### 수정
- `index.html` — 카카오 SDK `<script>` 추가
- `src/App.tsx` — `/bookshelf`, `/mypage` 라우트 + `/bookstore/:id` placeholder
- `src/pages/map/index.tsx` — placeholder 제거 후 실제 지도 홈으로 교체
- `src/main.tsx` (필요 시) — 변경 없음 예상

### 미생성 (STEP 4 에서)
- `src/pages/bookstore/[id]/index.tsx` — STEP 4

---

## 14. 자가 검증 (STEP 3 완료 시)

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) 시드 데이터 검증 — bookstores.ts 직접 import 가능한 헬퍼 스크립트로 검증
#    (학교 과제 범위에서 별도 테스트 러너 도입 없이, vite preview + 콘솔 로그로 시각 확인)
node --input-type=module -e "
  import('./src/data/bookstores.ts').then(m => {
    console.assert(m.BOOKSTORES.length === 17, 'expected 17');
    const seogang = m.BOOKSTORES.find(b => b.name.includes('마포구립서강'));
    console.assert(seogang, '마포구립서강도서관 missing');
    const sogang = m.BOOKSTORES.find(b => b.name.includes('서강대학교 로욜라'));
    console.assert(sogang, '서강대 로욜라도서관 missing');
    const mapo = m.BOOKSTORES.filter(b => b.address.includes('마포구'));
    console.assert(mapo.length >= 5, 'Mapo >= 5');
    console.log('✅ 시드 데이터 검증 통과');
  });
"
# (Vite/TS import 직접 실행이 어려우면 → `npm run build && grep` 으로 dist 검증으로 대체)

# 3) 핀이 SVG (이미 STEP 1 에서 보장됨)
grep -r "lucide-react" src/components/map/  # → 0

# 4) 카카오 SDK 로드
grep "dapi.kakao.com" index.html | wc -l   # → 1 이상

# 5) zustand store 4 필드
grep -E "(filterCategory|searchQuery|focusedPinId|userLocation)" src/stores/mapStore.ts | wc -l
# → 최소 4

# 6) Dev 서버 200 + 수동 시연
npm run dev  # → http://localhost:5173/map
```

### 수동 시연 (README_TEST.md 에 추가)
- `/map` 진입 시 17개 핀 표시
- 카테고리 토글 시 해당 색 핀만
- "서강" 검색 → 마포구립서강도서관 + 서강대 로욜라도서관 강조
- 핀 탭 → 하단 시트 슬라이드 업
- [상세] 클릭 → `/bookstore/{id}` (STEP 4 placeholder)
- BottomNav 탭 전환 작동
- 현재 위치 FAB 클릭 → 사용자 좌표로 setCenter (권한 거부 시 fallback)

---

## 15. 권장 커밋 메시지

```
feat(map): 지도 홈 + 카카오 맵 + 17개 책방 핀 + 필터·검색
```

---

## 16. 승인 필요 사항

1. **핀 idle pulse 글로우**: STEP 3 에서는 호버 시 글로우만, 항상 pulse 는 P1 으로 강등 OK?
2. **`/bookshelf`, `/mypage` placeholder**: 라우트 + placeholder 페이지 추가 권장 (BottomNav 클릭 시 alert 보다 자연스러움)
3. **`/bookstore/:id` placeholder**: 미리보기 시트 [상세] 클릭 시 단순 "STEP 4 에서 본격 구현" placeholder 페이지로 이동 OK?
4. **카카오 도메인 등록 확인**: 카카오 개발자 콘솔 → 플랫폼 → Web 도메인에 `http://localhost:5173` 추가 되어 있나? 없으면 SDK 가 401 반환

승인이 떨어지면 시드 데이터 → 카카오 SDK → mapStore → 컴포넌트 5종 → 페이지 교체 → 자가 검증 순서로 구현한다.
