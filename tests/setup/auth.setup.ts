import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';

const authFile = 'tests/setup/auth.json';

setup('authenticate', async ({ page }) => {
  // Directly set localStorage values that Firebase Auth would use
  await page.goto('/');
  await page.evaluate((key) => {
    const authUser = {
      uid: 'mockUser123',
      email: 'mockuser@example.com',
      displayName: 'Mock User',
      stsTokenManager: {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        expirationTime: Date.now() + 3600000,
      },
      emailVerified: true,
    };
    localStorage.setItem(key, JSON.stringify(authUser));
  }, `firebase:authUser:${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}:[DEFAULT]`);

  // Save authenticated state to a file.
  await page.context().storageState({ path: authFile });

  // Verify the file was created.
  expect(fs.existsSync(authFile)).toBeTruthy();
});
