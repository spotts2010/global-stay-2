'use server';

import { revalidatePath } from 'next/cache';
import {
  getAccommodationRecommendations,
  type AccommodationRecommendationsInput,
  type AccommodationRecommendationsOutput,
} from '@/ai/flows/accommodation-recommendations';
import { getAdminDb } from '@/lib/firebaseAdmin';
import type { Place } from '@/components/PointsOfInterest';
import type { Accommodation, HeroImage } from './lib/data';

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

// --- Unified Accommodation Update Action ---
export async function updateAccommodationAction(
  id: string,
  accommodationData: Partial<Accommodation>,
  pointsOfInterestData?: Place[] // Make POIs optional
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Accommodation ID is missing.' };
  }
  const db = getAdminDb();
  const accommodationRef = db.collection('accommodations').doc(id);

  try {
    // Start a transaction or batch write
    const batch = db.batch(); // Admin SDK batch

    // Step 1: Update the main accommodation document
    batch.update(accommodationRef, accommodationData);

    // Step 2: If pointsOfInterestData is provided, update the POIs subcollection
    if (pointsOfInterestData) {
      const poiCollectionRef = accommodationRef.collection('pointsOfInterest');
      const existingPoisSnapshot = await poiCollectionRef.get();

      // Delete old POIs
      existingPoisSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Add new POIs
      for (const newPlace of pointsOfInterestData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { geometry, ...placeData } = newPlace; // Exclude complex geometry object

        const dataToSet: Partial<Place> & { lat?: number; lng?: number } = {
          ...placeData,
        };

        if (newPlace.geometry && typeof newPlace.geometry.lat === 'function') {
          dataToSet.lat = newPlace.geometry.lat();
          dataToSet.lng = newPlace.geometry.lng();
        } else if (newPlace.lat && newPlace.lng) {
          dataToSet.lat = newPlace.lat;
          dataToSet.lng = newPlace.lng;
        }
        const newPoiDocRef = poiCollectionRef.doc(newPlace.id);
        batch.set(newPoiDocRef, dataToSet);
      }
    }

    // Commit the entire batch
    await batch.commit();

    // Revalidate paths to update cached data on the front end
    revalidatePath(`/admin/listings/${id}/edit/about`);
    revalidatePath(`/admin/listings/${id}/edit/photos`);
    revalidatePath(`/admin/listings`);
    revalidatePath(`/accommodation/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating accommodation:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: `Failed to update accommodation: ${errorMessage}` };
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
