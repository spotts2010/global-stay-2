// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

function getAdminDb() {
  if (admin.apps.length > 0) {
    return admin.firestore();
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

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    let errorMessage =
      'Could not initialize Firebase Admin SDK. Please check your environment variables.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Throw a more specific error to make debugging easier in the future.
    throw new Error(errorMessage);
  }

  return admin.firestore();
}

export { getAdminDb };
