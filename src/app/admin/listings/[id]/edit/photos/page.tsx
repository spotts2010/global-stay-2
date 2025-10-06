// src/app/admin/listings/[id]/edit/photos/page.tsx
import 'server-only';
import type { Accommodation } from '@/lib/data';
import { fetchAccommodationById } from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhotosPageClient from '@/components/PhotosPageClient';

// This is now a SERVER component responsible for data fetching
export default async function PhotosPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No listing ID provided.</p>
        </CardContent>
      </Card>
    );
  }

  // Data is already serialized by the fetching function
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

  return <PhotosPageClient listing={listing as Accommodation} />;
}
