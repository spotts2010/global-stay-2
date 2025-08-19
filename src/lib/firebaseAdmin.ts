import admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  // Get the base64 encoded service account key from environment variables
  const serviceAccountKeyBase64 = process.env.FIREBASE_ADMIN_KEY;

  if (!serviceAccountKeyBase64) {
    throw new Error('FIREBASE_ADMIN_KEY environment variable is not set.');
  }

  try {
    // Decode the base64 string to get the JSON string
    const serviceAccountJson = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Failed to initialize Firebase Admin SDK:', error.message);
    throw new Error('Invalid Firebase Admin SDK credentials.');
  }
}

const db = admin.firestore();

// Export the initialized db instance
export { db };
