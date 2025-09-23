'use server';

import { revalidatePath } from 'next/cache';
import {
  getAccommodationRecommendations,
  type AccommodationRecommendationsInput,
  type AccommodationRecommendationsOutput,
} from '@/ai/flows/accommodation-recommendations';
import { getAdminDb } from '@/lib/firebaseAdmin';
import type { Place, Accommodation, HeroImage } from './lib/data';

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
    await accommodationRef.update(accommodationData);
    revalidatePath(`/admin/listings/${id}/edit/about`);
    revalidatePath(`/admin/listings`);
    revalidatePath(`/accommodation/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating accommodation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update accommodation: ${errorMessage}` };
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
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const db = getAdminDb();
  try {
    // Check for duplicates
    const querySnapshot = await db
      .collection('bedTypes')
      .where('systemId', '==', bedType.systemId)
      .get();
    if (!querySnapshot.empty) {
      return { success: false, error: 'A bed type with this name or system ID already exists.' };
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
