// src/lib/seedFirestore.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local BEFORE other imports
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from './firebaseAdmin';

// Define your collections data here or import from a separate file
const collections = [
  {
    id: 'c1',
    title: 'Beachfront Villas',
    description: 'Luxury villas with ocean views',
    image: 'beachfront.jpg',
    imageHint: 'beachfront',
  },
  {
    id: 'c2',
    title: 'City Apartments',
    description: 'Modern apartments in the city center',
    image: 'city.jpg',
    imageHint: 'city',
  },
  // Add more collections as needed
];

async function seedCollections() {
  try {
    for (const col of collections) {
      await db.collection('collections').doc(col.id).set(col);
      console.log(`Seeded collection: ${col.title}`);
    }
    console.log('Firestore seeding complete!');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

// Execute only if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCollections();
}
