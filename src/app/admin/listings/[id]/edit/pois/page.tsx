// src/app/admin/listings/[id]/edit/pois/page.tsx
import 'server-only';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Accommodation, Place } from '@/lib/data';
import { fetchAccommodationById, fetchPointsOfInterest } from '@/lib/firestore.server';
import PointsOfInterest from '@/components/PointsOfInterest';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function PoisPage({ params }: { params: { id: string } }) {
  // Data is already serialized by the fetching functions
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

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          {
            label: listingData.name,
            href: `/admin/listings/${listingData.id}/edit/about`,
          },
          { label: 'Points of Interest' },
        ]}
      />
      <PointsOfInterest listing={listingData as Accommodation} initialPlaces={initialPlaces} />
    </div>
  );
}
