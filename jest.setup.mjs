// jest.setup.mjs
import '@testing-library/jest-dom';

// Mock Firebase App to prevent initialization warnings in tests
jest.mock('firebase/app', () => {
  const actual = jest.requireActual('firebase/app');
  return {
    ...actual,
    initializeApp: jest.fn(() => ({ name: 'mockApp' })),
    getApps: jest.fn(() => []),
    getApp: jest.fn(() => ({ name: 'mockApp' })),
  };
});

// Mock Firestore & Auth by default to avoid hitting real backend
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));
