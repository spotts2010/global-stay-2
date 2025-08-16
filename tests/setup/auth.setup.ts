import { test as setup } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to save the mock auth state
const authFile = path.resolve(__dirname, 'auth.json');

setup('authenticate', async ({ page }) => {
  // Go to your app's login page (replace if different)
  await page.goto('/login');

  // Inject fake Firebase user data into localStorage
  // This simulates a logged-in state for subsequent tests
  await page.evaluate(() => {
    const mockUser = {
      uid: 'mock-user-123',
      displayName: 'Mock User',
      email: 'mockuser@example.com',
      emailVerified: true,
      providerData: [
        {
          providerId: 'password',
          uid: 'mock-user-123',
          displayName: 'Mock User',
          email: 'mockuser@example.com',
          photoURL: null,
        },
      ],
      // Add other necessary fields if your app uses them
    };

    // Firebase Auth uses a specific key format in localStorage
    // You might need to adjust the key based on your Firebase project config if it doesn't work
    const firebaseAuthKey = `firebase:authUser:${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}:[DEFAULT]`;
    localStorage.setItem(firebaseAuthKey, JSON.stringify(mockUser));
  });

  // Save browser state (cookies, localStorage, etc.) to the specified file
  await page.context().storageState({ path: authFile });
});
