export function kakaoMapDirectionUrl(name: string, lat: number, lng: number): string {
  const safeName = encodeURIComponent(name);
  return `https://map.kakao.com/link/to/${safeName},${lat},${lng}`;
}

export interface ShareResult {
  kind: 'shared' | 'copied' | 'failed';
  message: string;
}

export async function shareOrCopy({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({ title, text, url });
      return { kind: 'shared', message: '공유되었어요' };
    } catch (err) {
      // 사용자 취소 등 — 클립보드로 fallback 시도
      if ((err as DOMException).name === 'AbortError') {
        return { kind: 'failed', message: '공유를 취소했어요' };
      }
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return { kind: 'copied', message: '링크가 복사되었어요' };
    } catch {
      return { kind: 'failed', message: '복사에 실패했어요' };
    }
  }

  return { kind: 'failed', message: '공유를 지원하지 않는 환경이에요' };
}
