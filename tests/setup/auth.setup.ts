import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to save the mock auth state
const authFile = path.resolve(__dirname, 'auth.json');

setup('authenticate', async ({ page }) => {
  // Go to your app's login page (replace if different)
  await page.goto('/login');

  // Inject fake Firebase user data
  await page.evaluate(() => {
    localStorage.setItem(
      'firebase:authUser',
      JSON.stringify({
        uid: 'mock-user-123',
        displayName: 'Mock User',
        email: 'mockuser@example.com',
        stsTokenManager: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expirationTime: Date.now() + 3600 * 1000,
        },
      })
    );
  });

  // Save browser state
  await page.context().storageState({ path: authFile });
});
