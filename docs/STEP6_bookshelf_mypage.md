# STEP 6 — 마이 북쉘프 + 마이페이지 (설계 문서)

> "수집의 만족감" 시각화. 책방을 책에 비유한 메타포(spine 리스트, 누런 띠, 골드 스탬프).
> Plan 단계 산출물. 사용자 승인 후 본 명세대로 구현한다.

---

## 1. 마이 북쉘프 (`/bookshelf`)

### 1-1. 화면 구성 (위→아래)

1. **헤더**
   - eyebrow `MY BOOKSHELF` (IBM Plex Mono, paper-mute, tracking 1.5)
   - H1 `{nickname} 님의 북쉘프` (Gowun Batang 26px, paper, -0.6 letterspacing)

2. **누적 통계 카드** (`StatsCard`)
   - linear-gradient surface 배경 (#1f2731 → #1a212b)
   - **상단 1px 누런 띠** (책 등받이 메타포): `linear-gradient(90deg, transparent, lamp 20%, gold 80%, transparent)`, opacity 0.7
   - 좌우 2열: 누적 방문 / 이번 달
   - 숫자: Gowun Batang 28px (실제로 IBM Plex Mono 였으나 디자인 시안의 H1 28px Gowun Batang 사용 — 시안 일치). **lamp 색 + tabular-nums**
   - count-up 애니메이션 (0 → 실제값, 0.8s ease-out)

3. **방문 지도 섹션**
   - SectionTitle: "내 방문 지도" + 우측 "지난 30일"
   - **SVG 정적 지도** (`VisitMap`): 잉크 블록 + 도로 + 컬러 핀(방문) + 회색 점(미방문)
   - 시드 책방 17곳의 좌표를 위경도 → SVG x/y 매핑 (전체 표시 영역 normalize)
   - 방문 핀: `MapPin visited size 18` + 글로우. 미방문: 8×8 회색 점.
   - 좌하단 legend: `● 방문 N` (mono 9px)
   - 권장: 카카오맵 재사용 ❌. SVG 정적 지도 (부담 적고 시연용 명확). **(승인 항목 1 확인)**

4. **방문 기록 리스트**
   - SectionTitle: "방문 기록" + 우측 "최신순 · N건"
   - `VisitListItem` row: 좌측 책 등(spine) 36×44 컬러 + `NO.N` mono + N (Gowun Batang) / 중앙 책방명 + 분위기 이모지 + 카테고리·날짜 / 우측 chevron
   - 클릭 시 `/bookstore/:id`
   - 무한 스크롤은 시연 범위 외. visits 가 많아져도 모두 한번에 로드 (학교 과제, 사용자 1명 visits 최대 ~17개 시연 범위 예상).

5. **빈 상태** (visits 0개)
   - 빈 책장 SVG 일러스트 (paper-mute 색, 3단 책장 + 책 없는 라인)
   - "첫 발견을 기다리는 책장이에요" Gowun Batang 17px
   - 부카피 paper-dim 13px
   - [지도에서 발견하기] Primary 버튼 → `/map`

### 1-2. SVG 정적 지도 알고리즘

```ts
// bookstores 의 lat/lng 범위를 0~1 로 normalize 후 SVG 영역에 매핑
const lats = BOOKSTORES.map(b => b.lat);  // 37.54 ~ 37.585
const lngs = BOOKSTORES.map(b => b.lng);  // 126.91 ~ 127.06
const padding = 0.04;
const minLat = Math.min(...lats) - padding;
const maxLat = Math.max(...lats) + padding;
// ...
const x = ((b.lng - minLng) / (maxLng - minLng)) * width;
const y = (1 - (b.lat - minLat) / (maxLat - minLat)) * height;  // 위→아래 반전
```

지도 배경: 04 디자인 시안의 inkblock 패턴을 단순화한 SVG (지난 30일 컨텍스트라 풀 디테일 불필요).

### 1-3. 데이터 흐름

- `useUserVisits(uid)` 로 visits 구독 (이미 STEP 5 에서 만듦)
- visits 의 bookstoreId 별로 첫 방문 시각만 사용 (24h 중복 방지 덕에 거의 unique)
- 시드 책방과 join 하여 `EnrichedVisit { bookstore, visitedAt }`
- 시연 직전 7일치 분위기 이모지가 visits 와 함께 표시되려면 STEP 5 의 moodTags 도 join 필요. **권장: visits 와 같은 책방의 최근 1건 moodTag 만 표시**. 별도 쿼리 없이 mood pill 자리에 "${lastMoodEmoji}" 표시.

별도 쿼리 추가 시 부담 → 시연 단순화: `useAllUserMoodTags(uid)` 1회 호출하여 클라이언트에서 그룹화. **(승인 항목 2)**

---

## 2. 마이페이지 (`/mypage`) — 본격 구현

STEP 5 에서 DemoModeToggle 만 들어간 상태. 본 STEP 에서 디자인 시안 적용.

### 2-1. 화면 구성

1. **헤더** — eyebrow `PROFILE` + H1 `마이페이지`

2. **프로필 카드** (`ProfileCard`)
   - linear-gradient surface 배경 + 우상단 펜던트 글로우 누설
   - 64×64 아바타: lamp 그라데이션 + 닉네임 첫 글자 (Gowun Batang 26px) + paper 보더 2px + lamp 글로우
   - 닉네임 (Gowun Batang 19px) + 이메일 (paper-mute 12px)
   - `★ EXPLORER · LV.N` 배지: 누적 방문 수 기반 레벨 (1~3: 시작/1~6: LV.1 / 7~12: LV.2 / 13+: LV.3). 시연 범위에서 LV.2 충분.
   - 하단 hairline divider
   - 2열 MiniStat: 누적 방문 / 이번 달 (Gowun Batang 22px tabular-nums)

3. **메뉴 그룹 1: 시연 모드**
   - 이미 만든 `DemoModeToggle` 재사용. 마이페이지의 절제된 위치에 배치.
   - 초기화 버튼 포함.

4. **메뉴 그룹 2: 설정**
   - 알림 설정 (UI 만, "켜짐" 우측 표시, 클릭 시 토스트)
   - 앱 정보 (`v1.0.0` 우측 표시, 클릭 시 토스트)

5. **메뉴 그룹 3: 계정**
   - 로그아웃 — error 컬러. 클릭 → `LogoutDialog` 확인 모달 → signOut → `/login`

6. **푸터**
   - mono `숨은 책방 · v1.0.0`

### 2-2. `LogoutDialog`
- 풀스크린 scrim (rgba(0,0,0,0.5))
- 중앙 카드: "로그아웃 하시겠어요?" + 부카피 + [취소] (secondary) [로그아웃] (Primary error 색)
- ESC / 배경 클릭 / [취소] 모두 닫기 가능

### 2-3. ExplorerLevel 계산

```ts
function getExplorerLevel(count: number): { level: number; label: string } {
  if (count === 0) return { level: 0, label: '시작' };
  if (count <= 6) return { level: 1, label: 'LV.1' };
  if (count <= 12) return { level: 2, label: 'LV.2' };
  return { level: 3, label: 'LV.3' };
}
```

`src/lib/explorer.ts` 에 분리. 시연 환경에서 시연 모드로 visits 누적되면 LV.2 / LV.3 도달 가능.

---

## 3. 이번 달 방문 계산

```ts
function isCurrentMonth(ts: Timestamp): boolean {
  const date = ts.toDate();
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}
```

`fetchUserVisits` 결과를 클라이언트에서 reduce. 별도 쿼리 없음.

---

## 4. 진입 애니메이션

### count-up
```ts
function useCountUp(target: number, durationMs = 800): number {
  // requestAnimationFrame 으로 0 → target ease-out
}
```

`src/hooks/useCountUp.ts`. StatsCard / MiniStat 모두 사용.

### 리스트 staggered fade-in
Framer Motion `motion.li initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}`.

---

## 5. 비주얼 일관성

`reference/claude_design/05_screens_mood_bookshelf_mypage.jsx` 의 `BookshelfScreen` + `MyPageScreen` 정확히 재현:

- 누런 띠 메타포 (gradient 1px line, opacity 0.7)
- 책 등 spine: 36×44 카테고리 색 그라데이션 + inset boxShadow + `NO.` mono + 번호 Gowun Batang 16px
- 빈 책장: paper-mute SVG, 3단 책장 라인 + 빈 책 없음
- 프로필 카드 우상단 펜던트 글로우 (`radial-gradient circle 140px`)
- Explorer 배지: lamp 컬러 + lamp/0.1 배경 + lamp/0.3 보더, mono 9.5px tracking 0.5

---

## 6. 수정·생성 파일 목록

### 생성
- `src/lib/explorer.ts`
- `src/hooks/useCountUp.ts`
- `src/hooks/useAllUserMoodTags.ts` (옵션 — 책방별 마지막 분위기 표시용)
- `src/components/bookshelf/StatsCard.tsx`
- `src/components/bookshelf/VisitMap.tsx`
- `src/components/bookshelf/VisitListItem.tsx`
- `src/components/bookshelf/EmptyBookshelf.tsx`
- `src/components/mypage/ProfileCard.tsx`
- `src/components/mypage/MenuGroup.tsx`
- `src/components/mypage/MenuItem.tsx`
- `src/components/mypage/LogoutDialog.tsx`

### 수정
- `src/lib/firestore.ts` — `fetchAllUserMoodTags(uid)` 추가 (단순 where userId 쿼리, createdAt desc)
- `src/pages/bookshelf/index.tsx` — placeholder → 실제
- `src/pages/mypage/index.tsx` — STEP 5 임시 → 디자인 시안 적용

### 삭제
- 없음

---

## 7. 자가 검증 (STEP 6 완료 시)

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) 라우트 등록 (이미 STEP 3 에서 됨)
grep -E "(bookshelf|mypage)" src/App.tsx | wc -l   # → 최소 2

# 3) 로그아웃 → /login 이동
grep -E "signOut|navigate.*login" src/components/mypage/LogoutDialog.tsx | wc -l   # → 최소 1
#  (signOut 은 lib/auth.ts 호출이므로 LogoutDialog 에서는 logout() 호출 + navigate('/login'))

# 4) 시연 모드 토글이 demoStore 와 연결
grep -E "(useDemoStore|demoStore)" src/components/shared/DemoModeToggle.tsx   # → 1건 이상

# 5) 빈 상태 컴포넌트 존재
test -f src/components/bookshelf/EmptyBookshelf.tsx

# 6) IBM Plex Mono 사용 (통계 강조)
grep -E "font-mono|IBM Plex" src/components/bookshelf/StatsCard.tsx   # → 1건 이상

# 7) Dev 서버 200
npm run dev   # → http://localhost:5173

# 8) 수동 시연 (README_TEST.md 시나리오 W~AA):
#    - 신규 가입 직후 → 빈 책장 + CTA
#    - 시연 모드로 인증 1회 → 북쉘프에 통계 1 + 리스트 1줄
#    - 통계 카운트업 0 → 1
#    - 리스트 항목 탭 → 책방 상세
#    - 마이페이지 → 프로필 카드 + Explorer LV
#    - 로그아웃 → confirm dialog → /login
```

---

## 8. 권장 커밋 메시지

```
feat(bookshelf): 마이 북쉘프 + 마이페이지 + 시연 모드 토글
```

---

## 9. 승인 필요 사항

1. **방문 지도**: SVG 정적 지도 vs 카카오 맵 재사용 (권장: SVG — 시연용 명확 + 부담 적음)
2. **책방별 마지막 분위기 표시**: 별도 쿼리 추가 (`fetchAllUserMoodTags`) vs 빈 자리 (생략) — 권장: 추가. 한 번의 추가 쿼리로 spine row 의 mood emoji 표시
3. **Explorer 레벨 기준**: 1~6 / 7~12 / 13+ — 시연 환경에 적합? (권장: 그대로 — 시연 모드로 6~12회 인증 시 LV.2 도달 가능)
4. **로그아웃 확인 다이얼로그**: 별도 모달 vs 단순 confirm (권장: 별도 모달 — 디자인 시안 일치, 디자인 일관성)

승인이 떨어지면 lib/hook → 4 북쉘프 컴포넌트 → 4 마이페이지 컴포넌트 → 페이지 교체 → 자가 검증 순서로 구현한다.
