// src/app/admin/amenities/page.tsx
import 'server-only';
import { fetchSharedAmenities, fetchPrivateInclusions } from '@/lib/firestore.server';
import AmenitiesPageClient from '@/components/AmenitiesPageClient';

// This is now a SERVER component responsible for data fetching
export default async function AmenitiesPage() {
  const initialSharedAmenities = await fetchSharedAmenities();
  const initialPrivateInclusions = await fetchPrivateInclusions();

  return (
    <AmenitiesPageClient
      initialSharedAmenities={initialSharedAmenities}
      initialPrivateInclusions={initialPrivateInclusions}
    />
  );
}
