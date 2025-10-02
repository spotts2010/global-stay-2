// src/app/admin/listings/[id]/edit/amenities/page.tsx
import 'server-only';
import AmenitiesPageClient from '@/components/AmenitiesPageClient';
import { fetchAccommodationById } from '@/lib/firestore.server';
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

  return <AmenitiesPageClient listing={listing} />;
}
