import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getMockAccommodations, getMockBookings } from './firestore.mock';

// Detect if we're in a test environment (Jest or Playwright)
const isTestEnv = process.env.NODE_ENV === 'test';

/**
 * Fetch all accommodations
 */
export async function fetchAccommodations() {
  if (isTestEnv) {
    return getMockAccommodations();
  }
  const snapshot = await getDocs(collection(db, 'accommodations'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Fetch a single accommodation by ID
 */
export async function fetchAccommodationById(id: string) {
  if (isTestEnv) {
    return getMockAccommodations().find(acc => acc.id === id) || null;
  }
  const ref = doc(db, 'accommodations', id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

/**
 * Fetch bookings for a given user ID
 */
export async function fetchBookings(userId: string) {
  if (isTestEnv) {
    return getMockBookings().filter(b => (b as any).userId === userId || !(b as any).userId);
  }
  const snapshot = await getDocs(collection(db, 'bookings'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
