// src/app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminDb } from '@/lib/firebaseAdmin';
import type { Place, Accommodation, HeroImage, Currency, Address } from '@/lib/data';
import type { BookableUnit } from '@/components/UnitsPageClient';
import { FieldValue, UpdateData } from 'firebase-admin/firestore';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const addressSchema = z.object({
  formatted: z.string().optional(),
  streetNumber: z.string().optional(),
  street: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  state: z.object({ short: z.string(), long: z.string() }).optional(),
  country: z.object({ short: z.string(), long: z.string() }).optional(),
  postcode: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  searchIndex: z.string().optional(),
});

const newPropertySchema = z.object({
  name: z.string(),
  type: z.string(),
  starRating: z.number().optional(),
  description: z.string().optional(),
  address: addressSchema.optional(),
});

export async function createListingAction(
  data: z.infer<typeof newPropertySchema>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const validatedData = newPropertySchema.parse(data);

    const db = requireAdminDb();
    const newDocRef = db.collection('accommodations').doc();

    // ✅ Omit `address` from the object we write (it doesn't match your strict `Address` type)
    const { address, ...rest } = validatedData;

    const newListingData: Partial<Accommodation> = {
      ...rest,
      status: 'Draft',
      slug: `${validatedData.name.toLowerCase().replace(/\s+/g, '-')}-${newDocRef.id.slice(0, 5)}`,
      lastModified: new Date(),
      rating: 0,
      reviewsCount: 0,
      images: [],
      price: 0,
      currency: 'USD',
      bookingType: 'room',
    };

    if (address) {
      newListingData.lat = address.lat;
      newListingData.lng = address.lng;
      newListingData.city = address.city;
      newListingData.state = address.state?.long;
      newListingData.country = address.country?.long;
      newListingData.location = address.formatted;
    }

    await newDocRef.set(newListingData);

    revalidatePath('/admin/listings');
    return { success: true, id: newDocRef.id };
  } catch (error) {
    logger.error('Error creating new listing:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to create listing: ${errorMessage}` };
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

  const db = requireAdminDb();
  const accommodationRef = db.collection('accommodations').doc(id);

  try {
    // ✅ Keep patch as plain Accommodation fields only (no FieldValue on typed fields)
    const patch: Partial<Accommodation> = {
      ...accommodationData,
    };

    // Ensure image is set to the first of the images array, or empty string
    if (Array.isArray(patch.images)) {
      patch.image = patch.images[0] ?? '';
    }

    // Handle nested address object
    if (patch.address) {
      patch.lat = patch.address.lat;
      patch.lng = patch.address.lng;
      patch.city = patch.address.city;
      patch.state = patch.address.state?.long;
      patch.country = patch.address.country?.long;
      patch.location = patch.address.formatted;
    }

    // ✅ Apply server timestamp separately so it doesn't conflict with `lastModified: Date`
    const updatePayload: UpdateData<Accommodation> = {
      ...(patch as UpdateData<Accommodation>),
      lastModified: FieldValue.serverTimestamp(),
    };

    await accommodationRef.update(updatePayload);

    revalidatePath(`/admin/listings/${id}/edit/about`);
    revalidatePath(`/admin/listings/${id}/edit/photos`);
    revalidatePath(`/admin/listings`);
    revalidatePath(`/accommodation/${id}`);
    revalidatePath(`/`);

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

  const db = requireAdminDb();
  const sourceListingRef = db.collection('accommodations').doc(listingId);

  try {
    const sourceListingSnap = await sourceListingRef.get();
    if (!sourceListingSnap.exists) {
      return { success: false, error: 'Source listing not found.' };
    }

    const sourceData = sourceListingSnap.data() as Accommodation;
    const newListingRef = db.collection('accommodations').doc();

    const newListingData: Omit<Accommodation, 'id' | 'units'> = {
      ...sourceData,
      name: `${sourceData.name} (Copy)`,
      status: 'Draft',
      slug: `${sourceData.slug}-copy-${Date.now()}`,
      lastModified: new Date(),
    };

    // Explicitly delete any legacy fields that shouldn't be copied.
    delete (newListingData as Partial<Accommodation>).id;
    delete (newListingData as Partial<Accommodation>).units;
    delete (newListingData as Partial<Accommodation>).unitsCount;

    const batch = db.batch();
    batch.set(newListingRef, newListingData);

    const unitsSnapshot = await sourceListingRef.collection('units').get();
    if (!unitsSnapshot.empty) {
      const newUnitsCollectionRef = newListingRef.collection('units');
      unitsSnapshot.forEach((unitDoc) => {
        const newUnitRef = newUnitsCollectionRef.doc();
        batch.set(newUnitRef, unitDoc.data());
      });
    }

    await batch.commit();

    revalidatePath('/admin/listings');

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown server error occurred.';
    logger.error('Failed to duplicate listing:', error);
    return { success: false, error: `Failed to duplicate listing: ${errorMessage}` };
  }
}

export async function deleteListingAction(
  listingId: string
): Promise<{ success: boolean; error?: string }> {
  if (!listingId) {
    return { success: false, error: 'Listing ID is missing.' };
  }

  const db = requireAdminDb();
  const listingRef = db.collection('accommodations').doc(listingId);

  try {
    const listingDoc = await listingRef.get();
    if (!listingDoc.exists) {
      return { success: false, error: 'Listing not found.' };
    }

    await listingRef.delete();

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

  const db = requireAdminDb();
  const accommodationRef = db.collection('accommodations').doc(id);

  try {
    const patch: Pick<Accommodation, 'paymentTerms' | 'cancellationPolicy' | 'houseRules'> & {
      lastModified: unknown;
    } = {
      ...policiesData,
      lastModified: FieldValue.serverTimestamp(),
    };

    await accommodationRef.update(patch as UpdateData<Accommodation>);

    revalidatePath(`/admin/listings/${id}/edit/property-policies`);
    revalidatePath(`/accommodation/${id}`);

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

  const db = requireAdminDb();
  const accommodationRef = db.collection('accommodations').doc(accommodationId);
  const poiCollectionRef = accommodationRef.collection('pointsOfInterest');

  try {
    const batch = db.batch();
    const existingPoisSnapshot = await poiCollectionRef.get();

    existingPoisSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    pointsOfInterestData.forEach((place) => {
      // Keep POI docs "plain" for Firestore writes (avoid complex nested types)
      const { id, name, address, category, source, visible, distance, lat, lng } = place;

      const newPoiData: Partial<Place> = {
        name,
        address,
        category,
        source,
        visible,
        distance,
        lat,
        lng,
      };

      const newPoiDocRef = poiCollectionRef.doc(id);
      batch.set(newPoiDocRef, newPoiData);
    });

    // Also bump parent lastModified so list/detail views update predictably
    batch.update(accommodationRef, {
      lastModified: FieldValue.serverTimestamp(),
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

  const db = requireAdminDb();
  const accommodationRef = db.collection('accommodations').doc(id);

  try {
    await accommodationRef.update({
      status,
      lastModified: FieldValue.serverTimestamp(),
    } as UpdateData<Accommodation>);

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
  const db = requireAdminDb();

  try {
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

  const db = requireAdminDb();

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
  const db = requireAdminDb();

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
  const db = requireAdminDb();
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

      // Shared base fields
      const dataToSet: Record<string, string | boolean> = {
        label: item.label,
        category: item.category,
      };

      // Specific handling for accessibility features
      if (collectionName === 'accessibilityFeatures') {
        const accItem = item as AccessibilityItem;
        dataToSet.isShared = accItem.isShared ?? false;
        dataToSet.isPrivate = accItem.isPrivate ?? true;
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

  const db = requireAdminDb();
  const listingRef = db.collection('accommodations').doc(listingId);

  try {
    await listingRef.update({
      amenities: amenityIds,
      chargeableAmenities: chargeableAmenityIds,
      lastModified: FieldValue.serverTimestamp(),
    } as UpdateData<Accommodation>);

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

  const db = requireAdminDb();
  const listingRef = db.collection('accommodations').doc(listingId);

  try {
    await listingRef.update({
      accessibilityFeatures: featureIds,
      chargeableAccessibilityFeatures: chargeableFeatureIds,
      lastModified: FieldValue.serverTimestamp(),
    } as UpdateData<Accommodation>);

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

  const db = requireAdminDb();
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

  const db = requireAdminDb();
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
  const db = requireAdminDb();

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
  const db = requireAdminDb();

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

  const db = requireAdminDb();

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

  const db = requireAdminDb();
  const unitsCollectionRef = db.collection('accommodations').doc(listingId).collection('units');

  try {
    const batch = db.batch();
    const existingUnitsSnapshot = await unitsCollectionRef.get();

    existingUnitsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    units.forEach((unit) => {
      const { id, ...unitData } = unit;
      const unitRef = unitsCollectionRef.doc(id);
      batch.set(unitRef, unitData);
    });

    await batch.commit();

    revalidatePath(`/admin/listings/${listingId}/edit/units`);
    revalidatePath(`/accommodation/${listingId}`);

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

  const db = requireAdminDb();
  const unitsCollection = db.collection('accommodations').doc(listingId).collection('units');
  const sourceUnitRef = unitsCollection.doc(sourceUnitId);

  try {
    const sourceUnitSnap = await sourceUnitRef.get();
    if (!sourceUnitSnap.exists) {
      return { success: false, error: 'Source unit not found.' };
    }

    const sourceData = sourceUnitSnap.data() as BookableUnit;

    const newUnitRef = unitsCollection.doc();
    const newUnitData: Partial<BookableUnit> = {
      ...sourceData,
      name: `${sourceData.name || 'Unit'} (Copy)`,
      unitRef: '',
      status: 'Draft' as const,
    };

    await newUnitRef.set(newUnitData);

    revalidatePath(`/admin/listings/${listingId}/edit/units`);
    revalidatePath(`/accommodation/${listingId}`);

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

  const db = requireAdminDb();
  const listingRef = db.collection('accommodations').doc(listingId);
  const unitsCollection = listingRef.collection('units');

  try {
    if (unitData.currency) {
      await listingRef.update({ currency: unitData.currency } as UpdateData<Accommodation>);
    }

    const { currency: _currency, ...unitSpecificData } = unitData;

    let finalUnitId = unitId;

    if (unitId === 'new') {
      const unitRef = unitsCollection.doc();
      finalUnitId = unitRef.id;

      // ✅ Ensure we never carry through a non-Draft status from client data
      const { status: _status, ...unitSpecificDataNoStatus } = unitSpecificData as Partial<
        Omit<BookableUnit, 'id'>
      >;

      const dataToSet: Partial<Omit<BookableUnit, 'id'>> = {
        ...unitSpecificDataNoStatus,
        status: 'Draft',
      };

      await unitRef.set(dataToSet);
    } else if (Object.keys(unitSpecificData).length > 0) {
      const unitRef = unitsCollection.doc(unitId);
      await unitRef.update(unitSpecificData as UpdateData<Omit<BookableUnit, 'id'>>);
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
  const db = requireAdminDb();
  const docRef = db.collection('legal_pages').doc(pageId);

  try {
    const updateData: Record<string, unknown> = {
      content: data.content,
      version: FieldValue.increment(1),
      lastModified: FieldValue.serverTimestamp(),
      ...(data.versionNote ? { versionNote: data.versionNote } : {}),
    };

    await docRef.update(updateData as FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData>);

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
