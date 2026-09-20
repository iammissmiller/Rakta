import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // these tests create real users against your real dev DB; avoid racing them
  retries: 0,
  reporter: "list",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Starts `npm run dev` automatically before tests run, and reuses an
  // already-running dev server if you have one open — so you don't have
  // to remember to start it yourself first.
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
