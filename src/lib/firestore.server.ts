// src/lib/firestore.server.ts
import 'server-only'; // Ensures this file is never included in a client bundle

import { getAdminDb } from './firebaseAdmin';
import type { Accommodation, BedType, Place } from './data';

// Server-side function using Admin SDK (bypasses security rules)
export async function fetchAccommodations(): Promise<Accommodation[]> {
  try {
    const adminDb = getAdminDb();
    const accommodationsSnapshot = await adminDb.collection('accommodations').get();
    if (accommodationsSnapshot.empty) {
      return [];
    }
    return accommodationsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Accommodation
    );
  } catch (error) {
    console.error('Error fetching accommodations with Admin SDK:', error);
    return []; // Return empty array on server-side errors
  }
}

export async function fetchAccommodationById(id: string): Promise<Accommodation | null> {
  if (!id) return null;
  try {
    const adminDb = getAdminDb();
    const docRef = adminDb.collection('accommodations').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return null;
    }
    return { id: docSnap.id, ...docSnap.data() } as Accommodation;
  } catch (error) {
    console.error(`Error fetching accommodation by id ${id} with Admin SDK:`, error);
    return null;
  }
}

export async function fetchPointsOfInterest(accommodationId: string): Promise<Place[]> {
  if (!accommodationId) return [];
  try {
    const adminDb = getAdminDb();
    const poiSnapshot = await adminDb
      .collection(`accommodations/${accommodationId}/pointsOfInterest`)
      .get();
    if (poiSnapshot.empty) {
      return [];
    }
    return poiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Place);
  } catch (error) {
    console.error(`Error fetching POIs for accommodation ${accommodationId} with Admin SDK:`, error);
    return [];
  }
}

// Server-side function using Admin SDK
export async function fetchBedTypes(): Promise<BedType[]> {
  try {
    const adminDb = getAdminDb();
    const bedTypesSnapshot = await adminDb.collection('bedTypes').get();
    if (bedTypesSnapshot.empty) {
      return [];
    }
    return bedTypesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as BedType);
  } catch (error) {
    console.error('Error fetching bed types with Admin SDK:', error);
    return [];
  }
}

// Server-side function to get site settings
export async function fetchSiteSettings() {
  try {
    const adminDb = getAdminDb();
    const docRef = adminDb.collection('siteSettings').doc('homePage');
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching site settings with Admin SDK:', error);
    return null;
  }
}
