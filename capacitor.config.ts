import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chhath.app',
  appName: 'छठ महापर्व',
  webDir: 'dist',
  server: {
    url: 'https://chhathvibes.vercel.app',
    cleartext: true
  }
};

export default config;
