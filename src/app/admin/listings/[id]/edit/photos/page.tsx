// src/app/admin/listings/[id]/edit/photos/page.tsx
import 'server-only';
import type { Accommodation } from '@/lib/data';
import { fetchAccommodationById } from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhotosPageClient from '@/components/PhotosPageClient';

// Helper to check if a value is a Firestore-like Timestamp
function isTimestamp(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  );
}

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

  // Ensure all data passed to the client component is serializable
  const serializableListing = {
    ...listing,
    lastModified: isTimestamp(listing.lastModified)
      ? listing.lastModified.toDate().toISOString()
      : new Date().toISOString(), // Fallback
  };

  return <PhotosPageClient listing={serializableListing as Accommodation} />;
}
