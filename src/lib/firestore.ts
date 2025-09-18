import { db } from './firebase'; // Use CLIENT-side SDK for component data fetching
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Accommodation, Booking, EnrichedBooking } from './data';
import type { Place } from '@/components/PointsOfInterest';
import { isBefore } from 'date-fns';

// This file now uses the CLIENT-SIDE SDK for data fetching in components.
// The Admin SDK should only be used in Server Actions.

export async function fetchAccommodations(): Promise<Accommodation[]> {
  try {
    const accommodationsSnapshot = await getDocs(collection(db, 'accommodations'));
    if (accommodationsSnapshot.empty) {
      return [];
    }
    return accommodationsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Accommodation
    );
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    // In case of permissions errors on the client, return empty array.
    // A better solution would be to handle this gracefully in the UI.
    return [];
  }
}

export async function fetchAccommodationById(id: string): Promise<Accommodation | null> {
  if (!id) return null;
  try {
    const docRef = doc(db, 'accommodations', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return { id: docSnap.id, ...docSnap.data() } as Accommodation;
  } catch (error) {
    console.error(`Error fetching accommodation by id ${id}:`, error);
    return null;
  }
}

export async function fetchPointsOfInterest(accommodationId: string): Promise<Place[]> {
  if (!accommodationId) return [];
  try {
    const poiSnapshot = await getDocs(
      collection(db, `accommodations/${accommodationId}/pointsOfInterest`)
    );
    if (poiSnapshot.empty) {
      return [];
    }
    return poiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Place);
  } catch (error) {
    console.error(`Error fetching POIs for accommodation ${accommodationId}:`, error);
    return [];
  }
}

// NOTE: These booking functions are placeholders.
// In a real app, you would have more complex logic, user authentication,
// and likely store bookings in a user-specific subcollection.
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking1',
    accommodationId: 'oceanfront-pearl-malibu',
    userId: 'user1',
    startDate: new Date('2025-10-15T00:00:00Z'),
    endDate: new Date('2025-10-20T00:00:00Z'),
    guests: 2,
    totalPrice: 4250,
  },
  {
    id: 'booking2',
    accommodationId: 'grand-budapest-hotel',
    userId: 'user1',
    startDate: new Date('2026-01-10T00:00:00Z'),
    endDate: new Date('2026-01-17T00:00:00Z'),
    guests: 1,
    totalPrice: 4340,
  },
  {
    id: 'past-booking-1',
    accommodationId: 'secluded-mountain-cabin-aspen',
    userId: 'user1',
    startDate: new Date('2024-05-10T00:00:00Z'),
    endDate: new Date('2024-05-15T00:00:00Z'),
    guests: 2,
    totalPrice: 1900,
  },
];

export async function fetchBookings(userId: string): Promise<EnrichedBooking[]> {
  const userBookings = MOCK_BOOKINGS.filter(
    (b) => b.userId === userId && b.endDate && new Date() < b.endDate
  );

  const enrichedBookings: EnrichedBooking[] = await Promise.all(
    userBookings.map(async (booking) => {
      const accommodation = await fetchAccommodationById(booking.accommodationId || '');
      return {
        ...booking,
        accommodation: accommodation || undefined,
      };
    })
  );
  return enrichedBookings;
}

export async function fetchPastBookings(userId: string): Promise<EnrichedBooking[]> {
  const userBookings = MOCK_BOOKINGS.filter(
    (b) => b.userId === userId && b.endDate && isBefore(new Date(b.endDate), new Date())
  );

  const enrichedBookings: EnrichedBooking[] = await Promise.all(
    userBookings.map(async (booking) => {
      const accommodation = await fetchAccommodationById(booking.accommodationId || '');
      return {
        ...booking,
        accommodation: accommodation || undefined,
      };
    })
  );
  return enrichedBookings;
}
