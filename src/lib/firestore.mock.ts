/**
 * Firestore Mock Helper
 * Used in test/CI environments to return fake data from localStorage
 * instead of making real calls to Firebase.
 */

import type { Accommodation, Booking } from './data';

/**
 * Fetch mock accommodations from localStorage
 */
export function getMockAccommodations(): Accommodation[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('mock:accommodations');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Fetch mock bookings from localStorage
 */
export function getMockBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('mock:bookings');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
