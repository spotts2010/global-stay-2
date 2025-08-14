// tests/setup/mockFirebase.ts
import path from 'path';
import fs from 'fs';

// Path to your Jest Firebase mock
const jestMockPath = path.resolve(__dirname, '../../src/lib/__mocks__/firebase.ts');

export async function mockFirebaseInBrowser(page) {
  const mockCode = fs.readFileSync(jestMockPath, 'utf8');

  // Inject the mock into the browser before app scripts load
  await page.addInitScript({
    content: `
      (() => {
        const exports = {};
        ${mockCode}
        // Expose as a global variable so your app's imports see this instead
        window.__mockFirebase = exports;
      })();
    `,
  });
}
