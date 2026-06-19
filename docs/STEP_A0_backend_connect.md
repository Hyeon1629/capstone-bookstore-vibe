# STEP A0 · 백엔드 연결 (실 Firebase + 카카오)

> 목적: 지금까지 만든 코드(A1 포함)가 **실제로 동작하는지 눈으로 확인** 가능하게 만든다.
> 이 STEP은 대부분 **콘솔 작업이라 사용자가 직접** 수행한다. Claude는 가이드·검증 담당.
> 산출물: 값이 채워진 `.env.local` → `npm run dev` 에서 로그인·지도·방문이 실제로 동작.

소요: 약 20~30분. 결제 불필요 (Firebase Spark 무료 + 카카오 무료).

---

## Part 1 · Firebase 설정

### 1-1. 프로젝트 생성
1. https://console.firebase.google.com 접속 (구글 로그인 — lghy0927@gmail.com)
2. **프로젝트 추가** → 이름 `hidden-bookstore` (자유) → Google Analytics는 **사용 안 함** 선택(과제용이라 불필요) → 생성

### 1-2. 웹 앱 등록 + 구성값 받기
1. 프로젝트 개요 화면에서 **`</>` (웹)** 아이콘 클릭
2. 앱 닉네임 `hidden-bookstore-web` 입력, **Firebase Hosting 체크 해제** → 앱 등록
3. 표시되는 `firebaseConfig` 객체에서 6개 값을 복사 → `.env.local` 에 매핑:

| firebaseConfig 키 | .env.local 변수 |
|---|---|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

> 이미 만든 프로젝트라면: ⚙️ **프로젝트 설정 → 일반 → 내 앱 → SDK 설정 및 구성**에서 같은 값 확인 가능.

### 1-3. Authentication — 이메일/비밀번호 활성화
1. 좌측 **빌드 → Authentication → 시작하기**
2. **Sign-in method** 탭 → **이메일/비밀번호** → 사용 설정 **ON** → 저장
   (이메일 링크/비밀번호 없는 로그인은 OFF 그대로)

### 1-4. Firestore Database 생성
1. 좌측 **빌드 → Firestore Database → 데이터베이스 만들기**
2. 위치: **asia-northeast3 (서울)** 권장 (한 번 정하면 변경 불가)
3. 규칙 시작 모드: **테스트 모드로 시작** 선택
   - 테스트 모드 = 30일간 누구나 읽기/쓰기 허용 → A0 동작 확인용으로 충분
   - ⚠️ **이건 임시다.** 실제 보안 규칙은 STEP C1에서 잠근다. (그 전엔 배포 금지)
4. 사용 설정

> **인덱스 설정 불필요** — 이 앱 코드는 복합 인덱스를 의도적으로 회피(단일 where + 클라이언트 필터)하므로 별도 작업 없음.

---

## Part 2 · 카카오 설정

### 2-1. 앱 생성
1. https://developers.kakao.com → 로그인 → **내 애플리케이션 → 애플리케이션 추가하기**
2. 앱 이름 `숨은책방`, 사업자명 자유 → 저장

### 2-2. JavaScript 키 복사
1. **앱 설정 → 앱 키** → **JavaScript 키** 복사 → `.env.local` 의 `VITE_KAKAO_JS_KEY` 에 붙여넣기
   (REST API 키 아님 — 반드시 **JavaScript 키**)

### 2-3. 플랫폼(도메인) 등록 — 지도가 뜨려면 필수
1. **앱 설정 → 플랫폼 → Web 플랫폼 등록**
2. 사이트 도메인에 추가:
   ```
   http://localhost:5173
   ```
   (포트 정확히. 안드로이드 빌드 단계에서는 `https://localhost` 도 추가 필요 — 지금은 localhost:5173만으로 충분)

### 2-4. 카카오맵 사용 설정
- 카카오맵 JavaScript SDK + Local 검색(services)은 위 JS 키 + Web 도메인 등록만으로 동작한다.
- 별도 "동의 항목"이나 비즈 전환 불필요 (지도·장소검색은 로그인 무관 기능).

---

## Part 3 · .env.local 채우기

`.env.local` 파일은 이미 만들어 뒀다(루트, gitignore 됨). 7개 값 전부 채운다:

```env
VITE_FIREBASE_API_KEY=AIza...          # 1-2
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hidden-bookstore-xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234:web:abcd
VITE_KAKAO_JS_KEY=0123456789abcdef...  # 2-2
```

> 값 사이 따옴표 불필요. `=` 양옆 공백 없이. 채운 뒤 **dev 서버를 껐다 켜야** Vite 가 새 env 를 읽는다.

---

## Part 4 · 실행 & 검증

```bash
npm run dev    # → http://localhost:5173
```

### A0 성공 기준 (런타임 체크리스트)
- [ ] 앱이 로그인/온보딩 화면까지 뜸 (흰 화면 아님)
- [ ] 회원가입 → 새 계정 생성됨 (Firebase 콘솔 Authentication 에 유저 보임)
- [ ] 로그인 후 **지도에 라이트 톤 카카오 지도 + 핀**이 보임
- [ ] Firestore 콘솔에 `users`, `nicknames` 문서 생성 확인

### 이어서 A1 기능까지 검증 (이번에 만든 것들)
- [ ] 시연 모드 ON → 핀 long-press → 방문 인증 시퀀스 → `/bookshelf` 이동
- [ ] 같은 책방 다시 인증 시도 → "이미 방문 인증한 책방이에요" (visitGuards 24h 중복 차단)
- [ ] 책방 상세 진입 → 방문한 책방이면 "★ 방문 완료" 배지
- [ ] 상세에서 북마크 토글 → 새로고침 → 상태 유지 (bookmarks 영속)
- [ ] Firestore 콘솔에 `visits`, `visitGuards`, `bookmarks`, `moodTags` 문서 확인

---

## 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| 흰 화면 + 콘솔 `Firebase: Error (auth/...)` 또는 `invalid-api-key` | Firebase 6개 값 오타/누락. `.env.local` 확인 후 서버 재시작 |
| 지도 자리에 "SDK ERROR / 도메인 등록 확인" | 카카오 Web 플랫폼에 `http://localhost:5173` 미등록 (2-3) |
| 지도는 뜨는데 실시간 책방 검색 0 / "카카오 검색 실패" | JS 키가 REST 키로 잘못 들어감, 또는 도메인 미등록 |
| 회원가입 시 `permission-denied` | Firestore 가 테스트 모드 아님 (1-4 재확인) |
| env 바꿨는데 반영 안 됨 | dev 서버 재시작 안 함 (Vite 는 env 를 시작 시 1회 로드) |
| `Missing or insufficient permissions` (방문/북마크) | 테스트 모드 30일 만료. 임시로 규칙 갱신하거나 C1 진행 |

---

## A0 완료 후
- 테스트 모드 Firestore 는 **30일 뒤 잠긴다** → 그 전에 STEP C1(보안 규칙)로 정식 규칙 적용 권장.
- 안드로이드(Capacitor) 패키징 시 카카오에 추가 도메인 등록 필요 → STEP7 문서 참조.
