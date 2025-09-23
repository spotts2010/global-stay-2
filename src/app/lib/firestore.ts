'use client';

import {
  collection,
  getDocs as getDocsClient,
  doc,
  getDoc as getDocClient,
} from 'firebase/firestore';
import { db } from './firebase-config'; // CLIENT SDK for client-side actions
import type { Accommodation, EnrichedBooking, Booking, Place } from './data';
import { isBefore } from 'date-fns';

// This file should now ONLY contain client-side or shared Firestore logic.

// Client-side function remains for components that need it
export async function fetchAccommodationById(id: string): Promise<Accommodation | null> {
  if (!id) return null;
  try {
    const docRef = doc(db, 'accommodations', id); // Uses client 'db'
    const docSnap = await getDocClient(docRef);
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
    const poiSnapshot = await getDocsClient(
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

// Client-side function to get site settings
export async function fetchSiteSettings() {
  try {
    const docRef = doc(db, 'siteSettings', 'homePage');
    const docSnap = await getDocClient(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}
