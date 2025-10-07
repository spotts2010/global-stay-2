import dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // Load .env variables

import { getAdminDb } from './firebaseAdmin';
import { collections as curatedCollectionsData } from './data';
import type { Amenity, Currency, BedType, PropertyType } from './data';
import placeholderImages from './placeholder-images.json';

// --- Property Types Data ---
const propertyTypesData: Omit<PropertyType, 'id'>[] = [
  { name: 'Apartment' },
  { name: 'Villa' },
  { name: 'Hotel' },
  { name: 'Loft' },
  { name: 'House' },
  { name: 'Hostel' },
];

// --- Bed Types Data ---
const bedTypesData: Omit<BedType, 'id'>[] = [
  { name: 'Single', systemId: 'single', sleeps: 1 },
  { name: 'Double', systemId: 'double', sleeps: 2 },
  { name: 'Queen', systemId: 'queen', sleeps: 2 },
  { name: 'King', systemId: 'king', sleeps: 2 },
  { name: 'Bunk Bed', systemId: 'bunk', sleeps: 2 },
  { name: 'Sofa Bed', systemId: 'sofa', sleeps: 1 },
];

// --- Site Settings: Hero Images ---
const heroImagesData = {
  id: 'homePage',
  heroImages: placeholderImages.heroImages,
};

// --- Mock Accommodations Data ---
const accommodationsData: {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  currency: Currency;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  amenities: Amenity[];
  type: string;
  bookingType: 'room' | 'bed' | 'hybrid';
  imageHint: string;
  lat: number;
  lng: number;
  lastModified: Date;
  status: 'Published' | 'Draft' | 'Archived';
}[] = [
  {
    id: 'oceanfront-pearl-malibu',
    slug: 'oceanfront-pearl-malibu',
    name: 'The Oceanfront Pearl',
    location: 'Malibu, California',
    price: 850,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 120,
    image: '',
    images: [],
    amenities: ['wifi', 'pool', 'kitchen', 'parking'],
    type: 'Villa',
    bookingType: 'room',
    imageHint: 'luxury villa ocean view',
    lat: 34.0259,
    lng: -118.7798,
    lastModified: new Date('2024-07-20T10:00:00Z'),
    status: 'Published',
  },
  {
    id: 'downtown-artist-loft-nyc',
    slug: 'downtown-artist-loft-nyc',
    name: 'Downtown Artist Loft',
    location: 'New York, New York',
    price: 450,
    currency: 'USD',
    rating: 4.7,
    reviewsCount: 250,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen', 'gym'],
    type: 'Loft',
    bookingType: 'room',
    imageHint: 'modern apartment living room',
    lat: 40.7128,
    lng: -74.006,
    lastModified: new Date('2024-07-22T14:30:00Z'),
    status: 'Published',
  },
  {
    id: 'grand-budapest-hotel',
    slug: 'grand-budapest-hotel',
    name: 'The Grand Budapest Hotel',
    location: 'Zubrowka, Republic of',
    price: 980,
    currency: 'AUD',
    rating: 5.0,
    reviewsCount: 1932,
    image: '',
    images: [],
    amenities: ['wifi', 'pool', 'gym', 'parking'],
    type: 'Hotel',
    bookingType: 'room',
    imageHint: 'luxury hotel exterior',
    lat: 48.8566,
    lng: 2.3522,
    lastModified: new Date('2024-07-18T09:00:00Z'),
    status: 'Published',
  },
  {
    id: 'secluded-mountain-cabin-aspen',
    slug: 'secluded-mountain-cabin-aspen',
    name: 'Secluded Mountain Cabin',
    location: 'Aspen, Colorado',
    price: 380,
    currency: 'USD',
    rating: 4.8,
    reviewsCount: 85,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen', 'parking'],
    type: 'House',
    bookingType: 'room',
    imageHint: 'cabin in snowy forest',
    lat: 39.1911,
    lng: -106.8175,
    lastModified: new Date('2024-07-25T18:00:00Z'),
    status: 'Published',
  },
  {
    id: 'sydney-harbour-view-suite',
    slug: 'sydney-harbour-view-suite',
    name: 'Sydney Harbour View Suite',
    location: 'Sydney, Australia',
    price: 320,
    currency: 'AUD',
    rating: 4.6,
    reviewsCount: 450,
    image: '',
    images: [],
    amenities: ['wifi', 'pool', 'gym'],
    type: 'Apartment',
    bookingType: 'room',
    imageHint: 'apartment with city view',
    lat: -33.8688,
    lng: 151.2093,
    lastModified: new Date('2024-07-24T11:00:00Z'),
    status: 'Published',
  },
  {
    id: 'tropical-treehouse-bali',
    slug: 'tropical-treehouse-bali',
    name: 'Tropical Treehouse',
    location: 'Ubud, Bali',
    price: 150,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 320,
    image: '',
    images: [],
    amenities: ['wifi', 'pool'],
    type: 'House',
    bookingType: 'room',
    imageHint: 'bamboo treehouse jungle',
    lat: -8.5068,
    lng: 115.2625,
    lastModified: new Date('2024-07-23T12:00:00Z'),
    status: 'Published',
  },
  {
    id: 'historic-london-townhouse',
    slug: 'historic-london-townhouse',
    name: 'Historic London Townhouse',
    location: 'London, United Kingdom',
    price: 600,
    currency: 'GBP',
    rating: 4.8,
    reviewsCount: 180,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen'],
    type: 'House',
    bookingType: 'room',
    imageHint: 'classic townhouse interior',
    lat: 51.5074,
    lng: -0.1278,
    lastModified: new Date('2024-07-21T15:00:00Z'),
    status: 'Published',
  },
  {
    id: 'paris-rooftop-apartment',
    slug: 'paris-rooftop-apartment',
    name: 'Paris Rooftop Apartment',
    location: 'Paris, France',
    price: 280,
    currency: 'EUR',
    rating: 4.7,
    reviewsCount: 400,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen'],
    type: 'Apartment',
    bookingType: 'room',
    imageHint: 'rooftop view eiffel tower',
    lat: 48.8566,
    lng: 2.3522,
    lastModified: new Date('2024-07-20T18:45:00Z'),
    status: 'Published',
  },
  {
    id: 'nomads-noosa-youth-resort',
    slug: 'nomads-noosa-youth-resort',
    name: 'Nomads Noosa Youth Resort',
    location: 'Noosa, Australia',
    price: 40,
    currency: 'AUD',
    rating: 4.2,
    reviewsCount: 500,
    image: '',
    images: [],
    amenities: ['wifi', 'pool', 'kitchen'],
    type: 'Hostel',
    bookingType: 'bed',
    imageHint: 'hostel common room',
    lat: -26.392,
    lng: 153.088,
    lastModified: new Date('2024-07-19T13:20:00Z'),
    status: 'Published',
  },
  {
    id: 'tokyo-capsule-hotel',
    slug: 'tokyo-capsule-hotel',
    name: 'Tokyo Capsule Hotel',
    location: 'Tokyo, Japan',
    price: 50,
    currency: 'USD',
    rating: 4.3,
    reviewsCount: 900,
    image: '',
    images: [],
    amenities: ['wifi', 'gym'],
    type: 'Hotel',
    bookingType: 'bed',
    imageHint: 'capsule hotel pod',
    lat: 35.6895,
    lng: 139.6917,
    lastModified: new Date('2024-07-17T22:10:00Z'),
    status: 'Published',
  },
  {
    id: 'beachfront-bungalow-fiji',
    slug: 'beachfront-bungalow-fiji',
    name: 'Beachfront Bungalow Fiji',
    location: 'Fiji',
    price: 400,
    currency: 'AUD',
    rating: 4.9,
    reviewsCount: 210,
    image: '',
    images: [],
    amenities: ['wifi', 'pool'],
    type: 'Villa',
    bookingType: 'room',
    imageHint: 'beach bungalow sunset',
    lat: -17.7134,
    lng: 178.065,
    lastModified: new Date('2024-07-16T08:00:00Z'),
    status: 'Published',
  },
  {
    id: 'lake-como-villa-italy',
    slug: 'lake-como-villa-italy',
    name: 'Lake Como Villa',
    location: 'Lake Como, Italy',
    price: 1200,
    currency: 'EUR',
    rating: 5,
    reviewsCount: 95,
    image: '',
    images: [],
    amenities: ['wifi', 'pool', 'kitchen', 'parking'],
    type: 'Villa',
    bookingType: 'room',
    imageHint: 'italian villa pool',
    lat: 45.9818,
    lng: 9.2596,
    lastModified: new Date('2024-07-15T16:25:00Z'),
    status: 'Published',
  },
  {
    id: 'santorini-cave-house',
    slug: 'santorini-cave-house',
    name: 'Santorini Cave House',
    location: 'Santorini, Greece',
    price: 550,
    currency: 'EUR',
    rating: 4.9,
    reviewsCount: 300,
    image: '',
    images: [],
    amenities: ['wifi', 'pool', 'kitchen'],
    type: 'House',
    bookingType: 'room',
    imageHint: 'santorini view hotel',
    lat: 36.3932,
    lng: 25.4615,
    lastModified: new Date('2024-07-14T19:00:00Z'),
    status: 'Published',
  },
  {
    id: 'new-york-penthouse',
    slug: 'new-york-penthouse',
    name: 'New York Penthouse',
    location: 'New York, USA',
    price: 2500,
    currency: 'USD',
    rating: 5,
    reviewsCount: 50,
    image: '',
    images: [],
    amenities: ['wifi', 'pool', 'gym', 'parking'],
    type: 'Apartment',
    bookingType: 'room',
    imageHint: 'penthouse apartment city view',
    lat: 40.73061,
    lng: -73.935242,
    lastModified: new Date('2024-07-13T21:00:00Z'),
    status: 'Published',
  },
  {
    id: 'berlin-warehouse-loft',
    slug: 'berlin-warehouse-loft',
    name: 'Berlin Warehouse Loft',
    location: 'Berlin, Germany',
    price: 300,
    currency: 'EUR',
    rating: 4.6,
    reviewsCount: 150,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen'],
    type: 'Loft',
    bookingType: 'room',
    imageHint: 'industrial loft interior',
    lat: 52.52,
    lng: 13.405,
    lastModified: new Date('2024-07-12T09:15:00Z'),
    status: 'Published',
  },
  {
    id: 'melbourne-laneway-apartment',
    slug: 'melbourne-laneway-apartment',
    name: 'Melbourne Laneway Apartment',
    location: 'Melbourne, Australia',
    price: 200,
    currency: 'AUD',
    rating: 4.7,
    reviewsCount: 200,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen'],
    type: 'Apartment',
    bookingType: 'room',
    imageHint: 'stylish small apartment',
    lat: -37.8136,
    lng: 144.9631,
    lastModified: new Date('2024-07-11T12:00:00Z'),
    status: 'Published',
  },
  {
    id: 'dubai-luxury-hotel-suite',
    slug: 'dubai-luxury-hotel-suite',
    name: 'Dubai Luxury Hotel Suite',
    location: 'Dubai, UAE',
    price: 1500,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 500,
    image: '',
    images: [],
    amenities: ['wifi', 'pool', 'gym', 'parking'],
    type: 'Hotel',
    bookingType: 'room',
    imageHint: 'luxury hotel room dubai',
    lat: 25.276987,
    lng: 55.296249,
    lastModified: new Date('2024-07-10T14:30:00Z'),
    status: 'Published',
  },
  {
    id: 'kyoto-ryokan-machiya',
    slug: 'kyoto-ryokan-machiya',
    name: 'Kyoto Ryokan Machiya',
    location: 'Kyoto, Japan',
    price: 400,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 250,
    image: '',
    images: [],
    amenities: ['wifi'],
    type: 'House',
    bookingType: 'room',
    imageHint: 'japanese traditional inn',
    lat: 35.0116,
    lng: 135.7681,
    lastModified: new Date('2024-07-09T11:00:00Z'),
    status: 'Published',
  },
  {
    id: 'vancouver-seaside-house',
    slug: 'vancouver-seaside-house',
    name: 'Vancouver Seaside House',
    location: 'Vancouver, Canada',
    price: 700,
    currency: 'AUD',
    rating: 4.8,
    reviewsCount: 120,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen', 'parking'],
    type: 'House',
    bookingType: 'room',
    imageHint: 'modern house ocean view',
    lat: 49.2827,
    lng: -123.1207,
    lastModified: new Date('2024-07-08T16:00:00Z'),
    status: 'Published',
  },
  {
    id: 'lisbon-historic-apartment',
    slug: 'lisbon-historic-apartment',
    name: 'Lisbon Historic Apartment',
    location: 'Lisbon, Portugal',
    price: 180,
    currency: 'EUR',
    rating: 4.7,
    reviewsCount: 300,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen'],
    type: 'Apartment',
    bookingType: 'room',
    imageHint: 'colorful apartment exterior',
    lat: 38.7223,
    lng: -9.1393,
    lastModified: new Date('2024-07-07T14:00:00Z'),
    status: 'Published',
  },
  {
    id: 'copenhagen-design-loft',
    slug: 'copenhagen-design-loft',
    name: 'Copenhagen Design Loft',
    location: 'Copenhagen, Denmark',
    price: 350,
    currency: 'EUR',
    rating: 4.8,
    reviewsCount: 180,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen'],
    type: 'Loft',
    bookingType: 'room',
    imageHint: 'scandinavian design interior',
    lat: 55.6761,
    lng: 12.5683,
    lastModified: new Date('2024-07-06T12:00:00Z'),
    status: 'Published',
  },
  {
    id: 'queenstown-adventure-lodge',
    slug: 'queenstown-adventure-lodge',
    name: 'Queenstown Adventure Lodge',
    location: 'Queenstown, New Zealand',
    price: 250,
    currency: 'AUD',
    rating: 4.7,
    reviewsCount: 400,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen', 'parking'],
    type: 'Hotel',
    bookingType: 'hybrid',
    imageHint: 'lodge with mountain view',
    lat: -45.0312,
    lng: 168.6626,
    lastModified: new Date('2024-07-05T10:00:00Z'),
    status: 'Published',
  },
  {
    id: 'rome-colosseum-view-apartment',
    slug: 'rome-colosseum-view-apartment',
    name: 'Rome Colosseum View Apartment',
    location: 'Rome, Italy',
    price: 450,
    currency: 'EUR',
    rating: 4.9,
    reviewsCount: 350,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen'],
    type: 'Apartment',
    bookingType: 'room',
    imageHint: 'apartment with colosseum view',
    lat: 41.8902,
    lng: 12.4922,
    lastModified: new Date('2024-07-04T09:00:00Z'),
    status: 'Published',
  },
  {
    id: 'cape-town-villa-table-mountain',
    slug: 'cape-town-villa-table-mountain',
    name: 'Cape Town Villa with Table Mountain View',
    location: 'Cape Town, South Africa',
    price: 600,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 200,
    image: '',
    images: [],
    amenities: ['wifi', 'pool', 'kitchen', 'parking'],
    type: 'Villa',
    bookingType: 'room',
    imageHint: 'villa with mountain view',
    lat: -33.9249,
    lng: 18.4241,
    lastModified: new Date('2024-07-03T11:30:00Z'),
    status: 'Published',
  },
  {
    id: 'prague-old-town-apartment',
    slug: 'prague-old-town-apartment',
    name: 'Prague Old Town Apartment',
    location: 'Prague, Czech Republic',
    price: 220,
    currency: 'EUR',
    rating: 4.8,
    reviewsCount: 450,
    image: '',
    images: [],
    amenities: ['wifi', 'kitchen'],
    type: 'Apartment',
    bookingType: 'room',
    imageHint: 'historic building apartment',
    lat: 50.0878,
    lng: 14.4205,
    lastModified: new Date('2024-07-02T15:00:00Z'),
    status: 'Published',
  },
];

/**
 * Deletes all documents in a collection.
 * @param db The Firestore database instance.
 * @param collectionName The name of the collection to clear.
 */
async function clearCollection(db: FirebaseFirestore.Firestore, collectionName: string) {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log(`Collection "${collectionName}" is already empty.`);
    return 0;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`🗑️  Cleared ${snapshot.size} documents from "${collectionName}".`);
  return snapshot.size;
}

/**
 * Seeds a specific collection in Firestore.
 * @param collectionName - The name of the collection to seed.
 * @param data - An array of objects to add to the collection.
 * @param destructive - If true, clears the collection before seeding.
 * @param idField - The field to use as the document ID. If not provided, Firestore auto-generates IDs.
 */
async function seedCollection(
  collectionName: string,
  data: Record<string, unknown>[],
  destructive: boolean = false,
  idField?: string
) {
  const db = getAdminDb();
  const collectionRef = db.collection(collectionName);

  if (destructive) {
    await clearCollection(db, collectionName);
  }

  const batch = db.batch();
  let count = 0;

  console.log(`\nSeeding collection: "${collectionName}"...`);

  for (const item of data) {
    let docRef;
    if (idField && item[idField]) {
      docRef = collectionRef.doc(item[idField] as string);
    } else if (item.id) {
      docRef = collectionRef.doc(item.id as string);
    } else if (idField === undefined) {
      // Create a new doc with auto-id if no idField is specified and item has no id
      docRef = collectionRef.doc();
    } else {
      console.warn('Skipping item without an ID:', item);
      continue;
    }
    batch.set(docRef, item, { merge: true });
    count++;
  }

  await batch.commit();
  console.log(`✅ Successfully seeded/updated ${count} documents in "${collectionName}".`);
}

/**
 * Main function to run all seeding operations.
 */
async function seedAll() {
  const db = getAdminDb();
  try {
    // Accommodations will be merged, not destroyed. This preserves manually uploaded images.
    await seedCollection('accommodations', accommodationsData, false, 'id');

    // These collections will be completely overwritten for consistency.
    await seedCollection('collections', curatedCollectionsData, true, 'id');
    await seedCollection('bedTypes', bedTypesData, true, 'systemId');
    await seedCollection('siteSettings', [heroImagesData], true, 'id');
    await seedCollection('propertyTypes', propertyTypesData, true);

    // Also clear the old collection
    await clearCollection(db, 'curated_collections');
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

console.log('--- Starting Firestore Seed Script ---');
seedAll().then(() => {
  console.log('\n--- Firestore Seeding Complete ---');
  process.exit(0);
});
