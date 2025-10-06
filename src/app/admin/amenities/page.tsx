// src/app/admin/amenities/page.tsx
import 'server-only';
import { fetchSharedAmenities, fetchPrivateInclusions } from '@/lib/firestore.server';
import AmenitiesManagementClient from '@/components/AmenitiesPageClient';

export default async function AmenitiesPage() {
  const initialSharedAmenities = await fetchSharedAmenities();
  const initialPrivateInclusions = await fetchPrivateInclusions();

  return (
    <div className="flex-1 space-y-6">
      <AmenitiesManagementClient
        initialSharedAmenities={initialSharedAmenities}
        initialPrivateInclusions={initialPrivateInclusions}
      />
    </div>
  );
}
