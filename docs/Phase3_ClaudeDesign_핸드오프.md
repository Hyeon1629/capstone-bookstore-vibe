# 숨은 책방 — Phase 3 → 구현 핸드오프 프롬프트

> 이 문서를 새 Claude 대화에 그대로 붙여넣으세요. 디자인 시안(Phase 3 React 아티팩트) 파일과 함께 첨부하면 완벽합니다.

---

당신은 한국 대학 과제 프로젝트 "숨은 책방"의 구현을 맡았습니다. Phase 1(기획), Phase 2(와이어프레임), Phase 3(비주얼 디자인)이 완료된 상태이고, 이제 시연 가능한 프로토타입 또는 MVP로 구현해야 합니다. 첨부된 Phase 3 React 아티팩트가 디자인의 최종 진실 소스입니다. 아래의 결정 사항을 반드시 지켜주세요.

---

## 0. 한 줄 정의 + 페르소나

- "동네 책방을 위한 발견·수집 메커닉" 모바일 앱. 지도에서 책방·도서관·북카페를 발견하고, GPS로 방문 인증하고, 내 동네 책방 지도를 채워간다.
- 단일 페르소나: 이서연 (26세, 마케팅 에이전시 주니어, 성수동 1인 가구, 인스타 헤비유저). "인스타에 캡처해서 올려도 부끄럽지 않은" 시각 품질이 절대 양보 불가.

---

## A. 컬러 시스템 — 양보 가능 / 불가

### 디자인 단계에서 검토한 3안

| 안 | 베이스 | 액센트 | 성격 |
|---|---|---|---|
| **A. 잉크 펜던트** | `#0F141B` (블루-블랙) | `#E8A552` 펜던트 앰버 | 가장 문학적·차분 |
| **B. 에스프레소 종이** | `#1C1612` (갈색 다크) | `#D4A23E` 머스타드 | 가장 빈티지 헌책방 |
| **C. 늦은 책방 ✅** | `#13171E` (미세 코발트+따뜻함) | `#F2B872` 워밍 앰버 | A의 깊이 + B의 따뜻함 절충 |

**C를 선택한 이유:**
1. 페르소나 적중 — 이서연의 인스타-네이티브 감각에 컨템포러리한 다크 톤이 정확히 맞음
2. 두 카테고리 핀이 모두 잘 보임 — B의 올리브는 누런 톤에 묻혀 도서관·북카페 핀이 약함
3. "포켓몬 고적 가벼움" — A의 본명조 무게보다 C의 따뜻한 액센트가 발견의 즐거움에 맞음

### 비절대 양보 불가 (Non-negotiable)

- **다크 + 따뜻한 톤** — 순검정 ❌, 차가운 그레이/네온 ❌. 베이스는 반드시 약간의 갈색 또는 워밍 코발트가 도는 다크
- **단일 액센트 컬러** — 펜던트 앰버 1개. 동시에 2개 이상 풀채도 액센트 ❌
- **카테고리 핀 2색** — 서점=주황 계열, 도서관/카페=초록 계열. 색약 사용자 구분을 위해 **색 + 글리프(book/cup) + 방문 시 골드 별 배지** 3중 차별화 유지 필수
- **방문 완료는 별도 색이 아니다** — 카테고리 같은 색 + 골드(`#F5CD6E`) 배지. 4번째 hue 추가 금지
- **보라 그라데이션·네온·회색조 다크 ❌** — AI슬롭 시그널

### 양보 가능 (Flexible)

- 정확한 hex는 ±5% lightness 내에서 조정 가능
- surface/01·02·03 단계는 2단계로 collapse 가능 (시각적 위계만 유지되면)
- 핀 saturation 살짝 조정 OK
- 다크 모드만 출시, 라이트 모드는 v2 (요청 없으면 만들지 마세요)

### 최종 토큰

```css
:root {
  /* base */
  --bg-midnight: #13171E;
  --bg-deeper: #0D1116;
  --surface-01: #1D232C;
  --surface-02: #2A313C;
  --surface-03: #353D4A;
  --hairline: #2B323D;

  /* paper */
  --paper: #F2EAD9;
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
}
```

---

## B. 타이포그래피 — 양보 가능 / 불가

### 디자인 단계에서 검토한 3안

| 안 | 헤드 KR | 헤드 EN | 본문 | 모노 |
|---|---|---|---|---|
| 1. 정통 명조 | Noto Serif KR | Spectral | Pretendard | JetBrains Mono |
| 2. 빈티지 따뜻함 ✅ | **Gowun Batang** | **EB Garamond** | **Pretendard** | **IBM Plex Mono** |
| 3. 모던 한글 디스플레이 | Paperlogy 800 | IBM Plex Sans | Pretendard | IBM Plex Mono |

**2를 선택한 이유:**
- 1의 본명조보다 부드럽고 친근 (페르소나·앱 무드 일치)
- 3보다 "책" 정체성이 강함
- IBM Plex Mono 의 통계 숫자가 "수집의 만족감" 시각화에 가장 잘 맞음

### 비절대 양보 불가

- **헤딩 KR = Gowun Batang 700** — 다른 한글 명조로 대체 금지 (본명조 너무 무거움, 산세리프 헤딩 안 됨)
- **본문 = Pretendard** — Inter/Roboto/Arial/시스템 폰트 ❌
- **숫자·eyebrow = IBM Plex Mono** — 다른 모노 OK이긴 한데 IBM Plex가 가장 잘 어울림
- **EN 부카피·인용은 EB Garamond Italic** — 잡지 표지 느낌이 핵심

### 최종 스케일

| 토큰 | 폰트 | size / line-height | weight |
|---|---|---|---|
| Display | Gowun Batang | 28 / 35 | 700 |
| H1 | Gowun Batang | 26 / 32.5 | 700 |
| H2 | Gowun Batang | 19 / 26 | 700 |
| H3 | Gowun Batang | 15 / 22 | 700 |
| Body L | Pretendard | 14.5 / 22 | 500 |
| Body | Pretendard | 13.5 / 21 | 400 |
| Small | Pretendard | 11.5 / 16 | 500 |
| Caption | IBM Plex Mono | 10.5 / 14 | 500 (letter-spacing 2.5) |

---

## C. 인터랙션 · 애니메이션 — Phase 3에서 정의됨

### 정적 디자인엔 안 보이지만 반드시 구현할 마이크로 인터랙션

**지도 (SC-04):**
- 핀 탭: scale 1→1.08, translateY -4px, drop-shadow에 카테고리 색 glow 추가 (200ms ease)
- 핀 미리보기 시트: bottom에서 슬라이드 업 (translateY 20→0, opacity 0→1, 250ms ease)
- FAB 위치: 시트 열리면 bottom 24→168 transition .25s
- 핀 펜던트 글로우: radial-gradient lampGlow가 핀 주변에 항상 펄스 (subtle, 4s loop, opacity 0.6↔1.0)
- 초기 진입 시 핀들 staggered reveal: scale 0→1.08→1, 80ms 간격으로 등장

**책방 상세 (SC-05):**
- 사진 슬라이드: opacity 크로스페이드 0.3s (슬라이드 ❌ — gentler 한 mood)
- 사진 도트 인디케이터: 활성은 18px width, 비활성 6px, transition all 0.2s
- 북마크 탭: heart-fill 애니메이션 (scale 1→1.2→1, 200ms)

**분위기 입력 (SC-06):**
- 황금 스탬프 점선 링: 12s linear infinite 회전
- 배경 스파클: 3s ease-in-out twinkle, 7개 별이 staggered (0~1.6s delay)
- 이모지 카드: 선택 시 emoji scale 1→1.08, card translateY 0→-2px, border amber, 180ms

**온보딩 (SC-01):**
- 슬라이드 전환 시 eyebrow / title / body 가 fadeUp staggered (0.35 / 0.4 / 0.45s, translateY 8→0)
- 페이지 인디케이터: 활성은 width 22px로 늘어남 (250ms ease)

### 페이지 전환 (Phase 3엔 없지만 구현 시 반드시)

| 전환 | 동작 |
|---|---|
| 일반 화면→화면 | dissolve 250ms |
| 지도 → 책방 상세 | 핀 위치에서 hero photo 가 zoom-in (shared element transition) |
| 상세 → 분위기 입력 | bottom sheet 가 액션바에서 push-up + 배경 0.3 opacity scrim |
| 분위기 입력 → 북쉘프 | 스탬프 카드가 화면 밖으로 위로 날아가고, 북쉘프 진입 시 새 row가 spring으로 등장 |

### GPS 자동 인증 시퀀스 (SC-05 → SC-06)

1. 사용자가 책방 50m 이내 진입
2. 지도 또는 상세 화면에 radar pulse 애니메이션 (info 컬러, 3개 ring이 0.6s 간격으로 0→100% radius 확장하며 사라짐, 2초간)
3. 화면 250ms paper 컬러 페이드인 (방문 확인 신호)
4. SC-06 모달 진입

### 햅틱

- 핀 탭: soft impact
- 방문 자동 인증: medium impact
- 스탬프 수집 완료(이모지 선택 후 CTA): heavy impact + 따뜻한 "딩" 사운드 (선택사항)

### 로딩·스켈레톤

- 지도 초기: 핀 자리에 회색 도트 grid + paper-dim shimmer (translateX -100→100%, 1.5s loop)
- 사진 로딩: surface-02 배경 + paper-mute IBM Plex Mono "Loading..." 캡션
- 리스트 무한스크롤: 하단 amber 점 3개 fade in/out (0.4s 간격)

---

## D. 빈 상태 · 에러 상태 — Phase 3엔 happy path 위주, 아래 정의대로 추가 구현

### 빈 상태 (Empty States)

| 화면 | 상태 | 디자인 |
|---|---|---|
| **북쉘프** | 0회 방문 (신규 가입 직후) | 빈 책장 SVG 일러스트(paper-mute) + "첫 발견을 기다리는 책장이에요" + "지도에서 발견하기" Primary 버튼 |
| **지도 검색** | 결과 없음 | paper-dim 글리프 + "근처에 일치하는 책방이 없어요" + suggested action 2개 ("반경 5km로 확장", "전체 카테고리로 보기") |
| **책방 상세 · 분위기** | 분위기 입력 0건 | "첫 번째 분위기를 남겨주세요" + 5개 이모지 ghost row (opacity 0.3) |
| **책방 상세 · 사진** | 사진 0장 | placeholder 1장 + "사진이 곧 추가될 예정이에요" |

### 에러 상태

| 상황 | 디자인 |
|---|---|
| **GPS 권한 거부** | 다크 모달 (surface-01, sheet radius), info 컬러 글리프, "위치 권한이 필요해요" 헤딩, 사용 이유 설명 1문장, [권한 다시 요청] Primary 버튼 + [건너뛰기] secondary |
| **네트워크 실패** | 상단에 toast (surface-02 + error 1px 보더 + 오프라인 아이콘), "연결이 끊겼어요 · 다시 시도" 액션 링크 |
| **GPS 미일치 (인증 거리 밖)** | 풀스크린 모달, "조금 더 가까이!" + 거리 표시 (현재 150m / 50m 이내 필요) + 지도 미니뷰 + [지도로 보기] CTA |
| **로그인 실패** | 두 인풋 모두 error 보더, 인풋 위 캡션 "이메일 또는 비밀번호가 일치하지 않습니다" (error 컬러 + alert 아이콘) |
| **닉네임 중복** | 인풋 보더 error, 캡션 "이미 사용 중인 닉네임이에요" + 대안 제안 (e.g. "서연_2", "서연1") |
| **사진 업로드 실패** | placeholder 자리에 error 컬러 글리프 + "다시 시도" 버튼 |
| **서버 500** | 풀스크린, paper-dim 글리프 + "잠시 후 다시 시도해주세요" + [새로고침] |

### 로딩 상태 (Phase 3엔 없음, 추가 구현 필수)

| 화면 | 디자인 |
|---|---|
| 지도 초기 로드 | 회색 핀 도트 grid + shimmer |
| 책방 상세 진입 | 사진 영역 surface-02 + skeleton 텍스트 (paper-dim bar 3개) |
| 가입 처리 중 | Primary 버튼이 amber spinner + "가입 중..." |
| GPS 인증 처리 | radar pulse (위 C 섹션 참조) |
| 무한스크롤 | 하단 amber 점 3개 |

---

## E. 기술 스택 추천

학교 과제 시연용이라는 컨텍스트 (실제 백엔드는 시뮬레이션 OK)와 추후 실서비스 확장 가능성을 모두 고려한 추천:

### 시연용 MVP (1-2주)

| 영역 | 추천 | 이유 |
|---|---|---|
| 프레임워크 | **Next.js 15 (App Router)** | 정적 페이지(온보딩) + 동적(지도) 모두 잘 처리, Vercel 배포 1클릭 |
| 언어 | TypeScript | 디자인 토큰 타입 안정성 |
| 스타일 | **Tailwind CSS 4** + `@theme` | Phase 3 토큰을 그대로 매핑 가능 |
| 폰트 | `next/font/google` | Gowun Batang, EB Garamond, IBM Plex Mono. Pretendard는 [npm 패키지](https://www.npmjs.com/package/pretendard) 또는 self-host woff2 |
| 애니메이션 | **Framer Motion** | 페이지 전환·스탬프·핀 글로우에 필수 |
| 지도 | **Naver Maps SDK** | 국내 정확도 > Google Maps. 다크 스타일 적용 가능 |
| 핀 렌더링 | **SVG marker overlay** (HTML marker는 지원 안 됨) | Phase 3의 dropshadow + glow를 SVG defs/filter로 재현 |
| 상태 | TanStack Query (서버) + zustand (지도 zoom·focused pin) + useState (UI) | 과한 추상화 없이 깔끔 |
| 데이터 | **하드코딩 JSON** (`/data/bookstores.json`) | 시연용엔 충분 |
| 인증 | 가짜 로컬스토리지 | 시연용 |
| GPS | 브라우저 `navigator.geolocation` + haversine 거리계산 | 50m 이내일 때 자동 인증 트리거 |
| 배포 | **Vercel** | Next.js 최적, 학생 무료, vercel.app 도메인 OK |

### 실서비스 확장 시 추가

| 영역 | 추천 |
|---|---|
| 백엔드 | **Supabase** — Auth + PostGIS(위치쿼리 효율적) + Storage(사진) + Edge Functions 한 번에 |
| 위변조 방지 | GPS 위변조 방지를 위해 서버에서 IP geolocation 거리 cross-check |
| 사진 | Supabase Storage + Next.js Image Optimization |
| 푸시 | OneSignal 또는 Firebase Cloud Messaging |
| 분석 | Posthog (자기호스팅 가능) |
| 모니터링 | Sentry |

### 디렉토리 구조 추천

```
/app
  /(auth)
    /onboarding/page.tsx        # SC-01
    /signup/page.tsx            # SC-02
    /login/page.tsx             # SC-03
  /(main)
    /map/page.tsx               # SC-04
    /bookstore/[id]/page.tsx    # SC-05
    /bookshelf/page.tsx         # SC-07
    /mypage/page.tsx            # SC-08
  layout.tsx                    # 폰트 로드, BottomNav 마운트
/components
  /primitives                   # Phase 3에서 그대로 옮김
    Button.tsx, Chip.tsx, TextInput.tsx, MapPin.tsx
  /screens                      # 화면 단위 컴포넌트
  /shared                       # BottomNav, StatusBar(테스트용)
/lib
  tokens.ts                     # 색·radius·shadow JS 토큰
  geo.ts                        # haversine, 인증 거리계산
  /data
    bookstores.json
/styles
  globals.css                   # CSS 변수 토큰
```

### "이것만은 절대 하지 마세요"

- ❌ Material UI, Chakra, Ant Design 같은 기성 UI 키트 — Phase 3 디자인 시스템과 충돌
- ❌ Google Maps default 스타일 — 디자인 무너짐
- ❌ 라이트 모드 자동 추가 — 다크-only 출시
- ❌ Bootstrap·Bulma·시스템 폰트 fallback에 안주
- ❌ 핀을 emoji 또는 lucide-react 아이콘으로 대체 — SVG로 그려야 글로우가 살아남

---

## F. 작업 우선순위 (시연 기준)

| Day | 작업 |
|---|---|
| 1-2 | 프로젝트 셋업, 폰트·토큰·Tailwind config, primitives (Button/Chip/Input/MapPin) 이식 |
| 3-4 | SC-04 지도 홈 (Naver Map + SVG 핀 + 미리보기 시트 + 필터 칩) — 가장 중요 |
| 5 | SC-05 책방 상세 (사진 슬라이더 + 분위기 태그) |
| 6 | SC-06 분위기 입력 모달 + SC-07 북쉘프 |
| 7 | SC-01/02/03 인증 흐름 |
| 8 | SC-08 마이페이지 + 빈 상태 + 에러 핸들링 |
| 9 | 페이지 전환 애니메이션 (Framer Motion) + GPS 인증 트리거 |
| 10 | 폴리싱, 모바일 디바이스 실기기 테스트, 시연 데이터 준비 |

---

## G. 시연 시 강조 포인트 (발표용 스크립트)

Phase 3 아티팩트의 우측 메타 패널에 화면별 "디자인 노트 + 핵심 결정"이 정리되어 있습니다. 그것을 그대로 발표 스크립트로 쓸 수 있습니다. 핵심 메시지 3가지:

1. **"동네에 이렇게 많았다"의 와우 모먼트** — 다크 베이스 + 펜던트 글로우로 첫 화면부터 발견의 즐거움 전달
2. **수집의 만족감** — 책방을 책에 비유한 메타포(spine 리스트, 누런 띠, 골드 스탬프)로 단순 통계를 넘는 정서적 보상
3. **인스타 캡처해도 부끄럽지 않은 시각** — 페르소나 검증. 모든 화면이 인스타 그리드에 올렸을 때 일관된 톤

---

## H. 기타 결정사항

- **사진은 placeholder 유지** — 학생 시연 컨텍스트. 실 책방 사진은 v2에서 실제 책방주 협조 받아 추가
- **이모지 5개 셋(☕🌧️🎶🤫☀️) 변경 금지** — Phase 2에서 결정된 어휘
- **방문 기록은 영구 (삭제 기능 없음)** — "수집"의 영속성이 핵심 가치
- **카테고리는 2개 고정** — "서점·헌책방" / "도서관·북카페". 세분화하면 핀 색 추가 필요해서 디자인 시스템 깨짐
- **다크 모드 only** — 라이트 모드는 v2 (위에 적었지만 한 번 더 강조)

---

이상입니다. Phase 3 React 아티팩트(`index.html` + `/src/*.jsx`)와 이 핸드오프 문서를 같이 참조해서 구현해주세요. 결정이 필요한 새로운 사항은 위 우선순위와 페르소나·무드를 기준으로 판단하면 됩니다.
