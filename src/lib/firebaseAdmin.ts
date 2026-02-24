// src/lib/firebaseAdmin.ts
import 'server-only';

import admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';
import type { Storage } from 'firebase-admin/storage';
import fs from 'fs';
import { logger } from './logger';

function isBuildOrPrerender(): boolean {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-export' ||
    process.env.NEXT_RUNTIME === 'edge'
  );
}

function initializeAdminApp(): boolean {
  if (admin.apps.length > 0) return true;

  // Load .env files only in local/dev execution (avoids side effects in build/hosting)
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require('dotenv') as typeof import('dotenv');
    dotenv.config({ path: '.env.local' });
    dotenv.config({ path: '.env' });
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
    throw new Error(
      'FIREBASE_ADMIN_KEY environment variable is not set. Provide the JSON key content directly or a file path.'
    );
  }
  if (!storageBucket) {
    throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable is not set.');
  }

  let serviceAccount: unknown;

  try {
    // Try JSON first
    serviceAccount = JSON.parse(keyString);
  } catch {
    // Fallback: treat as file path
    if (!fs.existsSync(keyString)) {
      if (isBuildOrPrerender()) {
        logger.warn(
          `Firebase Admin SDK not initialised during build/prerender (key file not found at path: ${keyString}).`
        );
        return false;
      }
      throw new Error(`Firebase Admin JSON key not found at path: ${keyString}`);
    }

    try {
      serviceAccount = JSON.parse(fs.readFileSync(keyString, 'utf8'));
    } catch (err) {
      if (isBuildOrPrerender()) {
        logger.warn(
          `Firebase Admin SDK not initialised during build/prerender (failed to parse key file at path: ${keyString}).`
        );
        return false;
      }
      throw err;
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
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
  return admin.firestore();
}

export function getAdminStorage(): Storage | null {
  const ok = initializeAdminApp();
  if (!ok) return null;
  return admin.storage();
}

/* -------------------------------------------------------------------------- */
/* STRICT ACCESSORS (for Server Actions / API routes)                         */
/* -------------------------------------------------------------------------- */

export function requireAdminDb(): Firestore {
  const db = getAdminDb();
  if (!db) {
    throw new Error('Firebase Admin DB is not available in this environment.');
  }
  return db;
}

export function requireAdminStorage(): Storage {
  const storage = getAdminStorage();
  if (!storage) {
    throw new Error('Firebase Admin Storage is not available in this environment.');
  }
  return storage;
}
