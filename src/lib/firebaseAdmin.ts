// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { logger } from './logger';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return;
  }

  try {
    const keyString = process.env.FIREBASE_ADMIN_KEY;
    if (!keyString) {
      throw new Error(
        'FIREBASE_ADMIN_KEY environment variable is not set. Please provide the JSON key content directly.'
      );
    }

    let serviceAccount;
    try {
      // First, try to parse it as a JSON string
      serviceAccount = JSON.parse(keyString);
    } catch {
      // If parsing fails, assume it's a file path
      if (!fs.existsSync(keyString)) {
        throw new Error(`Firebase Admin JSON key not found at path: ${keyString}`);
      }
      serviceAccount = JSON.parse(fs.readFileSync(keyString, 'utf8'));
    }

    // This is the correct bucket name, now that it has been created.
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!storageBucket) {
      throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable is not set.');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error) {
    logger.error('Firebase Admin SDK initialization failed:', error);
    let errorMessage =
      'Could not initialize Firebase Admin SDK. Please check your environment variables.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Throw a more specific error to make debugging easier in the future.
    throw new Error(errorMessage);
  }
}

function getAdminDb() {
  initializeAdminApp();
  return admin.firestore();
}

function getAdminStorage() {
  initializeAdminApp();
  return admin.storage();
}

export { getAdminDb, getAdminStorage };
