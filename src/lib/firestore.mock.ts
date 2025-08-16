/**
 * Firestore Mock Helper
 * Used in test/CI environments to return fake data from localStorage
 * instead of making real calls to Firebase.
 */

type Accommodation = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
};

type Booking = {
  id: string;
  accommodationId: string;
  dates: string[];
  guests: number;
  totalPrice: number;
};

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
