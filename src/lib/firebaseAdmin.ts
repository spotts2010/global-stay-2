import admin from 'firebase-admin';

if (!admin.apps.length) {
  const adminKey = process.env.FIREBASE_ADMIN_KEY;

  if (!adminKey) {
    throw new Error('FIREBASE_ADMIN_KEY environment variable is not set.');
  }

  try {
    // Decode the Base64 string to a UTF-8 JSON string
    const decodedKey = Buffer.from(adminKey, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decodedKey);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to initialize Firebase Admin SDK from Base64 key:', error.message);
    } else {
      console.error('Failed to initialize Firebase Admin SDK from Base64 key:', error);
    }
    throw new Error(
      'Could not load Firebase Admin SDK credentials. Make sure FIREBASE_ADMIN_KEY is a valid Base64 encoded service account.'
    );
  }
}

const db = admin.firestore();

export { db };
