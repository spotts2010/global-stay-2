// src/app/admin/listings/[id]/edit/about/page.tsx
import 'server-only';
import { fetchAccommodationById } from '@/lib/firestore.server';
import AboutPageClient from '@/components/AboutPageClient';
import type { Accommodation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Helper to check if a value is a Firestore-like Timestamp and convert it
function isTimestamp(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  );
}

// This is now a SERVER component responsible for data fetching
export default async function AboutPage({ params }: { params: { id: string } }) {
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

  const accommodationData = await fetchAccommodationById(params.id);

  if (!accommodationData) {
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
  const serializableAccommodation: Accommodation = {
    ...accommodationData,
    lastModified: isTimestamp(accommodationData.lastModified)
      ? accommodationData.lastModified.toDate() // Convert to Date object
      : new Date(), // Fallback
  };

  return <AboutPageClient listing={serializableAccommodation} />;
}
