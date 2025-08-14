// jest.config.mjs
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Path to your Next.js app for loading next.config.js and .env files
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Mock our local firebase wrapper
    '^@/lib/firebase$': '<rootDir>/src/lib/__mocks__/firebase.ts',

    // Mock *all* firebase SDK imports like firebase/firestore, firebase/auth, etc.
    '^firebase/(.*)$': '<rootDir>/src/lib/__mocks__/firebase.ts',
    '^firebase$': '<rootDir>/src/lib/__mocks__/firebase.ts',

    // General alias mapping
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
