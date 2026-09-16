import { defineConfig, devices } from '@playwright/test';

const port = 4174;

export default defineConfig({
  testDir: './tests/browser-v6',
  globalSetup: './tests/browser-v6/support/start-v6-preview.ts',
  outputDir: './test-results/browser-v6',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never', outputFolder: 'playwright-report-v6' }]]
    : 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}/`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true
      }
    }
  ]
});
