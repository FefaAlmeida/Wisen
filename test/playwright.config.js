import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.js",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45000,
  reporter: "list",
  outputDir: "../test-results/e2e",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:18081",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
