// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const adminKey = process.env.FIREBASE_ADMIN_KEY;
    if (!adminKey) {
      throw new Error('FIREBASE_ADMIN_KEY environment variable not set.');
    }

    // The key is a Base64 encoded JSON string. Decode it.
    const decodedKey = Buffer.from(adminKey, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decodedKey);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    throw new Error(
      'Could not initialize Firebase Admin SDK. Please check your configuration and environment.'
    );
  }
}

const db = admin.firestore();

export { db };
