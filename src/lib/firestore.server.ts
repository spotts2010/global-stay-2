// src/lib/firestore.server.ts
import 'server-only'; // Ensures this file is never included in a client bundle

import { getAdminDb } from './firebaseAdmin';
import type { Accommodation, BedType, Place, Collection, PropertyType, LegalPage } from './data';
import { serializeFirestoreData } from './serialize';
import placeholderImages from './placeholder-images.json';
import type { BookableUnit } from '@/components/UnitsPageClient';
import { logger } from './logger';

export type AmenityOrInclusion = {
  id: string;
  label: string;
  systemTag: string;
  category: string;
};

// Server-side function using Admin SDK (bypasses security rules)
export async function fetchAccommodations(options?: {
  publishedOnly?: boolean;
}): Promise<Accommodation[]> {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return [];

    const accommodationsSnapshot = await adminDb.collection('accommodations').get();
    if (accommodationsSnapshot.empty) {
      return [];
    }

    const accommodations = await Promise.all(
      accommodationsSnapshot.docs.map(async (doc) => {
        const accommodationData = doc.data();

        const unitsSnapshot = await doc.ref.collection('units').get();
        const allUnits = unitsSnapshot.docs.map((unitDoc) => unitDoc.data() as BookableUnit);
        const publishedUnits = allUnits.filter((u) => u.status === 'Published');

        let lowestPrice = Infinity;
        let hasPricedPublishedUnit = false;

        if (publishedUnits.length > 0) {
          const prices = publishedUnits
            .map((u) => u.price)
            .filter((p): p is number => typeof p === 'number' && p > 0);

          if (prices.length > 0) {
            lowestPrice = Math.min(...prices);
            hasPricedPublishedUnit = true;
          }
        }

        const finalStatus =
          accommodationData.status === 'Published' && !hasPricedPublishedUnit
            ? 'Draft'
            : accommodationData.status;

        const accommodation = {
          id: doc.id,
          ...accommodationData,
          price: isFinite(lowestPrice) ? lowestPrice : 0,
          status: finalStatus,
          unitsCount: unitsSnapshot.size,
        };

        return serializeFirestoreData(accommodation) as Accommodation;
      })
    );

    // If the publishedOnly flag is true, filter out non-published accommodations
    if (options?.publishedOnly) {
      return accommodations.filter((acc) => acc.status === 'Published');
    }

    // Otherwise, return all accommodations (for admin view)
    return accommodations;
  } catch (error) {
    logger.error('Error fetching accommodations with Admin SDK:', error);
    return []; // Return empty array on server-side errors
  }
}

export async function fetchHomepageAccommodations(options?: {
  limit?: number;
}): Promise<Accommodation[]> {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return [];

    const limit = options?.limit ?? 12;

    const snapshot = await adminDb
      .collection('accommodations')
      .where('status', '==', 'Published')
      .limit(limit)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map(
      (doc) => serializeFirestoreData({ id: doc.id, ...doc.data() }) as Accommodation
    );
  } catch (error) {
    logger.error('Error fetching homepage accommodations with Admin SDK:', error);
    return [];
  }
}

export async function fetchAccommodationById(id: string): Promise<Accommodation | null> {
  if (!id) return null;
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return null;

    const docRef = adminDb.collection('accommodations').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    const accommodationData = docSnap.data();
    if (!accommodationData) return null;

    const unitsSnapshot = await docRef.collection('units').get();
    const allUnits = unitsSnapshot.docs.map((unitDoc) => unitDoc.data() as BookableUnit);
    const publishedUnits = allUnits.filter((u) => u.status === 'Published');

    let lowestPrice = Infinity;
    let hasPricedPublishedUnit = false;
    if (publishedUnits.length > 0) {
      const prices = publishedUnits
        .map((u) => u.price)
        .filter((p): p is number => typeof p === 'number' && p > 0);
      if (prices.length > 0) {
        lowestPrice = Math.min(...prices);
        hasPricedPublishedUnit = true;
      }
    }

    const finalStatus =
      accommodationData.status === 'Published' && !hasPricedPublishedUnit
        ? 'Draft'
        : accommodationData.status;

    const accommodation = {
      id: docSnap.id,
      ...accommodationData,
      price: isFinite(lowestPrice) ? lowestPrice : 0,
      status: finalStatus,
      unitsCount: unitsSnapshot.size,
    };

    return serializeFirestoreData(accommodation) as Accommodation;
  } catch (error) {
    logger.error(`Error fetching accommodation by id ${id} with Admin SDK:`, error);
    return null;
  }
}

export async function fetchUnitsForAccommodation(accommodationId: string): Promise<BookableUnit[]> {
  if (!accommodationId) return [];
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return [];

    const unitsSnapshot = await adminDb.collection(`accommodations/${accommodationId}/units`).get();
    if (unitsSnapshot.empty) {
      return [];
    }
    return unitsSnapshot.docs.map(
      (doc) => serializeFirestoreData({ id: doc.id, ...doc.data() }) as BookableUnit
    );
  } catch (error) {
    logger.error(`Error fetching units for accommodation ${accommodationId}:`, error);
    return [];
  }
}

export async function fetchUnitById(
  accommodationId: string,
  unitId: string
): Promise<BookableUnit | null> {
  if (!accommodationId || !unitId) return null;
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return null;

    const unitRef = adminDb
      .collection('accommodations')
      .doc(accommodationId)
      .collection('units')
      .doc(unitId);
    const unitSnap = await unitRef.get();

    if (!unitSnap.exists) {
      return null;
    }

    return serializeFirestoreData({ id: unitSnap.id, ...unitSnap.data() }) as BookableUnit;
  } catch (error) {
    logger.error(`Error fetching unit ${unitId} for accommodation ${accommodationId}:`, error);
    return null;
  }
}

export async function fetchPointsOfInterest(accommodationId: string): Promise<Place[]> {
  if (!accommodationId) return [];
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return [];

    const accommodation = await fetchAccommodationById(accommodationId);
    if (!accommodation) return [];

    const poiSnapshot = await adminDb
      .collection(`accommodations/${accommodationId}/pointsOfInterest`)
      .get();

    if (poiSnapshot.empty) {
      return [];
    }

    return poiSnapshot.docs.map(
      (doc) => serializeFirestoreData({ id: doc.id, ...doc.data() }) as Place
    );
  } catch (error) {
    logger.error(`Error fetching POIs for accommodation ${accommodationId} with Admin SDK:`, error);
    return [];
  }
}

// Server-side function using Admin SDK
export async function fetchBedTypes(): Promise<BedType[]> {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return [];

    const bedTypesSnapshot = await adminDb.collection('bedTypes').get();
    if (bedTypesSnapshot.empty) {
      return [];
    }
    const bedTypes = bedTypesSnapshot.docs.map((doc) => {
      return serializeFirestoreData({ id: doc.id, ...doc.data() }) as BedType;
    });
    return bedTypes;
  } catch (error) {
    logger.error('Error fetching bed types with Admin SDK:', error);
    return [];
  }
}

// Server-side function to get site settings
export async function fetchSiteSettings() {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return null;

    const docRef = adminDb.collection('siteSettings').doc('homePage');
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return serializeFirestoreData(docSnap.data());
    }
    return null;
  } catch (error) {
    logger.error('Error fetching site settings with Admin SDK:', error);
    return null;
  }
}

// Server-side functions to fetch amenities and inclusions
async function fetchMasterList(collectionName: string): Promise<AmenityOrInclusion[]> {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return [];

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
    logger.error(`Error fetching ${collectionName} with Admin SDK:`, error);
    return [];
  }
}

export async function fetchSharedAmenities(): Promise<AmenityOrInclusion[]> {
  return fetchMasterList('sharedAmenities');
}

export async function fetchPrivateInclusions(): Promise<AmenityOrInclusion[]> {
  return fetchMasterList('privateInclusions');
}

export async function fetchAccessibilityFeatures(): Promise<AmenityOrInclusion[]> {
  return fetchMasterList('accessibilityFeatures');
}

export async function fetchCollections(): Promise<Collection[]> {
  return placeholderImages.collections;
}

export async function fetchPropertyTypes(): Promise<PropertyType[]> {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return [];

    const propertyTypesSnapshot = await adminDb.collection('propertyTypes').get();
    if (propertyTypesSnapshot.empty) {
      return [];
    }
    return propertyTypesSnapshot.docs.map(
      (doc) => serializeFirestoreData({ id: doc.id, ...doc.data() }) as PropertyType
    );
  } catch (error) {
    logger.error('Error fetching property types with Admin SDK:', error);
    return [];
  }
}

export async function fetchLegalPage(
  id: 'terms-and-conditions' | 'privacy-policy'
): Promise<LegalPage | null> {
  if (!id) return null;
  try {
    const adminDb = getAdminDb();
    if (!adminDb) return null;

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
    logger.error(`Error fetching legal page ${id}:`, error);
    return null;
  }
}
