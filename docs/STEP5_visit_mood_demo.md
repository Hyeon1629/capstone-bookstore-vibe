# STEP 5 — GPS 방문 인증 + 분위기 입력 + 시연 모드 (설계 문서)

> 발표 시연의 핵심. "방문 인증 후의 가장 기쁜 순간 — 한 호흡 머무는 모달"
> Plan 단계 산출물. 사용자 승인 후 본 명세대로 구현한다.

---

## 1. GPS 인증 트리거 정책

| 조건 | 동작 |
|---|---|
| GPS 권한 허용 + 책방 50m 이내 + 5초 체류 | 자동 인증 트리거 |
| 시연 모드 ON + 핀 long-press (500ms) | 거리 검사 우회 즉시 트리거 |
| 동일 책방 24시간 내 재방문 | 인증 스킵 (toast "이미 방문 인증한 책방이에요") |
| GPS 권한 거부 + 시연 모드 OFF | 인증 불가 (별도 UI 안내는 STEP 5 범위 외 — 기존 fallback 유지) |

CLAUDE.md 의 50m + 5초 (시연용 단축) 정책 유지.

---

## 2. 시연 모드 (DemoStore)

### `src/stores/demoStore.ts`
```ts
interface DemoState {
  isDemoMode: boolean;
  mockUserLocation: { lat: number; lng: number } | null;
  setDemoMode: (b: boolean) => void;
  setMockLocation: (loc: { lat: number; lng: number } | null) => void;
}
```

### UI
- **마이페이지** 의 placeholder 영역 안에 `DemoModeToggle` 컴포넌트 추가 (STEP 6 전에 미리 한 줄 토글만)
- **지도 우상단** 작은 `DemoModeBadge` (배지 + "시연 모드" 라벨, lamp 색 보더)
- 토글 ON 상태는 localStorage 에 persistent — `localStorage.demoMode = 'true'` (시연 환경 단순화). zustand 의 `subscribe` 로 동기화.

### 동작 (시연 모드 ON 시)
1. 지도 우상단에 작은 배지 노출
2. 핀 long-press(500ms hold) → `mockUserLocation = pin.coords` 설정 → 인증 트리거
3. 50m 거리 검사 우회. 5초 체류 우회 (즉시 트리거)
4. 24시간 중복 검사는 유지 (시연 중 같은 핀을 5번 누르는 실수를 막기 위해). 단 **마이페이지에서 [방문 기록 초기화] 버튼**으로 reset 가능 — STEP 5 에서 함께 제공? **(승인 항목 1)**

권장: STEP 5 에서는 시연 모드 토글 + long-press 만. "방문 기록 초기화" 는 STEP 6 마이페이지에서 본격 처리 (또는 시연 직전 Firebase Console 에서 visits 컬렉션 비우기).

---

## 3. GPS 위치 추적 — `src/hooks/useGeolocation.ts`

```ts
interface UseGeolocationResult {
  position: { lat: number; lng: number } | null;
  error: string | null;
  isWatching: boolean;
}

export function useGeolocation(): UseGeolocationResult;
```

### 동작
- `navigator.geolocation.watchPosition` 으로 위치 추적
- 시연 모드 ON 시 `mockUserLocation` 우선 반환 (실 GPS 무시)
- throttle 30초: 동일 위치 30초 내 재emit 방지 (배터리 절약)
- 컴포넌트 unmount 시 `clearWatch`

### 호출 위치
- `MapPage` 마운트 시 호출하여 mapStore.userLocation 갱신
- (현재 `MapPage` 에서 `getCurrentPosition` 1회 호출 → 본 STEP 에서 watch 로 업그레이드)

---

## 4. 인증 자동 감지 — `src/hooks/useVisitAutoDetect.ts`

```ts
export function useVisitAutoDetect(userId: string | null): {
  pendingVisit: { bookstore: Bookstore } | null;
  triggerByLongPress: (bookstore: Bookstore) => void;
  dismiss: () => void;
};
```

### 알고리즘
1. `useGeolocation` 으로 사용자 위치 변경 감지
2. 모든 시드 책방과 haversine 거리 계산
3. 50m 이내 + 5초 체류 → `pendingVisit` 설정
4. `pendingVisit` 가 set 되면 페이지 컴포넌트(MapPage)가 인증 시퀀스 시작
5. `triggerByLongPress(bookstore)`: 시연 모드용 즉시 트리거 (거리·체류 검사 우회, 단 24h 중복 검사는 적용)

체류 검증은 `setTimeout(5000)` + 동일 책방이 여전히 50m 이내일 때만 트리거.

---

## 5. 인증 시퀀스 UI

### 단계
1. 책방 진입 감지 → **RadarPulse** 오버레이 (지도 화면 풀스크린)
2. 2초 후 → **PaperFadeOverlay** (250ms paper 컬러 페이드인, 방문 확인 신호)
3. 페이드 완료 → **MoodInputModal** open (분위기 입력)

### `RadarPulse`
- 풀스크린 fixed overlay, z-index 50
- 책방 위치 핀이 화면 중앙으로 setCenter 된 상태
- info(`#7AA5C4`) 컬러 3개 동심원 ring (0.6s 간격 staggered)
- 각 ring: `scale 0→2`, `opacity 1→0`, 2초간 유지 후 dismiss

### `PaperFadeOverlay`
- 풀스크린 fixed overlay
- `background: paper`, `opacity: 0→1→0` (250ms in, 100ms hold, 250ms out)
- z-index 60

### `MoodInputModal`
- `reference/claude_design/05_screens_mood_bookshelf_mypage.jsx` 의 `MoodInputScreen` 재현
- 황금 스탬프 (radial gradient + 외곽 점선 회전 ring 12s linear infinite)
- 배경 7개 스파클 (3s ease-in-out, staggered 0~1.6s delay)
- 5개 이모지 카드 (☕ 🌧️ 🎶 🤫 ☀️), 단일 선택, 선택 시 `translateY -2px` + lamp 보더
- [북쉘프에 기록하기] / [건너뛰기]
- 완료 시 Firestore moodTags 추가 → `/bookshelf` 이동

### `DemoModeBadge`
- 우상단 작은 칩, lamp 보더, mono "시연 모드 · DEMO" 라벨
- 시연 모드 ON 일 때만 렌더

---

## 6. Firestore 호출 — `src/lib/firestore.ts` 추가

```ts
export interface VisitDoc {
  id: string;
  userId: string;
  bookstoreId: string;
  visitedAt: Timestamp;
}

export async function addVisit(args: { userId: string; bookstoreId: string }): Promise<void>;
export async function addMoodTag(args: { userId: string; bookstoreId: string; emoji: MoodEmoji }): Promise<void>;
export async function hasRecentVisit(args: { userId: string; bookstoreId: string }): Promise<boolean>;  // 24h 내
export async function fetchUserVisits(userId: string): Promise<VisitDoc[]>;  // STEP 6 에서도 사용
```

### `hasRecentVisit` 알고리즘
```ts
const cutoff = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
query(collection(db, 'visits'),
  where('userId', '==', userId),
  where('bookstoreId', '==', bookstoreId),
  where('visitedAt', '>=', cutoff),
);
const snap = await getDocs(q);
return !snap.empty;
```

### Firestore 인덱스
`visits` 컬렉션의 `userId + bookstoreId + visitedAt` 복합 인덱스가 첫 쿼리 시도 시 자동 생성 제안됨 (Firebase Console). 시연자가 콘솔에서 [생성] 클릭. **(승인 항목 2)** — 사전 안내?

---

## 7. 인증 트리거 핸들러 (MapPage)

```tsx
function MapPage() {
  const { pendingVisit, triggerByLongPress, dismiss } = useVisitAutoDetect(uid);
  // pendingVisit 변경 시 인증 시퀀스 단계 진행
  const [step, setStep] = useState<'idle' | 'radar' | 'fade' | 'mood'>('idle');
  useEffect(() => {
    if (pendingVisit && step === 'idle') {
      setStep('radar');
      setTimeout(() => setStep('fade'), 2000);
      setTimeout(() => setStep('mood'), 2250);
    }
  }, [pendingVisit, step]);
  // ...
}
```

핀 long-press 는 `MapPinOverlay` 에 onLongPress prop 추가:
```ts
function MapPinOverlay({ onLongPress, ... }) {
  // pointerdown → setTimeout 500ms → fire onLongPress(id). pointerup/move → clear.
}
```

시연 모드 OFF 일 때 long-press 는 무시.

---

## 8. visits 갱신 + 지도 핀 상태

방문 완료 후 mapStore 에 별도 visited Set 을 두지 않고, **Firestore visits 를 TanStack Query 로 구독**하는 hook 을 새로 만든다:

```ts
// src/hooks/useUserVisits.ts (STEP 5 + 6 공용)
export function useUserVisits(userId: string | null) {
  return useQuery({
    queryKey: ['visits', userId],
    queryFn: () => userId ? fetchUserVisits(userId) : Promise.resolve([]),
    enabled: !!userId,
  });
}
```

`MapPage` 가 이 hook 의 결과를 사용해 `visitedIds` Set 구성. 인증 후 `queryClient.invalidateQueries(['visits', uid])` 로 즉시 핀에 골드 배지 표시.

이로써 지도 + 책방 상세 + 북쉘프 모두 같은 SoT 사용.

---

## 9. 비주얼 노트 (디자인 시안 일치)

`reference/claude_design/05_screens_mood_bookshelf_mypage.jsx` 의 `MoodInputScreen` 정확히 재현:
- 카드: surface-01 + hairline-strong + 24px radius + shadow-warm + shadow-glow
- 황금 스탬프 72×72 (radial gradient + 점선 외곽 ring 12s linear)
- eyebrow `STAMP COLLECTED · #013` (mono, lamp, tracking 3, uppercase)
- 헤딩 `방문 인증 완료` (Gowun Batang 24px)
- 부카피 `${name} 에 다녀오셨네요.` (paper-dim)
- divider gradient 라인
- 5개 이모지 grid (gap 6, padding 12 4)
- Primary `북쉘프에 기록하기` + [건너뛰기]

---

## 10. 수정·생성 파일 목록

### 생성
- `src/stores/demoStore.ts`
- `src/hooks/useGeolocation.ts`
- `src/hooks/useVisitAutoDetect.ts`
- `src/hooks/useUserVisits.ts`
- `src/components/visit/RadarPulse.tsx`
- `src/components/visit/PaperFadeOverlay.tsx`
- `src/components/visit/MoodInputModal.tsx`
- `src/components/visit/Sparkles.tsx`
- `src/components/map/DemoModeBadge.tsx`
- `src/components/shared/DemoModeToggle.tsx`

### 수정
- `src/lib/firestore.ts` — `addVisit`, `addMoodTag`, `hasRecentVisit`, `fetchUserVisits`, `VisitDoc` 추가
- `src/components/map/MapPinOverlay.tsx` — `onLongPress` prop + pointer 핸들러
- `src/pages/map/index.tsx` — 인증 시퀀스 통합, 시연 모드 배지, 사용자 visits 구독
- `src/pages/mypage/index.tsx` — 시연 모드 토글 + (선택) 방문 기록 초기화 버튼

---

## 11. 자가 검증 (STEP 5 완료 시)

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) Geolocation 훅 throttle 검증
grep -E "throttle|30_000" src/hooks/useGeolocation.ts   # → 1건 이상

# 3) 시연 모드 store 정의
grep -E "isDemoMode|mockUserLocation" src/stores/demoStore.ts | wc -l   # → 최소 2

# 4) Firestore 함수
grep -E "addVisit|addMoodTag|hasRecentVisit" src/lib/firestore.ts | wc -l   # → 최소 3

# 5) 24시간 중복 방지 로직
grep -i "24" src/lib/firestore.ts   # → 1건 이상

# 6) Dev 서버 200
npm run dev   # → http://localhost:5173

# 7) 수동 시연 (README_TEST.md 시나리오 R~U):
#    - 시연 모드 OFF: 책방 근처 가지 않으면 인증 X
#    - 시연 모드 ON: 핀 long-press → radar pulse 2초 → paper fadein → 모달 → 이모지 → 완료 → /bookshelf
#    - 동일 책방 24h 내 재시도 → 중복 방지 메시지
```

---

## 12. 권장 커밋 메시지

```
feat(visit): GPS 자동 인증 + 분위기 모달 + 시연 모드
```

---

## 13. 승인 필요 사항

1. **방문 기록 초기화 버튼**: STEP 5 에서 마이페이지에 추가 vs STEP 6 에서 본격 / 시연 직전 콘솔 수동 비우기 (권장: 시연 직전 콘솔 수동 — STEP 5 범위 단순화. 다만 토글 옆 "초기화" 버튼 한 줄 추가는 비용 낮음 → 사용자 선택)
2. **Firestore visits 인덱스**: 첫 쿼리 시 콘솔에서 자동 생성 안내. README_TEST 에 명시 OK?
3. **GPS watchPosition** vs `getCurrentPosition` 1회 호출: 현재 MapPage 는 1회만. STEP 5 에서는 watchPosition 으로 업그레이드 (시연 시 위치 변경 반영) — OK?
4. **분위기 모달의 ESC/배경 클릭 닫기**: 실수로 닫는 위험 vs UX. 권장: ESC 만 닫기 가능, 배경 클릭은 무시 (5 이모지 선택을 유도)

승인이 떨어지면 demoStore → hooks → firestore 헬퍼 → 4 컴포넌트 → MapPage 통합 → 자가 검증 순서로 구현한다.
