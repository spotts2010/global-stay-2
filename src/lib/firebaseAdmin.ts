// src/lib/firebaseAdmin.ts

import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import { logger } from './logger';

function isBuildOrPrerender(): boolean {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-export' ||
    process.env.NEXT_RUNTIME === 'edge'
  );
}

let _app: App | null = null;
let _db: Firestore | null = null;
let _storage: Storage | null = null;

function parseServiceAccountFromEnv(value: string): unknown {
  // Try JSON first
  try {
    return JSON.parse(value);
  } catch {
    // Fallback: treat as file path (lazy require to avoid bundling)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs') as typeof import('fs');

    if (!fs.existsSync(value)) {
      throw new Error('FIREBASE_ADMIN_KEY must be valid JSON content or an existing file path.');
    }

    const raw = fs.readFileSync(value, 'utf8');
    return JSON.parse(raw);
  }
}

function initializeAdminApp(): boolean {
  if (_app) return true;
  if (getApps().length > 0) {
    _app = getApps()[0]!;
    return true;
  }

  const keyString = process.env.FIREBASE_ADMIN_KEY;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  // If missing config during build/prerender, do not throw—let pages render without admin data.
  if ((!keyString || !storageBucket) && isBuildOrPrerender()) {
    logger.warn(
      'Firebase Admin SDK not initialised during build/prerender (missing FIREBASE_ADMIN_KEY or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).'
    );
    return false;
  }

  // Runtime path: be strict
  if (!keyString) {
    throw new Error('FIREBASE_ADMIN_KEY environment variable is not set (must be JSON content).');
  }
  if (!storageBucket) {
    throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable is not set.');
  }

  const serviceAccount = parseServiceAccountFromEnv(keyString);

  _app = initializeApp({
    credential: cert(serviceAccount as any),
    storageBucket,
  });

  return true;
}

/* -------------------------------------------------------------------------- */
/* SAFE ACCESSORS (nullable for build/prerender)                              */
/* -------------------------------------------------------------------------- */

export function getAdminDb(): Firestore | null {
  const ok = initializeAdminApp();
  if (!ok) return null;
  if (_db) return _db;
  _db = getFirestore(_app!);
  return _db;
}

export function getAdminStorage(): Storage | null {
  const ok = initializeAdminApp();
  if (!ok) return null;
  if (_storage) return _storage;
  _storage = getStorage(_app!);
  return _storage;
}

/* -------------------------------------------------------------------------- */
/* STRICT ACCESSORS (for Server Actions / API routes)                         */
/* -------------------------------------------------------------------------- */

export function requireAdminDb(): Firestore {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin DB is not available in this environment.');
  return db;
}

export function requireAdminStorage(): Storage {
  const storage = getAdminStorage();
  if (!storage) throw new Error('Firebase Admin Storage is not available in this environment.');
  return storage;
}
