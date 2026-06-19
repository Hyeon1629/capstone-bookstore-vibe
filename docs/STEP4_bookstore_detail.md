# STEP 4 — 책방 상세 (설계 문서)

> 정보 밀도가 가장 높은 화면. "인스타에 캡처해서 올리고 싶은" 시각 품질이 핵심.
> Plan 단계 산출물. 사용자 승인 후 본 명세대로 구현한다.

---

## 1. 라우트

이미 `/bookstore/:id` 라우트가 STEP 3 에서 placeholder 로 추가됨. 본 STEP 에서는 동일 라우트의 컴포넌트 내용을 실제 상세 페이지로 교체.

- `useParams<{ id: string }>()` 로 id 추출
- `getBookstoreById(id)` 로 시드 lookup
- 미발견 시 404 카드 + [지도로 돌아가기] (이미 placeholder 에 구현됨)

---

## 2. 화면 구성 (위→아래)

1. **사진 슬라이드** (320px 높이, 전체 너비 풀블리드)
   - bookstore.photos 3장
   - 좌우 스와이프 (Framer Motion `drag="x"`) 또는 도트 클릭
   - 크로스페이드 0.3s (translate 슬라이드 ❌)
   - 우상단 도트 인디케이터: 활성 18px width, 비활성 6px
   - 우하단 사진 카운터 `1 / 3` (IBM Plex Mono)
   - 상단 뒤로가기 + 북마크 + 공유 버튼 (rgba 백드롭 블러)
   - 하단 그라데이션 오버레이 (스크롤 시 헤더가 사진을 깔끔하게 분리)

2. **헤더 정보 카드** (사진 아래)
   - 카테고리 dot + 카테고리명(uppercase mono) + 우측 VISITED 배지 (visit 데이터 시 표시)
   - 책방명 H1 (Gowun Batang 26px, -0.6 letter-spacing)
   - 영문 부카피 (EB Garamond Italic, 회색) — 책방명을 음차 변환하지 않고 영어 alias 로 매핑. **데이터에 없으니 일단 책방명 자체 표시 + STEP 4 단계에서는 영문 부카피 생략 가능 (양보)**

3. **메타 정보 행 (영업 상태)**
   - `● 영업 중` (ok 컬러) / `● 영업 종료` (paper-mute) / `● 곧 종료` (error tinted)
   - 오늘 영업시간 (Pretendard 12.5px, paper-dim)

4. **주소·전화 행 2건** (`DetailRow`)
   - 주소 — IconNav glyph + `${address}` + `${distance}km · 도보 ${min}분`
   - 전화 — IconPhone glyph + `${phone}` (없으면 행 자체 미렌더)

5. **분위기 태그 섹션**
   - eyebrow `최근 방문자가 느낀 분위기` (mono 11.5px, paper-mute)
   - `MoodPill` (= 기존 `Pill`) 카드 가로 나열. 상위 3종 표시. 그 외는 muted.

6. **사진 더 보기** (P1 — 생략 OK)
   - 3:1 그리드. STEP 4 에서 가능하면 추가, 시간 부족하면 P1 으로 강등

7. **하단 고정 액션 바**
   - `[전화]` `[길찾기]` `[공유]` 3분할
   - 가운데 [길찾기] 가 Primary (paper 컬러). 좌우는 surface-02.
   - position: sticky bottom + backdrop-blur

---

## 3. 영업 상태 계산 — `src/lib/businessHours.ts`

### 입력 포맷
- 단순: `"09:00-22:00"`
- 분리: `"평일 09:00-22:00, 주말 09:00-20:00"` 또는 `"평일 09:00-22:00, 주말 09:00-17:00"`
- 매우 단순: 본 시연에서는 위 두 패턴만 지원. 휴무일 패턴 (`"화요일 휴무"`) 은 미지원으로 둠.

### 시그니처
```ts
export type BusinessStatus =
  | { kind: 'open'; closesAt: string }     // "22:00"
  | { kind: 'closing-soon'; closesAt: string; minutesLeft: number }
  | { kind: 'closed'; opensAt: string | null };

export function getBusinessStatus(hours: string, now: Date = new Date()): BusinessStatus;
export function getTodayHours(hours: string, now: Date = new Date()): string;  // "10:00 - 22:00"
```

### 알고리즘
1. now 가 평일/주말인지 판단 (월~금 = 평일, 토일 = 주말)
2. 콤마로 split → "평일 ..."  / "주말 ..." 토큰 매칭. 매칭 없으면 단순 패턴으로 처리
3. 시간 파싱 `09:00` → `9 * 60 + 0` 분
4. 현재 분과 비교
   - 영업 시간 내 + 종료까지 30분 이내 → `closing-soon`
   - 영업 시간 내 → `open`
   - 그 외 → `closed`

### 단위 테스트 (수동 실행 가능한 형태)
시간이 부족하면 `src/lib/businessHours.test.ts` 대신 `src/lib/businessHours.demo.ts` 같은 간단한 자가 검증 스크립트 (콘솔 출력) 로 5개 케이스 검증. **(승인 항목 1)**: 정식 vitest 도입 vs 콘솔 데모 스크립트?

권장: 콘솔 데모 스크립트 — vitest 도입은 학교 과제 범위를 넘어 STEP 별 자가 검증 흐름과 통합하기 번거로움.

---

## 4. 분위기 태그 집계 — `src/hooks/useMoodTags.ts`

### TanStack Query
```ts
const { data, isLoading } = useQuery({
  queryKey: ['moodTags', bookstoreId],
  queryFn: () => fetchMoodTags(bookstoreId),
  staleTime: 60_000,
});
```

### `fetchMoodTags(bookstoreId)` (in `src/lib/firestore.ts`)
- Firestore `moodTags` 컬렉션 where `bookstoreId == id` 또한 `createdAt >= now - 7d`
- 이모지 별 카운트 reduce → `{ coffee: 12, quiet: 8, ... }`

### 시드 데이터 머지 (CLAUDE.md 의 "외부 API 의존성 안 만들기" 정신)
```ts
const mergedMoods = mergeMoodCounts(bookstore.seedMoods, firestoreMoods);
// 둘 다 있으면 합. 한쪽만 있으면 그쪽 우선.
```

이렇게 하면 Firestore 가 비어 있을 때 시드 분위기가 보임. 시연 직전 Firestore 에 0건이어도 화면이 풍성함. STEP 5 의 사용자 입력이 Firestore 에 쌓이면 자연스럽게 합산되어 표시.

### 정렬 + 표시
- 카운트 내림차순
- 상위 3개는 active (`Pill muted={false}`)
- 4번째부터는 muted (또는 숨김). **권장: 4번째도 muted 로 표시 (5개 이모지 풀 노출, 시연용 친화적)**

### 빈 상태
시드와 Firestore 모두 0건이면 "첫 번째 분위기를 남겨주세요" + 5개 이모지 ghost row (opacity 0.3). 본 STEP 시드 데이터로 미발생 시나리오이지만 코드는 처리.

---

## 5. 외부 액션 — `src/lib/share.ts`

### `[전화]`
- `tel:${phone}` URL scheme (`<a href>` 직접 사용)
- bookstore.phone 없으면 버튼 disabled + 캡션 "전화번호 미등록"

### `[길찾기]`
- 카카오맵 길찾기 URL: `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`
- 새 탭으로 open

### `[공유]`
- Web Share API 시도: `navigator.share({ title, text, url })`
- 실패 또는 미지원 시 클립보드 복사 + toast "링크가 복사되었어요"
- 시연 환경 (localhost) 에선 Web Share 미지원 → 클립보드 fallback 정상

### 공유 URL
현재 페이지의 `window.location.href` 사용. STEP 4 단독으로는 deep-link 가 작동하지 않을 수 있음 (배포된 도메인 부재) — 시연용으로 충분.

---

## 6. 데이터 흐름

```
/bookstore/:id 진입
  ├─ useParams → id
  ├─ getBookstoreById(id) → bookstore (sync, 정적 시드)
  ├─ useMoodTags(id) → Firestore 비동기 쿼리
  ├─ 영업 상태 계산 (현재 시각 기반)
  └─ haversineMeters(userLocation, bookstore) → 거리
```

`userLocation` 은 STEP 3 의 `useMapStore.userLocation` 을 그대로 구독. 없으면 거리 행 비표시.

---

## 7. 비주얼 일관성

`reference/claude_design/04_screens_map_detail.jsx` 의 `BookstoreDetailScreen` 비주얼을 정확히 재현:

- 사진 영역이 풀블리드, 그 위에 dot 인디케이터·뒤로가기·공유·북마크
- 헤더 카드: 카테고리 dot + uppercase + VISITED 배지
- Gowun Batang H1 26px
- 영업 상태는 ok/error 컬러 dot
- DetailRow: 28×28 surface-02 icon container + 14px primary + 11.5px secondary
- Mood Pill: emoji + label + count (mono)
- 하단 액션 바: 13px padding, 3분할, 가운데 paper Primary

---

## 8. 수정·생성 파일 목록

### 생성
- `src/lib/businessHours.ts` + `src/lib/businessHours.demo.ts` (자가 검증)
- `src/lib/share.ts`
- `src/hooks/useMoodTags.ts`
- `src/components/bookstore/PhotoSlider.tsx`
- `src/components/bookstore/BookstoreInfoCard.tsx`
- `src/components/bookstore/SpecialtyTags.tsx`
- `src/components/bookstore/MoodTagAggregation.tsx`
- `src/components/bookstore/ActionBar.tsx`
- `src/components/bookstore/DetailRow.tsx`

### 수정
- `src/lib/firestore.ts` — `fetchMoodTags(bookstoreId)` 추가, `MoodTagDoc` 타입 export
- `src/pages/bookstore/index.tsx` — placeholder 제거 후 실제 상세 화면으로 교체

---

## 9. 자가 검증 (STEP 4 완료 시)

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) 라우트 등록 (이미 STEP 3 에서 됨)
grep "bookstore/:id" src/App.tsx | wc -l       # → 1

# 3) businessHours 자가 검증 스크립트
node --import tsx src/lib/businessHours.demo.ts  # → 모든 케이스 PASS
# (tsx 미설치면 npm run build 후 dist 검증 또는 ts-node 사용. 학교 시연 단순화 위해 콘솔 검증)

# 4) TanStack Query 사용
grep "useQuery" src/hooks/useMoodTags.ts        # → 1건 이상

# 5) 외부 액션 URL scheme
grep -E "tel:|map\.kakao\.com/link" src/        # → 최소 2건

# 6) Dev 서버 200
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173    # → 200

# 7) 수동 시연
# - /map → 핀 탭 → 시트 [상세 →] → /bookstore/{id} 실제 상세 페이지 로드
# - 사진 도트 클릭으로 슬라이드 전환 (크로스페이드 0.3s)
# - 영업 상태 표시 (현재 시각 기준 자동 계산)
# - 분위기 태그: 마포구립서강도서관 → 조용 9 / 커피 3
# - 전화 / 길찾기 / 공유 액션 작동
```

---

## 10. 권장 커밋 메시지

```
feat(detail): 책방 상세 페이지 + 영업 상태 + 분위기 집계
```

---

## 11. 승인 필요 사항

1. **businessHours 단위 테스트**: vitest 도입 vs 콘솔 데모 스크립트 (권장: 콘솔 데모 — 시연 범위 충분, 종속성 추가 없음)
2. **사진 더 보기 그리드**: STEP 4 에서 구현 vs P1 강등 (권장: 시간 여유 시 구현, 우선순위 낮음)
3. **영문 부카피 (EB Garamond Italic)**: bookstore 데이터에 영문명 alias 추가 vs STEP 4 에서 생략 (권장: 생략 — 시드 데이터 비대화 회피)
4. **북마크 버튼**: STEP 4 에서 UI 만 vs Firestore 즐겨찾기 구현 (권장: UI 토글만 — 즐겨찾기 데이터 모델 추가는 학교 과제 범위 외, CLAUDE.md 의 비범위 결정 일치)

승인이 떨어지면 lib (businessHours + share) → hook → 5개 컴포넌트 → 페이지 교체 → 자가 검증 순서로 구현한다.
