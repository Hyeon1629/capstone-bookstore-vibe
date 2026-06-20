import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true, // 5173 점유 시 에러 — 카카오 도메인 등록 일치 보장
  },
  build: {
    rollupOptions: {
      output: {
        // 무거운 벤더를 분리해 단일 청크 >500KB 경고 해소 + 캐시 효율 향상
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          framer: ['framer-motion'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
