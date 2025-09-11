// src/lib/seedFirestore.ts
import { db } from './firebaseAdmin'; // Use admin SDK for server-side operations
import { collections as curatedCollectionsData } from './data';
import type { Amenity } from './data';

console.log('--- Starting Firestore Seed Script ---');

// --- Mock Accommodations Data ---
const accommodationsData: {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  amenities: Amenity[];
  type: 'Apartment' | 'Villa' | 'Hotel' | 'Loft' | 'House';
  imageHint: string;
  lat: number;
  lng: number;
}[] = [
  {
    id: 'acc1',
    name: 'The Oceanfront Pearl',
    location: 'Malibu, California',
    price: 850,
    rating: 4.9,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1613553425969-9d524b89656b',
    amenities: ['wifi', 'pool', 'kitchen', 'parking'],
    type: 'Villa',
    imageHint: 'luxury villa ocean view',
    lat: 34.0259,
    lng: -118.7798,
  },
  {
    id: 'acc2',
    name: 'Downtown Artist Loft',
    location: 'New York, New York',
    price: 450,
    rating: 4.7,
    reviewsCount: 250,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    amenities: ['wifi', 'kitchen', 'gym'],
    type: 'Loft',
    imageHint: 'modern apartment living room',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: 'acc3',
    name: 'The Grand Budapest Hotel',
    location: 'Zubrowka, Republic of',
    price: 620,
    rating: 5.0,
    reviewsCount: 1932,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    amenities: ['wifi', 'pool', 'gym', 'parking'],
    type: 'Hotel',
    imageHint: 'luxury hotel exterior',
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    id: 'acc4',
    name: 'Secluded Mountain Cabin',
    location: 'Aspen, Colorado',
    price: 380,
    rating: 4.8,
    reviewsCount: 85,
    image: 'https://images.unsplash.com/photo-1551913902-c94248a5fe36',
    amenities: ['wifi', 'kitchen', 'parking'],
    type: 'House',
    imageHint: 'cabin in snowy forest',
    lat: 39.1911,
    lng: -106.8175,
  },
  {
    id: 'acc5',
    name: 'Sydney Harbour View Suite',
    location: 'Sydney, Australia',
    price: 210,
    rating: 4.6,
    reviewsCount: 450,
    image: 'https://images.unsplash.com/photo-1541421029124-75376c64686a',
    amenities: ['wifi', 'pool', 'gym'],
    type: 'Apartment',
    imageHint: 'apartment with city view',
    lat: -33.8688,
    lng: 151.2093,
  },
];

/**
 * Seeds a specific collection in Firestore.
 * @param collectionName - The name of the collection to seed.
 * @param data - An array of objects to add to the collection.
 */
async function seedCollection(collectionName: string, data: { id: string }[]) {
  const collectionRef = db.collection(collectionName);
  const batch = db.batch();
  let count = 0;

  console.log(`\nSeeding collection: "${collectionName}"...`);

  for (const item of data) {
    const docRef = collectionRef.doc(item.id);
    batch.set(docRef, item);
    count++;
  }

  await batch.commit();
  console.log(`✅ Successfully seeded ${count} documents into "${collectionName}".`);
}

/**
 * Main function to run all seeding operations.
 */
async function seedAll() {
  try {
    await seedCollection('accommodations', accommodationsData);
    await seedCollection('curated_collections', curatedCollectionsData);
    // Add other collections to seed here, e.g., bookings, users etc.
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

seedAll().then(() => {
  console.log('\n--- Firestore Seeding Complete ---');
  process.exit(0);
});
