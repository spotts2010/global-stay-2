import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Accommodation, Booking } from './data';
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
  const snapshot = await getDocs(collection(db, 'accommodations'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Accommodation[];
}

/**
 * Fetch a single accommodation by ID
 */
export async function fetchAccommodationById(id: string): Promise<Accommodation | null> {
  if (isTestEnv) {
    return getMockAccommodations().find((acc) => acc.id === id) || null;
  }
  const ref = doc(db, 'accommodations', id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Accommodation) : null;
}

/**
 * Fetch bookings for a given user ID
 */
export async function fetchBookings(userId: string): Promise<Booking[]> {
  if (isTestEnv) {
    return getMockBookings().filter(
      (b) =>
        (b as Booking & { userId?: string }).userId === userId ||
        !(b as Booking & { userId?: string }).userId
    );
  }
  const snapshot = await getDocs(collection(db, 'bookings'));
  // In a real scenario, you'd query by userId
  const bookings = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return bookings.filter((b) => (b as Booking & { userId: string }).userId === userId) as Booking[];
}
