// src/app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import {
  getAccommodationRecommendations,
  type AccommodationRecommendationsInput,
  type AccommodationRecommendationsOutput,
} from '@/ai/flows/accommodation-recommendations';
import { getAdminDb } from '@/lib/firebaseAdmin';
import type { Place, Accommodation, HeroImage, Currency, Address } from './lib/data';
import type { BookableUnit } from '@/components/UnitsPageClient';
import { FieldValue, UpdateData } from 'firebase-admin/firestore';
import { logger } from '@/lib/logger';

interface ActionResult extends Partial<AccommodationRecommendationsOutput> {
  error?: string;
}

export async function handleGetRecommendations(
  input: AccommodationRecommendationsInput
): Promise<ActionResult> {
  try {
    const result = await getAccommodationRecommendations(input);
    return result;
  } catch (error) {
    logger.error('Error getting recommendations:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

// --- Accommodation Update Action ---
export async function updateAccommodationAction(
  id: string,
  accommodationData: Partial<Accommodation> & { address?: Address }
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Accommodation ID is missing.' };
  }
  const db = getAdminDb();
  const accommodationRef = db.collection('accommodations').doc(id);

  try {
    const dataToUpdate: UpdateData = { ...accommodationData };

    // Ensure image is set to the first of the images array, or empty string
    if (dataToUpdate.images) {
      dataToUpdate.image = dataToUpdate.images[0] || '';
    }

    // Handle nested address object
    if (dataToUpdate.address) {
      // The address object is now saved directly, no need to flatten.
      // But we will still flatten some top-level fields for backwards compatibility and easy querying.
      dataToUpdate.lat = dataToUpdate.address.lat;
      dataToUpdate.lng = dataToUpdate.address.lng;
      dataToUpdate.city = dataToUpdate.address.city;
      dataToUpdate.state = dataToUpdate.address.state?.long; // Use long name
      dataToUpdate.country = dataToUpdate.address.country?.long; // Use long name
      dataToUpdate.location = dataToUpdate.address.formatted;
    }

    await accommodationRef.update({ ...dataToUpdate, lastModified: new Date() });

    // Revalidate all relevant paths
    revalidatePath(`/admin/listings/${id}/edit/about`);
    revalidatePath(`/admin/listings/${id}/edit/photos`);
    revalidatePath(`/admin/listings`);
    revalidatePath(`/accommodation/${id}`);
    revalidatePath('/'); // Revalidate home page in case it's featured

    return { success: true };
  } catch (error) {
    logger.error('Error updating accommodation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update accommodation: ${errorMessage}` };
  }
}

export async function duplicateListingAction(
  listingId: string
): Promise<{ success: boolean; error?: string }> {
  if (!listingId) {
    return { success: false, error: 'Listing ID is missing.' };
  }
  const db = getAdminDb();

  try {
    const sourceListingRef = db.collection('accommodations').doc(listingId);
    const sourceListingSnap = await sourceListingRef.get();

    if (!sourceListingSnap.exists) {
      return { success: false, error: 'Source listing not found.' };
    }

    const sourceData = sourceListingSnap.data() as Accommodation;

    // Create a new document with a new ID
    const newListingRef = db.collection('accommodations').doc();

    const newListingData: Partial<Accommodation> = {
      ...sourceData,
      name: `${sourceData.name} (Copy)`,
      status: 'Draft',
      slug: `${sourceData.slug}-copy-${Date.now()}`,
      lastModified: new Date(),
    };

    // Remove fields that should not be copied
    delete newListingData.id;
    delete newListingData.units;
    delete newListingData.unitsCount;

    await newListingRef.set(newListingData);

    // Revalidate the listings page to show the new draft
    revalidatePath('/admin/listings');

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, error: `Failed to duplicate listing: ${errorMessage}` };
  }
}

export async function deleteListingAction(
  listingId: string
): Promise<{ success: boolean; error?: string }> {
  if (!listingId) {
    return { success: false, error: 'Listing ID is missing.' };
  }

  const db = getAdminDb();
  const listingRef = db.collection('accommodations').doc(listingId);

  try {
    const listingDoc = await listingRef.get();
    if (!listingDoc.exists) {
      return { success: false, error: 'Listing not found.' };
    }

    // The status check was removed to allow deletion of draft listings.
    // In a real app, you'd also check if it has any associated booking history.

    await listingRef.delete();

    // Revalidate paths to reflect the deletion
    revalidatePath('/admin/listings');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, error: `Failed to delete listing: ${errorMessage}` };
  }
}

// --- Policies Update Action ---
export async function updateAccommodationPoliciesAction(
  id: string,
  policiesData: Pick<Accommodation, 'paymentTerms' | 'cancellationPolicy' | 'houseRules'>
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Accommodation ID is missing.' };
  }
  const db = getAdminDb();
  const accommodationRef = db.collection('accommodations').doc(id);

  try {
    await accommodationRef.update({
      ...policiesData,
      lastModified: new Date(),
    });
    revalidatePath(`/admin/listings/${id}/edit/property-policies`);
    return { success: true };
  } catch (error) {
    logger.error(`Error updating policies for accommodation ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update policies: ${errorMessage}` };
  }
}

// --- Points of Interest Update Action ---
export async function updatePointsOfInterestAction(
  accommodationId: string,
  pointsOfInterestData: Place[]
): Promise<{ success: boolean; error?: string }> {
  if (!accommodationId) {
    return { success: false, error: 'Accommodation ID is missing.' };
  }
  const db = getAdminDb();
  const accommodationRef = db.collection('accommodations').doc(accommodationId);
  const poiCollectionRef = accommodationRef.collection('pointsOfInterest');

  try {
    const batch = db.batch();
    const existingPoisSnapshot = await poiCollectionRef.get();

    // Delete old POIs
    existingPoisSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    // Add new POIs
    pointsOfInterestData.forEach((place) => {
      // Create a plain object without any complex types (like geometry)
      const { id, name, address, category, source, visible, distance, lat, lng } = place;
      const newPoiData = { name, address, category, source, visible, distance, lat, lng };

      const newPoiDocRef = poiCollectionRef.doc(id);
      batch.set(newPoiDocRef, newPoiData);
    });

    await batch.commit();

    revalidatePath(`/admin/listings/${accommodationId}/edit/pois`);
    revalidatePath(`/accommodation/${accommodationId}`);

    return { success: true };
  } catch (error) {
    logger.error(`Error updating points of interest for accommodation ${accommodationId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update points of interest: ${errorMessage}` };
  }
}

export async function updateAccommodationStatusAction(
  id: string,
  status: 'Published' | 'Draft' | 'Archived'
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Accommodation ID is missing.' };
  }
  const db = getAdminDb();
  const accommodationRef = db.collection('accommodations').doc(id);

  try {
    await accommodationRef.update({ status: status, lastModified: new Date() });

    // Revalidate paths to update cached data
    revalidatePath('/admin/listings');
    revalidatePath(`/admin/listings/${id}`);
    revalidatePath(`/accommodation/${id}`);

    return { success: true };
  } catch (error) {
    logger.error(`Error updating status for accommodation ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update status: ${errorMessage}` };
  }
}

// --- Bed Type Actions ---

export async function addBedTypeAction(bedType: {
  name: string;
  systemId: string;
  sleeps: number | null;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const db = getAdminDb();
  try {
    // Check for duplicates by name or systemId
    const nameQuery = await db.collection('bedTypes').where('name', '==', bedType.name).get();
    if (!nameQuery.empty) {
      return { success: false, error: 'A bed type with this name already exists.' };
    }
    const systemIdQuery = await db
      .collection('bedTypes')
      .where('systemId', '==', bedType.systemId)
      .get();
    if (!systemIdQuery.empty) {
      return { success: false, error: 'A bed type with this system ID already exists.' };
    }

    const docRef = await db.collection('bedTypes').add(bedType);
    revalidatePath('/admin/bed-types');
    return { success: true, id: docRef.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to add bed type: ${errorMessage}` };
  }
}

export async function deleteBedTypeAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Bed type ID is missing.' };
  }
  const db = getAdminDb();
  try {
    await db.collection('bedTypes').doc(id).delete();
    revalidatePath('/admin/bed-types');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to delete bed type: ${errorMessage}` };
  }
}

// --- Site Settings Actions ---
export async function updateHeroImagesAction(
  images: HeroImage[]
): Promise<{ success: boolean; error?: string }> {
  const db = getAdminDb();
  try {
    const settingsRef = db.collection('siteSettings').doc('homePage');
    await settingsRef.set({ heroImages: images }, { merge: true });
    revalidatePath('/admin/settings/site');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update hero images: ${errorMessage}` };
  }
}

// --- Amenity, Inclusion & Accessibility Actions ---
type AmenityItem = {
  systemTag: string;
  label: string;
  category: string;
};

type AccessibilityItem = AmenityItem & {
  isShared: boolean;
  isPrivate: boolean;
};

async function updateMasterList(
  collectionName: 'sharedAmenities' | 'privateInclusions' | 'accessibilityFeatures',
  items: AmenityItem[] | AccessibilityItem[]
): Promise<{ success: boolean; error?: string }> {
  const db = getAdminDb();
  const collectionRef = db.collection(collectionName);

  try {
    const batch = db.batch();
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));

    items.forEach((item) => {
      if (!item.systemTag) {
        logger.warn('Skipping item with empty systemTag:', item);
        return;
      }
      const docRef = collectionRef.doc(item.systemTag);

      // Use a type assertion to satisfy TypeScript
      const dataToSet: { [key: string]: string | boolean } = {
        label: item.label,
        category: item.category,
      };

      // Specific handling for accessibility features
      if (collectionName === 'accessibilityFeatures' && 'isShared' in item && 'isPrivate' in item) {
        dataToSet.isShared = item.isShared ?? false;
        dataToSet.isPrivate = item.isPrivate ?? true;
      }

      batch.set(docRef, dataToSet);
    });

    await batch.commit();

    revalidatePath('/admin/amenities');
    revalidatePath('/admin/accessibility-features');
    return { success: true };
  } catch (error) {
    logger.error(`Error updating ${collectionName} with Admin SDK:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update ${collectionName}: ${errorMessage}` };
  }
}

export async function updateSharedAmenitiesAction(
  items: AmenityItem[]
): Promise<{ success: boolean; error?: string }> {
  return updateMasterList('sharedAmenities', items);
}

export async function updatePrivateInclusionsAction(
  items: AmenityItem[]
): Promise<{ success: boolean; error?: string }> {
  return updateMasterList('privateInclusions', items);
}

export async function updateAccessibilityFeaturesAction(
  items: AccessibilityItem[]
): Promise<{ success: boolean; error?: string }> {
  return updateMasterList('accessibilityFeatures', items);
}

// --- Listing-specific Amenity Actions ---
export async function updateListingSharedAmenitiesAction(
  listingId: string,
  amenityIds: string[],
  chargeableAmenityIds: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!listingId) {
    return { success: false, error: 'Listing ID is missing.' };
  }
  const db = getAdminDb();
  const listingRef = db.collection('accommodations').doc(listingId);

  try {
    await listingRef.update({
      amenities: amenityIds,
      chargeableAmenities: chargeableAmenityIds,
      lastModified: new Date(),
    });
    revalidatePath(`/admin/listings/${listingId}/edit/amenities`);
    revalidatePath(`/accommodation/${listingId}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error updating shared amenities for listing ${listingId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update amenities: ${errorMessage}` };
  }
}

// --- Listing-specific Accessibility Features Actions ---
export async function updateListingAccessibilityFeaturesAction(
  listingId: string,
  featureIds: string[],
  chargeableFeatureIds: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!listingId) {
    return { success: false, error: 'Listing ID is missing.' };
  }
  const db = getAdminDb();
  const listingRef = db.collection('accommodations').doc(listingId);

  try {
    await listingRef.update({
      accessibilityFeatures: featureIds,
      chargeableAccessibilityFeatures: chargeableFeatureIds,
      lastModified: new Date(),
    });
    revalidatePath(`/admin/listings/${listingId}/edit/accessibility-features`);
    revalidatePath(`/accommodation/${listingId}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error updating accessibility features for listing ${listingId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update features: ${errorMessage}` };
  }
}

// --- Unit-specific Inclusion Actions ---
export async function updateUnitInclusionsAction(
  listingId: string,
  unitId: string,
  inclusionIds: string[],
  chargeableInclusionIds: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!listingId || !unitId) {
    return { success: false, error: 'Listing ID or Unit ID is missing.' };
  }
  const db = getAdminDb();
  const unitRef = db.collection('accommodations').doc(listingId).collection('units').doc(unitId);

  try {
    await unitRef.update({
      inclusions: inclusionIds,
      chargeableInclusions: chargeableInclusionIds,
    });
    revalidatePath(`/admin/listings/${listingId}/edit/units/${unitId}/inclusions`);
    revalidatePath(`/accommodation/${listingId}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error updating inclusions for unit ${unitId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update inclusions: ${errorMessage}` };
  }
}

// --- Unit-specific Accessibility Feature Actions ---
export async function updateUnitAccessibilityFeaturesAction(
  listingId: string,
  unitId: string,
  featureIds: string[],
  chargeableFeatureIds: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!listingId || !unitId) {
    return { success: false, error: 'Listing or Unit ID is missing.' };
  }
  const db = getAdminDb();
  const unitRef = db.collection('accommodations').doc(listingId).collection('units').doc(unitId);
  try {
    await unitRef.update({
      accessibilityFeatures: featureIds,
      chargeableAccessibilityFeatures: chargeableFeatureIds,
    });
    revalidatePath(`/admin/listings/${listingId}/edit/units/${unitId}/accessibility-features`);
    revalidatePath(`/accommodation/${listingId}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error updating accessibility features for unit ${unitId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update unit features: ${errorMessage}` };
  }
}

// --- Property Type Actions ---

export async function addPropertyTypeAction(
  name: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const db = getAdminDb();
  try {
    const query = await db.collection('propertyTypes').where('name', '==', name).get();
    if (!query.empty) {
      return { success: false, error: 'A property type with this name already exists.' };
    }
    const docRef = await db.collection('propertyTypes').add({ name });
    revalidatePath('/admin/property-types');
    return { success: true, id: docRef.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to add property type: ${errorMessage}` };
  }
}

export async function updatePropertyTypeAction(
  id: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const db = getAdminDb();
  try {
    const query = await db.collection('propertyTypes').where('name', '==', name).limit(1).get();
    if (!query.empty && query.docs[0].id !== id) {
      return { success: false, error: 'Another property type with this name already exists.' };
    }
    await db.collection('propertyTypes').doc(id).update({ name });
    revalidatePath('/admin/property-types');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update property type: ${errorMessage}` };
  }
}

export async function deletePropertyTypeAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Property type ID is missing.' };
  }
  const db = getAdminDb();
  try {
    await db.collection('propertyTypes').doc(id).delete();
    revalidatePath('/admin/property-types');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to delete property type: ${errorMessage}` };
  }
}

// --- Unit Actions ---

export async function updateUnitsAction(
  listingId: string,
  units: BookableUnit[]
): Promise<{ success: boolean; error?: string }> {
  if (!listingId) {
    return { success: false, error: 'Listing ID is missing.' };
  }
  const db = getAdminDb();
  const unitsCollectionRef = db.collection('accommodations').doc(listingId).collection('units');

  try {
    const batch = db.batch();
    const existingUnitsSnapshot = await unitsCollectionRef.get();

    // Delete all existing units
    existingUnitsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Add the new set of units
    units.forEach((unit) => {
      const { id, ...unitData } = unit;
      const unitRef = unitsCollectionRef.doc(id);
      batch.set(unitRef, unitData);
    });

    await batch.commit();
    revalidatePath(`/admin/listings/${listingId}/edit/units`);
    return { success: true };
  } catch (error) {
    logger.error('Error updating units:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update units: ${errorMessage}` };
  }
}

export async function duplicateUnitAction(
  listingId: string,
  sourceUnitId: string
): Promise<{ success: boolean; error?: string; newUnitId?: string }> {
  if (!listingId || !sourceUnitId) {
    return { success: false, error: 'Listing or Source Unit ID is missing.' };
  }
  const db = getAdminDb();
  const unitsCollection = db.collection('accommodations').doc(listingId).collection('units');
  const sourceUnitRef = unitsCollection.doc(sourceUnitId);

  try {
    const sourceUnitSnap = await sourceUnitRef.get();
    if (!sourceUnitSnap.exists) {
      return { success: false, error: 'Source unit not found.' };
    }

    const sourceData = sourceUnitSnap.data() as BookableUnit;

    const newUnitRef = unitsCollection.doc();
    const newUnitData = {
      ...sourceData,
      name: '', // Blank name, to be filled in by user
      unitRef: '', // Blank ref, to be filled in by user
      status: 'Draft' as const,
    };

    await newUnitRef.set(newUnitData);

    revalidatePath(`/admin/listings/${listingId}/edit/units`);

    return { success: true, newUnitId: newUnitRef.id };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, error: `Failed to duplicate unit: ${errorMessage}` };
  }
}

export async function updateUnitAction(
  listingId: string,
  unitId: string,
  unitData: Partial<Omit<BookableUnit, 'id'>> & { currency?: Currency }
): Promise<{ success: boolean; error?: string; newUnitId?: string }> {
  if (!listingId || !unitId) {
    return { success: false, error: 'Listing or Unit ID is missing.' };
  }
  const db = getAdminDb();
  const listingRef = db.collection('accommodations').doc(listingId);
  const unitsCollection = listingRef.collection('units');

  try {
    if (unitData.currency) {
      await listingRef.update({ currency: unitData.currency });
    }

    const { currency: _currency, ...unitSpecificData } = unitData;
    let finalUnitId = unitId;
    let unitRef;

    if (unitId === 'new') {
      unitRef = unitsCollection.doc();
      finalUnitId = unitRef.id;
      const dataToSet = { status: 'Draft', ...unitSpecificData };
      await unitRef.set(dataToSet);
    } else if (Object.keys(unitSpecificData).length > 0) {
      unitRef = unitsCollection.doc(unitId);
      await unitRef.update(unitSpecificData as UpdateData);
    }

    revalidatePath('/admin/listings');
    revalidatePath(`/admin/listings/${listingId}/edit/units`);
    revalidatePath(`/admin/listings/${listingId}/edit/units/${finalUnitId}`);
    revalidatePath(`/admin/listings/${listingId}/edit/units/${finalUnitId}/basic-info`);
    revalidatePath(`/admin/listings/${listingId}/edit/units/${finalUnitId}/pricing`);
    revalidatePath(`/accommodation/${listingId}`);

    return { success: true, newUnitId: unitId === 'new' ? finalUnitId : undefined };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown server error occurred.';
    return { success: false, error: `Failed to update unit: ${errorMessage}` };
  }
}

// --- Legal Page Actions ---
export async function updateLegalPageAction(
  pageId: 'terms-and-conditions' | 'privacy-policy',
  data: { content: string; versionNote?: string }
): Promise<{ success: boolean; error?: string }> {
  const db = getAdminDb();
  const docRef = db.collection('legal_pages').doc(pageId);

  try {
    const updateData: UpdateData = {
      content: data.content,
      version: FieldValue.increment(1),
      lastModified: FieldValue.serverTimestamp(),
    };
    if (data.versionNote) {
      updateData.versionNote = data.versionNote;
    }

    await docRef.update(updateData);

    // Revalidate paths to update cached data
    revalidatePath('/admin/settings/legal');
    revalidatePath('/account/privacy/terms');
    revalidatePath('/account/privacy/policy');

    return { success: true };
  } catch (error) {
    logger.error(`Error updating legal page ${pageId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update page: ${errorMessage}` };
  }
}
