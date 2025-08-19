'use client';

// src/lib/firebase-client.ts
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { app } from './firebase'; // Import the initialized app

const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
