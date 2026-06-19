# STEP 7 — Capacitor Android 패키징 (설계 문서)

> 웹 빌드를 Capacitor 로 감싸 Android Studio AVD 에서 실행. 시연용 마지막 단계.
> Plan 단계 산출물. 사용자 승인 후 본 명세대로 구현한다.

---

## 1. 사전 조건 (사용자 측에서 확인 필요)

본 STEP 의 코드 작성과 별개로, 사용자 머신에 다음이 준비되어 있어야 한다:

| 항목 | 확인 |
|---|---|
| Java 17 (Temurin / Oracle / OpenJDK) | `java -version` |
| Android Studio Hedgehog (2023.1.1) 이상 | 설치 확인 |
| Android SDK Platform 34 + Build-Tools 34.x | Android Studio → SDK Manager |
| AVD (Pixel 6 / API 34) + Korean 시스템 언어 설정 | Android Studio → Device Manager |
| `JAVA_HOME` 환경변수 설정 | `echo $env:JAVA_HOME` (PowerShell) |
| **카카오 콘솔 도메인 추가**: `http://localhost` + `https://localhost` + `capacitor://localhost` | 카카오 개발자 콘솔 → 플랫폼 → Web |

위 항목이 미완료여도 **Capacitor 설치 + 설정 + 코드 통합** 까지는 모두 자동화 가능. `npx cap add android` 만 사용자 측에서 직접 실행 (Android SDK 경로 자동 감지).

---

## 2. 의존성 설치

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor/geolocation @capacitor/status-bar @capacitor/preferences
```

### 추가되는 패키지 (6종)
| 패키지 | 용도 |
|---|---|
| `@capacitor/core` | Capacitor 런타임 |
| `@capacitor/cli` | `npx cap ...` CLI |
| `@capacitor/android` | Android 플랫폼 |
| `@capacitor/geolocation` | 네이티브 GPS |
| `@capacitor/status-bar` | 상태바 색 제어 |
| `@capacitor/preferences` | 자동 로그인 토큰 등 키-밸류 저장 (옵션, 본 STEP 단순 통합만) |

---

## 3. `capacitor.config.ts` (프로젝트 루트)

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.school.hiddenbookstore',
  appName: '숨은 책방',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    StatusBar: {
      backgroundColor: '#13171E',
      style: 'DARK',
    },
  },
};

export default config;
```

- `appId`: 학교 과제용 `com.school.hiddenbookstore`
- `androidScheme: 'https'` 로 두면 카카오맵 SDK 의 referer 검사가 `https://localhost` 로 들어감 → 카카오 콘솔에 등록 필요

---

## 4. Android 플랫폼 추가

```bash
# 1) Vite 빌드
npm run build

# 2) Capacitor 초기 + Android 플랫폼 추가
#    (capacitor.config.ts 가 이미 있으면 init 스킵 가능)
npx cap add android
```

`npx cap add android` 실행 시 프로젝트 루트에 `android/` 폴더 생성. Android Studio 가 이를 Gradle 프로젝트로 인식.

**시연자가 직접 실행해야 하는 명령** (Android SDK 경로가 사용자 머신에 종속적이므로 본 STEP 자동화 범위 외):
```bash
npx cap add android
```

---

## 5. AndroidManifest 권한

`android/app/src/main/AndroidManifest.xml` 의 `<manifest>` 안에 다음 권한 3종 추가. **`npx cap add android` 시 INTERNET 은 자동 포함**. 위치 권한 2종은 우리가 추가.

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

본 STEP 에서 `android/app/src/main/AndroidManifest.xml` 을 직접 수정. (시연자가 `cap add android` 실행 후 한 번 patch 가 필요한 곳)

### android:usesCleartextTraffic
디버그 빌드에서 `http://localhost` 호출이 필요할 수 있어 `<application>` 에 `android:usesCleartextTraffic="true"` 추가. **(승인 항목 1)**

권장: 시연용으로 추가. 프로덕션은 HTTPS only 라 cleartext 불필요하지만 학교 시연 단순화.

---

## 6. 네이티브 분기 헬퍼 — `src/lib/platform.ts`

```ts
import { Capacitor } from '@capacitor/core';

export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export function getPlatform(): 'ios' | 'android' | 'web' {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
}
```

웹 빌드와 Android 빌드에서 동일 코드가 다르게 동작해야 할 때 사용. 본 STEP 에서 GPS hook 만 분기.

---

## 7. `useGeolocation` 업그레이드

`src/hooks/useGeolocation.ts` 가 현재 `navigator.geolocation.watchPosition` 만 사용. Capacitor 환경에서는 `@capacitor/geolocation` 의 `Geolocation.watchPosition` 으로 분기.

```ts
import { Geolocation } from '@capacitor/geolocation';
import { isNative } from '@/lib/platform';

useEffect(() => {
  if (isNative()) {
    // Capacitor 네이티브 (권한 모달 → watch)
    const watchPromise = Geolocation.watchPosition({ enableHighAccuracy: false }, (pos) => {
      if (!pos) return;
      // throttle 동일 적용
      setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
    return () => {
      watchPromise.then((id) => Geolocation.clearWatch({ id }));
    };
  }
  // 웹 경로 (현재 코드 그대로)
  // ...
}, []);
```

플러그인 미사용 시 fallback 으로 `navigator.geolocation` 호출 — Capacitor 가 자동으로 native bridge 로 변환하므로 사실은 분기 없어도 작동. **(승인 항목 2)**

권장: `@capacitor/geolocation` 명시적 사용. 권한 모달이 OS 네이티브로 깔끔하게 뜸.

---

## 8. `package.json` 스크립트 추가

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "android": "npm run build && cap sync android && cap open android"
  }
}
```

`npm run android` 한 번에 빌드 → sync → Android Studio 오픈.

---

## 9. `README_CAPACITOR.md`

시연자가 따라 할 수 있는 자세한 가이드 문서. 본 STEP 에서 새로 작성.

### 포함 항목
1. **사전 조건**: Java 17, Android Studio, AVD 생성 방법
2. **카카오 콘솔 도메인 등록**: 스크린샷 단계 또는 텍스트 가이드
   - `https://localhost`
   - `http://localhost`
   - `capacitor://localhost` (네이티브 webview)
3. **빌드 순서**:
   ```bash
   npm run build
   npx cap add android   # 최초 1회만
   npx cap sync android
   npx cap open android
   ```
4. **Android Studio 에서 [Run] 클릭**:
   - 좌상단 디바이스 드롭다운에서 AVD 선택
   - 우상단 ▶ 또는 `Shift+F10`
5. **AVD 권한 허용**: 첫 진입 시 위치 권한 모달 "허용"
6. **시연 흐름**: README_TEST.md 의 시나리오 A~AA 그대로 작동
7. **트러블슈팅**:
   - 카카오맵이 안 뜸 → 콘솔 도메인 확인
   - 빌드 실패 → `JAVA_HOME` 확인
   - AVD 가 회색 화면 → `npx cap sync android` 다시 실행 후 [Run]
   - Firebase 권한 오류 → Firestore 테스트 모드 만료 확인

---

## 10. Bundle 크기 (Capacitor 시 영향)

현재 880KB / gzip 240KB. Capacitor 는 `dist/` 의 정적 파일을 그대로 패키징 — 추가 부담 없음. APK 크기는 약 4~5MB (Capacitor 런타임 + Chromium WebView 사용으로 작음. WebView 자체는 OS 에서 제공).

manualChunks 분리는 본 STEP 범위 외 (시연용 충분).

---

## 11. 수정·생성 파일 목록

### 생성
- `capacitor.config.ts`
- `src/lib/platform.ts`
- `README_CAPACITOR.md`

### 수정
- `package.json` — 의존성 6종 + `android` 스크립트
- `src/hooks/useGeolocation.ts` — Capacitor Geolocation 분기

### 시연자 측에서 생성 (자동)
- `android/` 폴더 — `npx cap add android` 명령 실행 결과
- 본 STEP 에서는 폴더 생성 후 `AndroidManifest.xml` 수정만 본 저장소에 영구 반영 (`patches/` 또는 명령형 후처리)

### `.gitignore`
이미 `android/` 가 ignore 됨. **(승인 항목 3)** — Android 폴더를 ignore 유지 vs commit (학교 과제 단순화: ignore 유지. 시연자가 `cap add` 로 재생성)

---

## 12. 자가 검증 (STEP 7 완료 시)

본 STEP 은 사용자 머신의 Android SDK 환경 의존성이 있어 일부 검증은 사용자 측에서 수동:

```bash
# 1) 타입 체크 + 빌드
npm run typecheck && npm run build

# 2) Capacitor 설정 파일 존재
test -f capacitor.config.ts
grep "com.school.hiddenbookstore" capacitor.config.ts   # → 1건
grep "숨은 책방" capacitor.config.ts                      # → 1건

# 3) package.json android 스크립트
grep "\"android\":" package.json   # → 1건

# 4) README_CAPACITOR.md 핵심 키워드
grep -E "capacitor://localhost|cap add android|cap open" README_CAPACITOR.md | wc -l   # → 최소 3

# 5) platform.ts 분기 헬퍼
grep "Capacitor.isNativePlatform" src/lib/platform.ts   # → 1건

# 6) useGeolocation 의 native 분기
grep -E "isNative\(\)|@capacitor/geolocation" src/hooks/useGeolocation.ts   # → 최소 1건

# 7) 시연자 수동 (README_CAPACITOR.md 안내):
#    - npx cap add android
#    - AndroidManifest.xml 권한 패치 (본 문서 5절)
#    - npx cap sync android
#    - npx cap open android
#    - AVD [Run] → 회원가입 → 시연 모드 → 핀 long-press → 모달
```

---

## 13. 권장 커밋 메시지

```
feat(android): Capacitor 통합 + Android Studio AVD 빌드
```

---

## 14. 승인 필요 사항

1. **`android:usesCleartextTraffic="true"`**: 시연 디버그용 추가 vs HTTPS only — 권장: 추가 (학교 시연 단순화)
2. **`@capacitor/geolocation` 명시 사용**: vs Capacitor 자동 bridging — 권장: 명시 사용 (권한 모달 깔끔)
3. **`android/` 폴더 .gitignore 유지**: vs commit (재생성 가능 vs 환경 재현성) — 권장: ignore 유지
4. **`AndroidManifest.xml` 권한 패치**: README 안내 + 수동 수정 vs 빌드 스크립트로 자동 patch — 권장: README 안내 (학교 과제 범위 충분)
5. **시연자 측 `npx cap add android` 실행 후 추가 코드 작업이 있을 수 있음** — 시연 전 dry-run 1회 권장. 본 STEP 완료 보고 시 안내.

승인이 떨어지면 의존성 → capacitor.config → platform.ts → useGeolocation 분기 → package.json 스크립트 → README_CAPACITOR.md → 자가 검증 순서로 구현한다.
