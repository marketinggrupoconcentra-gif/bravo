import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Test Configuration for Bravo México
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use */
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",
    /* Collect trace when retrying the failed test. */
    trace: "on-first-retry",
    /* Take screenshot on test failure */
    screenshot: "only-on-failure",
    /* Global timeout for each action */
    actionTimeout: 10_000,
    /* Navigation timeout */
    navigationTimeout: 30_000,
  },

  /* Configure projects for major browsers — only Chromium for Windows compatibility */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
