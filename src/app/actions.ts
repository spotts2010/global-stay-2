'use server';

import { revalidatePath } from 'next/cache';
import {
  getAccommodationRecommendations,
  type AccommodationRecommendationsInput,
  type AccommodationRecommendationsOutput,
} from '@/ai/flows/accommodation-recommendations';
import { getAdminDb } from '@/lib/firebaseAdmin';
import type { Place, Accommodation, HeroImage } from './lib/data';
import type { BookableUnit } from '@/components/UnitsPageClient';
import { FieldValue } from 'firebase-admin/firestore';

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
    console.error('Error getting recommendations:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

// --- Accommodation Update Action ---
export async function updateAccommodationAction(
  id: string,
  accommodationData: Partial<Accommodation>
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Accommodation ID is missing.' };
  }
  const db = getAdminDb();
  const accommodationRef = db.collection('accommodations').doc(id);

  try {
    const dataToUpdate: Partial<Accommodation> = { ...accommodationData };

    // Ensure image is set to the first of the images array, or empty string
    if (dataToUpdate.images) {
      dataToUpdate.image = dataToUpdate.images[0] || '';
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
    console.error('Error updating accommodation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update accommodation: ${errorMessage}` };
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
    console.error(`Error updating policies for accommodation ${id}:`, error);
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
    console.error(`Error updating points of interest for accommodation ${accommodationId}:`, error);
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
    console.error(`Error updating status for accommodation ${id}:`, error);
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

// --- Amenity & Inclusion Actions ---
type Item = {
  id: string;
  label: string;
  systemTag: string;
  category: string;
};

async function updateMasterList(
  collectionName: 'sharedAmenities' | 'privateInclusions',
  items: Item[]
): Promise<{ success: boolean; error?: string }> {
  const db = getAdminDb();
  const collectionRef = db.collection(collectionName);

  try {
    const batch = db.batch();
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    items.forEach((item) => {
      const docRef = collectionRef.doc(item.systemTag); // Use systemTag as ID
      batch.set(docRef, {
        label: item.label,
        category: item.category,
      });
    });
    await batch.commit();
    revalidatePath('/admin/amenities');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update ${collectionName}: ${errorMessage}` };
  }
}

export async function updateSharedAmenitiesAction(
  items: Item[]
): Promise<{ success: boolean; error?: string }> {
  return updateMasterList('sharedAmenities', items);
}

export async function updatePrivateInclusionsAction(
  items: Item[]
): Promise<{ success: boolean; error?: string }> {
  return updateMasterList('privateInclusions', items);
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

export async function updateUnitAction(
  listingId: string,
  unitId: string,
  unitData: Partial<BookableUnit> // Use a more specific type
): Promise<{ success: boolean; error?: string }> {
  if (!listingId || !unitId) {
    return { success: false, error: 'Listing or Unit ID is missing.' };
  }

  // This is a placeholder. In a real app, this would save to a subcollection
  // e.g., /accommodations/{listingId}/units/{unitId}
  console.log('Simulating update for unit:', { listingId, unitId, unitData });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For now, always return success
  revalidatePath(`/admin/listings/${listingId}/edit/units/${unitId}/photos`);
  return { success: true };
}

// --- Legal Page Actions ---
export async function updateLegalPageAction(
  pageId: 'terms-and-conditions' | 'privacy-policy',
  data: { content: string; versionNote?: string }
): Promise<{ success: boolean; error?: string }> {
  const db = getAdminDb();
  const docRef = db.collection('legal_pages').doc(pageId);

  try {
    const updateData: { [key: string]: unknown } = {
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
    console.error(`Error updating legal page ${pageId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update page: ${errorMessage}` };
  }
}
