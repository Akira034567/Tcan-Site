import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;
const env = { ASTRO_OUT_DIR: './dist-test', PUBLIC_GA4_ID: 'G-TEST1234', PUBLIC_INDEXING: 'false' };

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  workers: 3,
  timeout: 60_000,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npx astro build && node scripts/serve.ts dist-test ${PORT}`,
    url: `http://localhost:${PORT}/`,
    env,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
