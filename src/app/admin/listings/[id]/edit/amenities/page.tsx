// src/app/admin/listings/[id]/edit/amenities/page.tsx
import 'server-only';
import AmenitiesPageClient from '@/components/AmenitiesPageClient';
import { fetchAccommodationById, fetchSharedAmenities } from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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

  // Fetch master list of all available shared amenities
  const allSharedAmenities = await fetchSharedAmenities();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Shared Amenities' },
        ]}
      />
      <AmenitiesPageClient
        listing={listing}
        allSharedAmenities={allSharedAmenities.map((a) => ({
          ...a,
          id: a.systemTag,
        }))}
      />
    </div>
  );
}
