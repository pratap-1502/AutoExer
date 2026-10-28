import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import { environment } from './config/environments';

const require = createRequire(import.meta.url);
const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
];
try {
  const allureReporterPath = require.resolve('allure-playwright');
  const localNodeModules = resolve(process.cwd(), 'node_modules').toLowerCase();
  if (allureReporterPath.toLowerCase().startsWith(localNodeModules)) {
    reporters.push(['allure-playwright', { resultsDir: 'allure-results', detail: true }]);
  }
} catch {
  // HTML reporting remains available until optional dependencies can be installed.
}

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? Math.min(environment.workers, 2) : environment.workers,
  outputDir: 'test-results',
  reporter: reporters,
  use: {
    baseURL: environment.baseUrl,
    headless: environment.headless,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', testIgnore: /api\//, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testIgnore: /api\//, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testIgnore: /api\//, use: { ...devices['Desktop Safari'] } },
    { name: 'api', testMatch: /api\/.*\.api\.spec\.ts/ },
  ],
});
