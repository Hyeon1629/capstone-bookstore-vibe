import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { midnight: '#13171E', deeper: '#0D1116' },
        surface: { '01': '#1D232C', '02': '#2A313C', '03': '#353D4A' },
        hairline: { DEFAULT: '#2B323D', strong: '#3A4250' },
        paper: { DEFAULT: '#F2EAD9', soft: '#E8DEC8', dim: '#C3B9A6', mute: '#847D70' },
        lamp: { DEFAULT: '#F2B872', deep: '#D99852' },
        pin: { bookstore: '#E8804D', library: '#8AB293' },
        gold: { visited: '#F5CD6E' },
        ok: '#8AB293',
        error: '#E07A6B',
        info: '#7AA5C4',
      },
      fontFamily: {
        display: ['"Gowun Batang"', '"EB Garamond"', 'serif'],
        'display-en': ['"EB Garamond"', '"Gowun Batang"', 'serif'],
        ui: ['"Pretendard Variable"', '"Pretendard"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { btn: '10px', input: '12px', card: '16px', sheet: '24px' },
      boxShadow: {
        soft: '0 8px 24px -10px rgba(30, 20, 12, 0.5)',
        warm: '0 18px 36px -16px rgba(30, 20, 12, 0.55), 0 4px 12px -2px rgba(20, 14, 8, 0.4)',
        glow: '0 0 28px -4px rgba(242, 184, 114, 0.33)',
      },
    },
  },
  plugins: [],
};

export default config;
