// src/lib/firestore.server.ts
import 'server-only'; // Ensures this file is never included in a client bundle

import { getAdminDb } from './firebaseAdmin';
import type { Accommodation, BedType, Place, Collection, PropertyType, LegalPage } from './data';
import { serializeFirestoreData } from './serialize';
import placeholderImages from './placeholder-images.json';

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
    // Serialize data to ensure it's client-safe
    return accommodationsSnapshot.docs.map(
      (doc) => serializeFirestoreData({ id: doc.id, ...doc.data() }) as Accommodation
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
    // Serialize data to ensure it's client-safe
    return serializeFirestoreData({ id: docSnap.id, ...docSnap.data() }) as Accommodation;
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
    return poiSnapshot.docs.map((doc) => serializeFirestoreData({ id: doc.id, ...doc.data() }));
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
      return serializeFirestoreData({ id: doc.id, ...doc.data() }) as BedType;
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
      return serializeFirestoreData(docSnap.data());
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
    return snapshot.docs.map(
      (doc) =>
        serializeFirestoreData({
          id: doc.id,
          systemTag: doc.id,
          ...doc.data(),
        }) as AmenityOrInclusion
    );
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
  return placeholderImages.collections;
}

export async function fetchPropertyTypes(): Promise<PropertyType[]> {
  try {
    const adminDb = getAdminDb();
    const propertyTypesSnapshot = await adminDb.collection('propertyTypes').get();
    if (propertyTypesSnapshot.empty) {
      return [];
    }
    return propertyTypesSnapshot.docs.map(
      (doc) => serializeFirestoreData({ id: doc.id, ...doc.data() }) as PropertyType
    );
  } catch (error) {
    console.error('Error fetching property types with Admin SDK:', error);
    return [];
  }
}

export async function fetchLegalPage(
  id: 'terms-and-conditions' | 'privacy-policy'
): Promise<LegalPage | null> {
  if (!id) return null;
  try {
    const adminDb = getAdminDb();
    const docRef = adminDb.collection('legal_pages').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      // Create a default if it doesn't exist
      const defaultContent: LegalPage = {
        id,
        content: `<p>This is the default ${id.replace(/-/g, ' ')}. Please edit this content.</p>`,
        version: 1,
        lastModified: new Date(),
        versionNote: 'Initial document creation.',
      };
      await docRef.set(defaultContent);
      return serializeFirestoreData(defaultContent) as LegalPage;
    }

    return serializeFirestoreData({ id: docSnap.id, ...docSnap.data() }) as LegalPage;
  } catch (error) {
    console.error(`Error fetching legal page ${id}:`, error);
    return null;
  }
}
