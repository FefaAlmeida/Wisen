import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/browser",
  fullyParallel: false,
  workers: 1,
  webServer: process.env.CI
    ? {
        command: "npm run start -w @wisen/frontend",
        url: "http://localhost:3000",
        reuseExistingServer: false,
        timeout: 120000,
      }
    : undefined,
  use: { baseURL: process.env.TEST_URL || "http://localhost:3000", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
});
