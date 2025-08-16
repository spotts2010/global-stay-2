import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to mock auth state file
const authFile = path.resolve(__dirname, 'tests/setup/auth.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://127.0.0.1:9002',
    trace: 'on-first-retry',
  },

  projects: [
    // 1️⃣ Setup project to generate mock auth.json
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2️⃣ Chromium tests that depend on auth state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile, // load mock auth
      },
      dependencies: ['setup'], // run setup first
    },

    // (Optional) Add Firefox & WebKit if needed later
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:9002',
    reuseExistingServer: !process.env.CI,
  },
});
