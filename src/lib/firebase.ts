// src/lib/firebase.ts
// Centralized Firebase initialization & exports

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Firebase config is loaded from environment variables
// TODO: Create a .env.local file in the root of your project
// and add your Firebase configuration there.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Ensure Firebase app is only initialized once
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Auth setup
const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore setup
const db: Firestore = getFirestore(app);

// Storage setup
const storage: FirebaseStorage = getStorage(app);

// Export everything for easy reuse
export { app, auth, googleProvider, db, storage };
