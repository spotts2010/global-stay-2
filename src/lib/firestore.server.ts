// src/lib/firestore.server.ts
import 'server-only'; // Ensures this file is never included in a client bundle

import { getAdminDb } from './firebaseAdmin';
import type { Accommodation, BedType, Place, Collection, PropertyType } from './data';

type AmenityOrInclusion = {
  id: string;
  label: string;
  systemTag: string;
  category: string;
};

// Server-side function using Admin SDK (bypasses security rules)
export async function fetchAccommodations(): Promise<Accommodation[]> {
  try {
    const adminDb = getAdminDb();
    const accommodationsSnapshot = await adminDb
      .collection('accommodations')
      .where('status', '==', 'Published')
      .get();
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
    console.error(
      `Error fetching POIs for accommodation ${accommodationId} with Admin SDK:`,
      error
    );
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
    const bedTypes = bedTypesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        systemId: data.systemId,
        sleeps: data.sleeps || null, // Default to null if not set
      } as BedType;
    });
    return bedTypes;
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

// Server-side functions to fetch amenities and inclusions
async function fetchMasterList(collectionName: string): Promise<AmenityOrInclusion[]> {
  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection(collectionName).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      systemTag: doc.id,
      ...doc.data(),
    })) as AmenityOrInclusion[];
  } catch (error) {
    console.error(`Error fetching ${collectionName} with Admin SDK:`, error);
    return [];
  }
}

export async function fetchSharedAmenities(): Promise<AmenityOrInclusion[]> {
  return fetchMasterList('sharedAmenities');
}

export async function fetchPrivateInclusions(): Promise<AmenityOrInclusion[]> {
  return fetchMasterList('privateInclusions');
}

export async function fetchCollections(): Promise<Collection[]> {
  try {
    const adminDb = getAdminDb();
    const collectionsSnapshot = await adminDb.collection('collections').get();
    if (collectionsSnapshot.empty) {
      return [];
    }
    return collectionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Collection);
  } catch (error) {
    console.error('Error fetching collections with Admin SDK:', error);
    return [];
  }
}

export async function fetchPropertyTypes(): Promise<PropertyType[]> {
  try {
    const adminDb = getAdminDb();
    const propertyTypesSnapshot = await adminDb.collection('propertyTypes').get();
    if (propertyTypesSnapshot.empty) {
      return [];
    }
    return propertyTypesSnapshot.docs.map(
      (doc) => ({ id: doc.id, name: doc.data().name }) as PropertyType
    );
  } catch (error) {
    console.error('Error fetching property types with Admin SDK:', error);
    return [];
  }
}
