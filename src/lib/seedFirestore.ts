// src/lib/seedFirestore.ts
import { db } from './firebaseAdmin';
import type { Accommodation } from './data';

// Define your collections data here or import from a separate file
const collections = [
  {
    id: 'c1',
    title: 'Beachfront Villas',
    description: 'Luxury villas with ocean views',
    image: 'https://picsum.photos/400/533',
    imageHint: 'beachfront villa',
  },
  {
    id: 'c2',
    title: 'City Apartments',
    description: 'Modern apartments in the city center',
    image: 'https://picsum.photos/400/534',
    imageHint: 'city apartment',
  },
  // Add more collections as needed
];

const accommodations: Accommodation[] = [
  {
    id: 'acc1',
    name: 'The Oceanfront Pearl',
    location: 'Malibu, California',
    price: 850,
    rating: 4.9,
    reviewsCount: 120,
    image: 'https://picsum.photos/600/400',
    amenities: ['wifi', 'pool', 'kitchen', 'parking'],
    type: 'Villa',
    imageHint: 'luxury villa ocean',
    lat: 34.0259,
    lng: -118.7798,
  },
  {
    id: 'acc2',
    name: 'Metropolitan Loft',
    location: 'SoHo, New York',
    price: 450,
    rating: 4.7,
    reviewsCount: 250,
    image: 'https://picsum.photos/601/401',
    amenities: ['wifi', 'gym', 'kitchen'],
    type: 'Loft',
    imageHint: 'modern city loft',
    lat: 40.7222,
    lng: -74.0002,
  },
  {
    id: 'acc3',
    name: 'Alpine Chalet',
    location: 'Aspen, Colorado',
    price: 620,
    rating: 4.8,
    reviewsCount: 85,
    image: 'https://picsum.photos/602/402',
    amenities: ['wifi', 'parking', 'kitchen'],
    type: 'House',
    imageHint: 'ski chalet mountains',
    lat: 39.1911,
    lng: -106.8175,
  },
  {
    id: 'acc4',
    name: 'The Grand Hotel',
    location: 'Paris, France',
    price: 380,
    rating: 4.6,
    reviewsCount: 1200,
    image: 'https://picsum.photos/603/403',
    amenities: ['wifi', 'gym', 'pool'],
    type: 'Hotel',
    imageHint: 'classic hotel facade',
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    id: 'acc5',
    name: 'Cozy City Apartment',
    location: 'London, United Kingdom',
    price: 210,
    rating: 4.5,
    reviewsCount: 310,
    image: 'https://picsum.photos/604/404',
    amenities: ['wifi', 'kitchen'],
    type: 'Apartment',
    imageHint: 'small apartment interior',
    lat: 51.5074,
    lng: -0.1278,
  },
];

async function seedCollections() {
  try {
    for (const col of collections) {
      await db.collection('collections').doc(col.id).set(col);
      console.log(`Seeded collection: ${col.title}`);
    }
    console.log('Collection seeding complete!');
  } catch (err) {
    console.error('Collection seeding failed:', err);
  }
}

async function seedAccommodations() {
  try {
    for (const acc of accommodations) {
      await db.collection('accommodations').doc(acc.id).set(acc);
      console.log(`Seeded accommodation: ${acc.name}`);
    }
    console.log('Accommodation seeding complete!');
  } catch (err) {
    console.error('Accommodation seeding failed:', err);
  }
}

async function seedAll() {
  await seedCollections();
  await seedAccommodations();
}

// Execute only if script is run directly
seedAll();
