import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const projectPath = '/civilization-wander/';

export default defineConfig({
  testDir: './tests/browser',
  globalSetup: './tests/browser/support/start-production-preview.ts',
  outputDir: './test-results/browser',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never' }]]
    : 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}${projectPath}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
