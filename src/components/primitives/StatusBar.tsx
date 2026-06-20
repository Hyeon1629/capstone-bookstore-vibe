interface StatusBarProps {
  tint?: 'paper' | 'dark';
}

/**
 * iOS 스타일 가짜 상태바(시간·신호·배터리). 웹에서는 브라우저 자체 chrome 과
 * 중복이라 렌더링하지 않는다. Capacitor 안드로이드 빌드에서도 OS 상태바가
 * 자체 표시되므로 별도 렌더 필요 없음.
 *
 * 컴포넌트는 호환성 유지를 위해 보존되지만 항상 null 을 반환한다.
 * 추후 다시 mock UI 가 필요해지면 본 함수 내부만 복구.
 */
export function StatusBar(_props: StatusBarProps) {
  return null;
}
