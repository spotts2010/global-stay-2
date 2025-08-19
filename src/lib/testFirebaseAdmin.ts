import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: '.env.local' });

const keyPath = process.env.FIREBASE_ADMIN_KEY_PATH;

if (!keyPath) {
  throw new Error('FIREBASE_ADMIN_KEY_PATH is not set in .env.local');
}

const absolutePath = path.resolve(keyPath);

try {
  const rawData = fs.readFileSync(absolutePath, 'utf-8');
  const parsed = JSON.parse(rawData);
  console.log('✅ Firebase Admin JSON loaded successfully!');
  console.log('Project ID:', parsed.project_id);
} catch (err) {
  console.error('❌ Failed to load Firebase Admin JSON:', err);
}
