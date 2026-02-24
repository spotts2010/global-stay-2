// src/app/admin/listings/[id]/edit/units/[unitId]/photos/page.tsx
import 'server-only';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import UnitPhotosClient from '@/components/UnitPhotosClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAccommodationById, fetchUnitsForAccommodation } from '@/lib/firestore.server';

type PageProps = {
  params: Promise<{ id: string; unitId: string }>;
};

// SERVER component responsible for data fetching
export default async function PhotosPage({ params }: PageProps) {
  const { id, unitId } = await params;

  if (!id || !unitId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No listing or unit ID provided.</p>
        </CardContent>
      </Card>
    );
  }

  const listing = await fetchAccommodationById(id);

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

  const units = await fetchUnitsForAccommodation(id);
  const unit = units.find((u) => u.id === unitId);
  const unitName = unit?.name || 'Unit Photos';

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Units', href: `/admin/listings/${listing.id}/edit/units` },
          { label: unitName },
          { label: 'Photos' },
        ]}
      />
      <UnitPhotosClient listing={listing} unit={unit} />
    </div>
  );
}
