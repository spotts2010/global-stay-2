// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let db: Firestore;
let storage: FirebaseStorage;

if (
  process.env.NODE_ENV === 'test' ||
  (typeof window !== 'undefined' && (window as any).__mockFirebase)
) {
  // ✅ Load mock instead
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mockFirebase = require('./__mocks__/firebase');
  app = mockFirebase.app;
  auth = mockFirebase.auth;
  googleProvider = mockFirebase.googleProvider;
  db = mockFirebase.db;
  storage = mockFirebase.storage;
} else {
  // ✅ Real Firebase config
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
  storage = getStorage(app);
}

// ✅ Always top-level exports
export { app, auth, googleProvider, db, storage };
