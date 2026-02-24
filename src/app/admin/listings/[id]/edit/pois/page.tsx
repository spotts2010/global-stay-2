// src/app/admin/listings/[id]/edit/pois/page.tsx
import 'server-only';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import PointsOfInterest from '@/components/PointsOfInterest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Accommodation, Place } from '@/lib/data';
import { fetchAccommodationById, fetchPointsOfInterest } from '@/lib/firestore.server';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PoisPage({ params }: PageProps) {
  const { id } = await params;

  // Data is already serialized by the fetching functions
  const listingData = await fetchAccommodationById(id);
  const initialPlaces: Place[] = await fetchPointsOfInterest(id);

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
