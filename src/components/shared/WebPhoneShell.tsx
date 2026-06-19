import type { ReactNode } from 'react';

/**
 * 웹(브라우저)에서만 앱을 스마트폰 규격(375×812)으로 가운데 정렬해 보여주는 래퍼.
 * - Capacitor 네이티브에서는 사용하지 않음 (main.tsx 에서 분기).
 * - `.app-phone` 의 transform 이 내부 `position: fixed` 오버레이를 프레임 안에 가둠.
 * - 작은 화면(모바일 웹)에서는 프레임이 뷰포트를 꽉 채워 일반 풀스크린처럼 동작.
 */
export function WebPhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="web-phone-backdrop">
      <div className="app-phone">{children}</div>
    </div>
  );
}
