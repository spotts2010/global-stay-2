// src/lib/firebase-db.ts
'use client';

import { getFirestore, type Firestore } from 'firebase/firestore';
import { app } from './firebase-config';

const db: Firestore = getFirestore(app);

export { db };
