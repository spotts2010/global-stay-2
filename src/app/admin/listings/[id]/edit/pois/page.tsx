// src/app/admin/listings/[id]/edit/pois/page.tsx
import 'server-only';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Accommodation, Place } from '@/lib/data';
import { fetchAccommodationById, fetchPointsOfInterest } from '@/lib/firestore.server';
import PointsOfInterest from '@/components/PointsOfInterest';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Helper to check if a value is a Firestore-like Timestamp
function isTimestamp(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  );
}

export default async function PoisPage({ params }: { params: { id: string } }) {
  const listingData = await fetchAccommodationById(params.id);
  const initialPlaces: Place[] = await fetchPointsOfInterest(params.id);

  if (!listingData) {
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

  // Create a serializable version of the listing object
  const serializableListing = {
    ...listingData,
    lastModified: isTimestamp(listingData.lastModified)
      ? listingData.lastModified.toDate().toISOString()
      : new Date().toISOString(), // Fallback
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          {
            label: serializableListing.name,
            href: `/admin/listings/${serializableListing.id}/edit/about`,
          },
          { label: 'Points of Interest' },
        ]}
      />
      <PointsOfInterest
        listing={serializableListing as Accommodation}
        initialPlaces={initialPlaces}
      />
    </div>
  );
}
