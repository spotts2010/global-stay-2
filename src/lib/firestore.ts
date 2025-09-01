import { db } from '@/lib/firebase'; // Use server-safe firebase config
import { collection, getDocs, doc, getDoc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Accommodation } from './data';
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
    return snapshot.exists()
      ? ({ id: snapshot.id, ...snapshot.data() } as Accommodation)
      : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching accommodation by ID (${id}):`, error.message);
    } else {
      console.error(`Error fetching accommodation by ID (${id}):`, error);
    }
    return null; // Return null on error
  }
}

/**
 * Fetch bookings for a given user ID
 */
export interface Booking {
  id: string;
  userId?: string;
  [key: string]: unknown; // Allow other dynamic fields
}

export async function fetchBookings(userId: string): Promise<Booking[]> {
  if (isTestEnv) {
    return getMockBookings().filter(
      (b) => (b as Booking).userId === userId || !(b as Booking).userId
    ) as Booking[];
  }
  try {
    const snapshot = await getDocs(collection(db, 'bookings'));
    const bookings = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];

    return bookings.filter((b) => b.userId === userId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching bookings for user (${userId}):`, error.message);
    } else {
      console.error(`Error fetching bookings for user (${userId}):`, error);
    }
    return []; // Return empty array on error
  }
}
