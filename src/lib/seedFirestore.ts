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

// --- Accessibility Features Data ---
const accessibilityFeaturesData = [
  {
    systemTag: 'step_free_access',
    label: 'Step-free access to unit',
    category: 'Getting Around',
    isShared: true,
    isPrivate: true,
  },
  {
    systemTag: 'wide_doorways',
    label: 'Wide doorways (over 32 inches)',
    category: 'Getting Around',
    isShared: true,
    isPrivate: true,
  },
  {
    systemTag: 'elevator_access',
    label: 'Elevator access',
    category: 'Getting Around',
    isShared: true,
    isPrivate: false,
  },
  {
    systemTag: 'flat_paths',
    label: 'Flat, well-lit path to entrance',
    category: 'Getting Around',
    isShared: true,
    isPrivate: false,
  },
  {
    systemTag: 'accessible_parking',
    label: 'Accessible parking spot',
    category: 'Parking',
    isShared: true,
    isPrivate: false,
  },
  {
    systemTag: 'roll_in_shower',
    label: 'Roll-in shower',
    category: 'Bathroom',
    isShared: false,
    isPrivate: true,
  },
  {
    systemTag: 'grab_rails_shower',
    label: 'Grab rails in shower',
    category: 'Bathroom',
    isShared: false,
    isPrivate: true,
  },
  {
    systemTag: 'grab_rails_toilet',
    label: 'Grab rails by toilet',
    category: 'Bathroom',
    isShared: false,
    isPrivate: true,
  },
  {
    systemTag: 'shower_chair',
    label: 'Shower chair available',
    category: 'Bathroom',
    isShared: false,
    isPrivate: true,
  },
  {
    systemTag: 'adjustable_bed',
    label: 'Adjustable height bed',
    category: 'In-Unit Comforts',
    isShared: false,
    isPrivate: true,
  },
  {
    systemTag: 'visual_alarms',
    label: 'Visual (strobe) fire/smoke alarms',
    category: 'In-Unit Comforts',
    isShared: false,
    isPrivate: true,
  },
  {
    systemTag: 'lowered_counters',
    label: 'Lowered kitchen counters',
    category: 'In-Unit Comforts',
    isShared: false,
    isPrivate: true,
  },
];

// --- Mock Accommodations Data ---
const accommodationsData: {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  country: string;
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
  location: string;
}[] = [
  {
    id: 'oceanfront-pearl-malibu',
    slug: 'oceanfront-pearl-malibu',
    name: 'The Oceanfront Pearl',
    city: 'Malibu',
    state: 'California',
    country: 'USA',
    location: 'Malibu, California, USA',
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
    city: 'New York',
    state: 'New York',
    country: 'USA',
    location: 'New York, New York, USA',
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
    city: 'Zubrowka',
    state: 'Republic of',
    country: 'Zubrowka',
    location: 'Zubrowka, Republic of',
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
    city: 'Aspen',
    state: 'Colorado',
    country: 'USA',
    location: 'Aspen, Colorado, USA',
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
    city: 'Sydney',
    state: 'New South Wales',
    country: 'Australia',
    location: 'Sydney, New South Wales, Australia',
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
    city: 'Ubud',
    state: 'Bali',
    country: 'Indonesia',
    location: 'Ubud, Bali, Indonesia',
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
    city: 'London',
    state: 'England',
    country: 'United Kingdom',
    location: 'London, United Kingdom',
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
    city: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    location: 'Paris, France',
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
    city: 'Noosa',
    state: 'Queensland',
    country: 'Australia',
    location: 'Noosa, Queensland, Australia',
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
    city: 'Tokyo',
    state: 'Tokyo',
    country: 'Japan',
    location: 'Tokyo, Japan',
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
    city: 'Nadi',
    state: 'Western Division',
    country: 'Fiji',
    location: 'Fiji',
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
    city: 'Como',
    state: 'Lombardy',
    country: 'Italy',
    location: 'Lake Como, Italy',
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
    city: 'Oia',
    state: 'Santorini',
    country: 'Greece',
    location: 'Santorini, Greece',
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
    city: 'New York',
    state: 'New York',
    country: 'USA',
    location: 'New York, USA',
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
    city: 'Berlin',
    state: 'Berlin',
    country: 'Germany',
    location: 'Berlin, Germany',
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
    city: 'Melbourne',
    state: 'Victoria',
    country: 'Australia',
    location: 'Melbourne, Victoria, Australia',
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
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
    location: 'Dubai, UAE',
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
    city: 'Kyoto',
    state: 'Kyoto',
    country: 'Japan',
    location: 'Kyoto, Japan',
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
    city: 'Vancouver',
    state: 'British Columbia',
    country: 'Canada',
    location: 'Vancouver, Canada',
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
    city: 'Lisbon',
    state: 'Lisbon',
    country: 'Portugal',
    location: 'Lisbon, Portugal',
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
    city: 'Copenhagen',
    state: 'Capital Region',
    country: 'Denmark',
    location: 'Copenhagen, Denmark',
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
    city: 'Queenstown',
    state: 'Otago',
    country: 'New Zealand',
    location: 'Queenstown, New Zealand',
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
    city: 'Rome',
    state: 'Lazio',
    country: 'Italy',
    location: 'Rome, Italy',
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
    city: 'Cape Town',
    state: 'Western Cape',
    country: 'South Africa',
    location: 'Cape Town, South Africa',
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
    city: 'Prague',
    state: 'Prague',
    country: 'Czech Republic',
    location: 'Prague, Czech Republic',
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
    await seedCollection('accessibilityFeatures', accessibilityFeaturesData, true, 'systemTag');

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
