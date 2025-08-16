'use client';
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Define a type for our mock module
interface MockFirebase {
  app: FirebaseApp;
  auth: Auth;
  googleProvider: GoogleAuthProvider;
  db: Firestore;
  storage: FirebaseStorage;
}

let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let db: Firestore;
let storage: FirebaseStorage;

// Type assertion for the window object
const windowWithMock =
  typeof window !== 'undefined'
    ? (window as Window & { __mockFirebase?: MockFirebase })
    : undefined;

if (process.env.NODE_ENV === 'test' || windowWithMock?.__mockFirebase) {
  // In a test environment or if the mock is present, use it.
  // This is primarily for Playwright tests where we inject the mock.
  const mock = windowWithMock?.__mockFirebase;
  if (mock) {
    app = mock.app;
    auth = mock.auth;
    googleProvider = mock.googleProvider;
    db = mock.db;
    storage = mock.storage;
  } else {
    // This branch is for Jest environment
    // Note: Jest setup will globally mock these modules.
    // This code block might not even run in Jest, but is here for completeness.
    (async () => {
      const mockFirebase = await import('./__mocks__/firebase');
      app = mockFirebase.app;
      auth = mockFirebase.getAuth();
      googleProvider = new mockFirebase.GoogleAuthProvider();
      db = mockFirebase.getFirestore();
      storage = mockFirebase.getStorage();
    })();
  }
} else {
  // Real Firebase config for production/development
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

export { app, auth, googleProvider, db, storage };
