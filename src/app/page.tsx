
// src/app/page.tsx

import { fetchAccommodations, fetchSiteSettings } from '@/lib/firestore.server';
import type { Accommodation, HeroImage } from '@/lib/data';
import HomeContent from '@/components/HomeContent';

// Helper to check if a value is a Firestore-like Timestamp
function isTimestamp(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  );
}

// This is now a SERVER component responsible for data fetching.
export default async function Home() {
  const accommodations: Accommodation[] = await fetchAccommodations();
  const siteSettings = await fetchSiteSettings();
  const heroImages: HeroImage[] = siteSettings?.heroImages || [];

  // Create a serializable version of the properties to pass to the client
  const serializableAccommodations = accommodations.map((p) => ({
    ...p,
    // Convert Firestore Timestamp to ISO string to make it serializable
    lastModified: isTimestamp(p.lastModified)
      ? p.lastModified.toDate().toISOString()
      : new Date().toISOString(), // Fallback to current date if invalid
  }));

  return (
    <HomeContent
      initialAccommodations={serializableAccommodations as unknown as Accommodation[]}
      heroImages={heroImages}
    />
  );
}
