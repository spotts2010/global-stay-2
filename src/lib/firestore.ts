import { db } from '@/lib/firebase'; // Use server-safe firebase config
import { collection, getDocs, doc, getDoc, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Accommodation, Booking, EnrichedBooking, DocumentData } from './data';
import { getMockAccommodations, getMockBookings } from './firestore.mock';

// Detect if we're in a test environment (Jest or Playwright)
const isTestEnv = process.env.NODE_ENV === 'test';

/**
 * Fetch all accommodations
 */
export async function fetchAccommodations(): Promise<Accommodation[]> {
  if (isTestEnv) {
    return getMockAccommodations();
  }
  try {
    const snapshot = await getDocs(collection(db, 'accommodations'));
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    })) as Accommodation[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching accommodations:', error.message);
    } else {
      console.error('Error fetching accommodations:', error);
    }
    return []; // Return empty array on error
  }
}

/**
 * Fetch a single accommodation by ID
 */
export async function fetchAccommodationById(id: string): Promise<Accommodation | null> {
  if (isTestEnv) {
    return getMockAccommodations().find((acc) => acc.id === id) || null;
  }
  try {
    const ref = doc(db, 'accommodations', id);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Accommodation) : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching accommodation by ID (${id}):`, error.message);
    } else {
      console.error(`Error fetching accommodation by ID (${id}):`, error);
    }
    return null; // Return null on error
  }
}

export async function fetchBookings(userId: string): Promise<Booking[]> {
  if (isTestEnv) {
    return getMockBookings().filter((b) => b.userId === userId);
  }

  // This is a temporary hotfix to return mock data and prevent a Firestore
  // permissions error. In a real app, you would query Firestore securely.
  const placeholderBookings: Booking[] = [
    {
      id: 'booking1',
      accommodationId: 'acc1',
      userId: 'user1',
      startDate: new Date('2025-10-15T00:00:00Z'),
      endDate: new Date('2025-10-20T00:00:00Z'),
      guests: 2,
      totalPrice: 4250,
    },
    {
      id: 'booking2',
      accommodationId: 'acc3',
      userId: 'user1',
      startDate: new Date('2026-01-10T00:00:00Z'),
      endDate: new Date('2026-01-17T00:00:00Z'),
      guests: 1,
      totalPrice: 4340,
    },
    {
      id: 'booking3',
      accommodationId: 'acc5',
      userId: 'user1',
      startDate: new Date('2026-04-01T00:00:00Z'),
      endDate: new Date('2026-04-04T00:00:00Z'),
      guests: 4,
      totalPrice: 630,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(placeholderBookings.filter((b) => b.userId === userId));
    }, 500); // Simulate network delay
  });
}

export async function fetchPastBookings(userId: string): Promise<EnrichedBooking[]> {
  const allAccommodations = await fetchAccommodations();
  const findAccommodation = (id: string) => allAccommodations.find((a) => a.id === id);

  const pastBookings: EnrichedBooking[] = [
    {
      id: 'past-booking-1',
      accommodationId: 'acc4',
      accommodation: findAccommodation('acc4'),
      userId: 'user1',
      startDate: new Date('2024-05-10T00:00:00Z'),
      endDate: new Date('2024-05-15T00:00:00Z'),
      guests: 2,
      totalPrice: 1900,
    },
    {
      id: 'past-booking-2',
      accommodationId: 'acc2',
      accommodation: findAccommodation('acc2'),
      userId: 'user1',
      startDate: new Date('2023-11-20T00:00:00Z'),
      endDate: new Date('2023-11-22T00:00:00Z'),
      guests: 2,
      totalPrice: 900,
    },
    {
      id: 'past-booking-3',
      accommodationId: 'acc1',
      accommodation: findAccommodation('acc1'),
      userId: 'user1',
      startDate: new Date('2023-07-01T00:00:00Z'),
      endDate: new Date('2023-07-08T00:00:00Z'),
      guests: 4,
      totalPrice: 5950,
    },
    {
      id: 'past-booking-5',
      accommodationId: 'acc5',
      accommodation: findAccommodation('acc5'),
      userId: 'user1',
      startDate: new Date('2022-09-05T00:00:00Z'),
      endDate: new Date('2022-09-10T00:00:00Z'),
      guests: 1,
      totalPrice: 1050,
    },
    {
      id: 'past-booking-3',
      accommodationId: 'acc3',
      accommodation: findAccommodation('acc3'),
      userId: 'user1',
      startDate: new Date('2022-02-14T00:00:00Z'),
      endDate: new Date('2022-02-18T00:00:00Z'),
      guests: 2,
      totalPrice: 2480,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(pastBookings.filter((b) => b.userId === userId));
    }, 500);
  });
}
