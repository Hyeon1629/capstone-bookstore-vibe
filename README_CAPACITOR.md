# README_CAPACITOR.md — Android Studio 실행 가이드

본 문서는 **Capacitor 로 패키징한 Android 빌드를 Android Studio AVD 에서 실행**하기 위한 가이드입니다.

---

## 1. 사전 조건

### 1-1. 개발 환경

| 항목 | 버전 / 확인 명령 |
|---|---|
| Node.js | 20 이상 (`node --version`) |
| Java JDK | 17 (`java -version`) — Temurin / Oracle / OpenJDK 모두 가능 |
| Android Studio | Hedgehog (2023.1.1) 이상 |
| Android SDK Platform | 34 (Android Studio → SDK Manager 에서 설치) |
| Android Build-Tools | 34.x |
| Gradle | Android Studio 가 자동 관리 |
| 환경변수 | `JAVA_HOME` 이 JDK 17 경로로 설정 |

PowerShell 에서 확인:
```powershell
node --version          # v20.x
java -version           # 17.x
$env:JAVA_HOME          # JDK 17 경로 (예: C:\Program Files\Java\jdk-17)
```

### 1-2. AVD 생성

1. Android Studio → 우측 상단 **Device Manager** 클릭
2. **Create Device** → 카테고리 **Phone** → **Pixel 6** 선택
3. **System Image**: **API 34 (UpsideDownCake)** 선택 → x86_64 또는 arm64 (Apple Silicon 환경) → Next
4. AVD Name: 자유, **Startup orientation**: Portrait, **Finish**
5. (선택) AVD 시작 후 Settings → System → Languages → **한국어** 추가

### 1-3. 카카오 개발자 콘솔 도메인 등록 ⚠️ **필수**

`https://developers.kakao.com` → 본인 애플리케이션 → **앱 설정 → 플랫폼 → Web** 에 다음 3개 도메인을 모두 추가:

- `http://localhost:5173`  ← 웹 dev 서버용 (이미 등록되어 있을 수 있음)
- `https://localhost`      ← Capacitor `androidScheme: 'https'` 일 때
- `capacitor://localhost`  ← 일부 Capacitor 빌드에서 사용

**미등록 시 카카오 맵 SDK 가 401 또는 403 반환** → 지도 영역이 회색으로 표시되거나 콘솔 에러.

### 1-4. Firebase 콘솔 확인

- **Authentication → Sign-in method → Email/Password 활성화** 완료
- **Firestore Database 생성** (위치 `asia-northeast3`, 테스트 모드)
- `visits` 컬렉션의 복합 색인은 첫 시도 시 자동 생성 안내 (`README_TEST.md` 참조)

---

## 2. 첫 빌드 흐름 (최초 1회)

프로젝트 루트(`hidden-bookstore/`)에서 PowerShell 또는 터미널 실행:

```bash
# 1) 의존성 확인 (이미 설치되어 있다면 스킵 가능)
npm install

# 2) 웹 빌드
npm run build

# 3) Android 플랫폼 추가 (최초 1회)
npx cap add android
```

`npx cap add android` 가 성공하면 프로젝트 루트에 `android/` 폴더가 생성됩니다. 이 폴더는 `.gitignore` 에 포함되어 있어 환경별로 재생성하는 게 정상입니다.

### 2-1. AndroidManifest 권한 패치 (필수)

`android/app/src/main/AndroidManifest.xml` 파일을 열어 `<manifest>` 태그 안 `<application>` 위에 다음 권한을 추가:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

(INTERNET 은 Capacitor 가 기본 추가하는 경우가 많음. 위치 권한 2종이 우리 추가 핵심)

`<application>` 태그에 다음 속성도 함께 추가 (디버그 시 localhost http 호출 대응):
```xml
<application
  ...
  android:usesCleartextTraffic="true"
  ...
>
```

---

## 3. 반복 빌드 흐름

코드 수정 후 매번:

```bash
npm run android
# = npm run build → npx cap sync android → npx cap open android
```

- `npm run build`: Vite 가 `dist/` 에 정적 파일 생성
- `npx cap sync android`: `dist/` 내용을 `android/app/src/main/assets/public/` 으로 복사 + 플러그인 동기화
- `npx cap open android`: Android Studio 자동 오픈

Android Studio 가 열리면 좌상단 디바이스 드롭다운에서 만들어 둔 **Pixel 6 API 34** 선택 → **우상단 ▶ Run** (Shift+F10) 클릭 → AVD 가 부팅되며 앱 자동 설치 + 실행.

### 빌드만 동기화 (Android Studio 안 열기)
```bash
npm run android:sync
```

---

## 4. 실행 흐름 (앱 실행 후)

1. 첫 진입 → **온보딩 슬라이드 3장** → [시작하기]
2. **회원가입** (이메일/비번/닉네임 실시간 검증) → 위치 권한 모달 **허용**
3. `/map` 자동 진입 → 현재 위치 주변 책방·도서관·북카페 핀 표시 (카카오 Local 검색)
4. **검색바**에 책방 이름 입력 → 매칭 핀 강조
5. 핀 탭 → 미리보기 시트 → [상세 →] → 책방 상세 화면
6. 책방 50m 이내 + 5초 체류 시 자동 GPS 인증 → radar pulse → paper fadein → **황금 스탬프 모달** + 분위기 이모지 5개
7. `🤫 한적한` 선택 → [북쉘프에 기록하기] → `/bookshelf` 자동 이동
8. **누적 통계 0 → 1 카운트업**, **NO.01 책 등(spine)** 표시
9. [마이] → 프로필 카드 + Explorer LV 배지 + 로그아웃

---

## 5. 트러블슈팅

### 카카오 맵이 회색으로만 표시
- **카카오 콘솔 도메인** (`capacitor://localhost`, `https://localhost`) 등록 확인
- AVD 의 Chrome 에서 `https://localhost` 진입 시 SSL 경고 → 무시
- DevTools(원격 디버깅): `chrome://inspect` 로 AVD 의 WebView 검사

### "Geolocation 권한 거부"
- AVD Settings → Apps → 숨은 책방 → Permissions → Location → Allow
- 또는 앱 재설치

### Gradle 빌드 실패
- `JAVA_HOME` 이 JDK 17 인지 확인 (JDK 21 으로 잡혀 있으면 일부 Capacitor 8 빌드 깨질 수 있음)
- `android/gradle/wrapper/gradle-wrapper.properties` 의 Gradle 버전 확인
- Android Studio → File → Invalidate Caches and Restart

### AVD 가 회색 (앱 화면 안 뜸)
- `npx cap sync android` 다시 실행
- Android Studio 에서 ▶ Run 한 번 더

### Firebase `auth/configuration-not-found`
- Firebase 콘솔에서 Authentication → Email/Password 활성화 확인

### Firestore "The query requires an index"
- 콘솔(원격 디버깅 또는 Android Studio Logcat)에 출력된 링크 클릭 → Firebase Console 에서 [생성] → 1~2분 대기

### Capacitor `cap add` 가 실패
- Capacitor 8 은 Node 20+ 필요. `node --version` 확인
- `node_modules` 삭제 후 `npm install` 재시도

---

## 6. 배포 (선택)

학교 과제 범위에서는 디버그 APK 만으로 충분합니다. Release APK 가 필요하면:

```bash
# Android Studio → Build → Generate Signed Bundle / APK → APK → Create new keystore → Build
```

(서명 키 관리·Play Store 배포는 본 과제 범위 외)

---

## 7. 자주 쓰는 명령 요약

| 명령 | 효과 |
|---|---|
| `npm run dev` | 웹 dev 서버 (localhost:5173) |
| `npm run build` | 웹 정적 빌드 (`dist/`) |
| `npm run android` | 빌드 + Capacitor sync + Android Studio 오픈 |
| `npm run android:sync` | 빌드 + Capacitor sync (Android Studio 안 열기) |
| `npx cap add android` | 최초 Android 플랫폼 추가 |
| `npx cap sync android` | `dist/` 를 `android/` 로 동기화 |
| `npx cap open android` | Android Studio 만 오픈 |
| `npm run typecheck` | TypeScript 검증 |

---

## 8. 환경별 차이

| 항목 | 웹 (dev/build) | Android (Capacitor) |
|---|---|---|
| 위치 권한 | 브라우저 모달 | OS 네이티브 모달 (`@capacitor/geolocation`) |
| 자동 로그인 | Firebase `browserLocalPersistence` | 동일 (Capacitor WebView 가 IndexedDB 보유) |
| Web Share | navigator.share (Chrome HTTPS) | 네이티브 공유 시트 (Android 표준) |
| 상태바 | 브라우저 외관 | `@capacitor/status-bar` 로 색 제어 (`#13171E`) |
| 카카오맵 | `http://localhost:5173` | `https://localhost` 또는 `capacitor://localhost` |

---

*이상입니다. 위 가이드에 따라 빌드하면 실행 가능한 Android 앱이 완성됩니다.*
