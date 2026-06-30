import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.policynavi.student',
  appName: '政策指南针',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      signingType: 'apk'
    }
  }
};

export default config;
