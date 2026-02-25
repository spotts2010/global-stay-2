// src/lib/firestore.ts

'use client';

import {
  collection,
  getDocs as getDocsClient,
  doc,
  getDoc as getDocClient,
  type FirestoreError,
} from 'firebase/firestore';
import { db } from './firebase-db';
import type { Accommodation, EnrichedBooking, Booking, Place, BookableUnit } from './data';
import { isBefore } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { logger } from './logger';

// This file should ONLY contain client-side Firestore logic.

export async function fetchAccommodations(options?: {
  publishedOnly?: boolean;
}): Promise<Accommodation[]> {
  const accommodationsRef = collection(db, 'accommodations');
  return getDocsClient(accommodationsRef)
    .then((accommodationsSnapshot) => {
      if (accommodationsSnapshot.empty) return [];

      let accommodations = accommodationsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Accommodation
      );

      if (options?.publishedOnly) {
        accommodations = accommodations.filter((acc) => acc.status === 'Published');
      }

      return accommodations;
    })
    .catch((error: FirestoreError) => {
      logger.error('Error fetching accommodations:', error);
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({ path: accommodationsRef.path, operation: 'list' })
      );
      return [];
    });
}

export async function fetchAccommodationById(id: string): Promise<Accommodation | null> {
  if (!id) return null;

  const docRef = doc(db, 'accommodations', id);
  return getDocClient(docRef)
    .then((docSnap) => {
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as Accommodation;
    })
    .catch((error: FirestoreError) => {
      logger.error(`Error fetching accommodation by id ${id}:`, error);
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({ path: docRef.path, operation: 'get' })
      );
      return null;
    });
}

export async function fetchUnitsForAccommodation(accommodationId: string): Promise<BookableUnit[]> {
  if (!accommodationId) return [];

  const unitsRef = collection(db, `accommodations/${accommodationId}/units`);
  return getDocsClient(unitsRef)
    .then((unitsSnapshot) => {
      if (unitsSnapshot.empty) return [];
      return unitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as BookableUnit);
    })
    .catch((error: FirestoreError) => {
      logger.error(`Error fetching units for accommodation ${accommodationId}:`, error);
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({ path: unitsRef.path, operation: 'list' })
      );
      return [];
    });
}

export async function fetchPointsOfInterest(accommodationId: string): Promise<Place[]> {
  if (!accommodationId) return [];

  const poiRef = collection(db, `accommodations/${accommodationId}/pointsOfInterest`);
  return getDocsClient(poiRef)
    .then((poiSnapshot) => {
      if (poiSnapshot.empty) return [];
      return poiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Place);
    })
    .catch((error: FirestoreError) => {
      logger.error(`Error fetching POIs for accommodation ${accommodationId}:`, error);
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({ path: poiRef.path, operation: 'list' })
      );
      return [];
    });
}

// NOTE: placeholder mock data for client-only/demo flows
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
      return { ...booking, accommodation: accommodation || undefined };
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
      return { ...booking, accommodation: accommodation || undefined };
    })
  );

  return enrichedBookings;
}

export async function fetchSiteSettings() {
  const docRef = doc(db, 'siteSettings', 'homePage');
  return getDocClient(docRef)
    .then((docSnap) => (docSnap.exists() ? docSnap.data() : null))
    .catch((error: FirestoreError) => {
      logger.error('Error fetching site settings:', error);
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({ path: docRef.path, operation: 'get' })
      );
      return null;
    });
}
