// src/app/admin/listings/[id]/edit/amenities/page.tsx
import 'server-only';
import AmenitiesPageClient from '@/components/AmenitiesPageClient';
import {
  fetchAccommodationById,
  fetchPrivateInclusions,
  fetchSharedAmenities,
} from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AmenitiesPage({ params }: { params: { id: string } }) {
  const listing = await fetchAccommodationById(params.id);

  if (!listing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Listing not found.</p>
        </CardContent>
      </Card>
    );
  }

  // Fetch master lists
  const allSharedAmenities = await fetchSharedAmenities();
  const allPrivateInclusions = await fetchPrivateInclusions();

  // Create Item arrays based on the listing's current amenities.
  // The `amenities` field holds the systemTags for shared amenities.
  // The `chargeableAmenities` field holds the systemTags for private inclusions.
  const listingShared =
    allSharedAmenities.filter((item) => listing.amenities?.includes(item.systemTag)) || [];
  const listingPrivate =
    allPrivateInclusions.filter((item) => listing.chargeableAmenities?.includes(item.systemTag)) ||
    [];

  return (
    <AmenitiesPageClient
      initialSharedAmenities={listingShared}
      initialPrivateInclusions={listingPrivate}
    />
  );
}
