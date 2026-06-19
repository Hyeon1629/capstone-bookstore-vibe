export const TOKENS = {
  color: {
    bgMidnight: '#13171E',
    bgDeeper: '#0D1116',
    surface01: '#1D232C',
    surface02: '#2A313C',
    surface03: '#353D4A',
    hairline: '#2B323D',
    hairlineStrong: '#3A4250',

    paper: '#F2EAD9',
    paperSoft: '#E8DEC8',
    paperDim: '#C3B9A6',
    paperMute: '#847D70',

    accentLamp: '#F2B872',
    accentLampDeep: '#D99852',

    pinBookstore: '#E8804D',
    pinLibrary: '#8AB293',
    goldVisited: '#F5CD6E',

    ok: '#8AB293',
    error: '#E07A6B',
    info: '#7AA5C4',
  },
  type: {
    displayKR: '"Gowun Batang", "EB Garamond", serif',
    displayEN: '"EB Garamond", "Gowun Batang", serif',
    ui: '"Pretendard Variable", "Pretendard", system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
  },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 },
  radius: { btn: 10, input: 12, card: 16, sheet: 24, pill: 999 },
} as const;

export const PHONE = { w: 375, h: 812 } as const;

function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function lighten(hex: string, amt: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: clamp(Math.round(r + (255 - r) * amt), 0, 255),
    g: clamp(Math.round(g + (255 - g) * amt), 0, 255),
    b: clamp(Math.round(b + (255 - b) * amt), 0, 255),
  });
}

export function darken(hex: string, amt: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: clamp(Math.round(r * (1 - amt)), 0, 255),
    g: clamp(Math.round(g * (1 - amt)), 0, 255),
    b: clamp(Math.round(b * (1 - amt)), 0, 255),
  });
}
