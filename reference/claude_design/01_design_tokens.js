// 디자인 토큰 — Palette C "Late Bookshop" + Pairing 2 "Vintage Warmth"
// CSS 변수와 동기화. 컴포넌트 안에서는 가능하면 var(--...) 를 쓰지만,
// JS에서 동적으로 색을 합성할 때는 아래 객체를 참조한다.

const TOKENS = {
  color: {
    bgMidnight: "#13171E",
    bgDeeper: "#0D1116",
    surface01: "#1D232C",
    surface02: "#2A313C",
    surface03: "#353D4A",
    hairline: "#2B323D",
    hairlineStrong: "#3A4250",

    paper: "#F2EAD9",
    paperSoft: "#E8DEC8",
    paperDim: "#C3B9A6",
    paperMute: "#847D70",

    accentLamp: "#F2B872",
    accentLampDeep: "#D99852",

    pinBookstore: "#E8804D",
    pinLibrary: "#8AB293",
    goldVisited: "#F5CD6E",

    ok: "#8AB293",
    error: "#E07A6B",
    info: "#7AA5C4",
  },
  type: {
    displayKR: '"Gowun Batang", "EB Garamond", serif',
    displayEN: '"EB Garamond", "Gowun Batang", serif',
    ui: '"Pretendard Variable", "Pretendard", system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
  },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 },
  radius: { btn: 10, input: 12, card: 16, sheet: 24, pill: 999 },
};

// 디바이스 캔버스 크기 (브리프: 375×812)
const PHONE = { w: 375, h: 812 };

window.TOKENS = TOKENS;
window.PHONE = PHONE;
