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
