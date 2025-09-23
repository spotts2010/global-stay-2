// src/app/accommodation/[id]/page.tsx
import 'server-only';
import { fetchAccommodationById, fetchPointsOfInterest } from '@/lib/firestore.server';
import AccommodationDetailClient from '@/components/AccommodationDetailClient';
import type { Accommodation } from '@/lib/data';

// Helper to check if a value is a Firestore-like Timestamp and convert it
function isTimestamp(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  );
}

// This is now a SERVER component responsible for data fetching
export default async function AccommodationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return <div>Error: Accommodation ID is missing.</div>;
  }

  // Fetch all data on the server first
  const accommodationData = await fetchAccommodationById(id);
  const poiData = await fetchPointsOfInterest(id);

  if (!accommodationData) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center pb-16">
        <h1 className="font-headline text-2xl font-bold">Accommodation not found</h1>
        <p className="text-muted-foreground mt-2">
          The listing you are looking for does not exist or has been moved.
        </p>
      </div>
    );
  }

  // Ensure all data passed to the client component is serializable
  const serializableAccommodation = {
    ...accommodationData,
    lastModified: isTimestamp(accommodationData.lastModified)
      ? accommodationData.lastModified.toDate().toISOString()
      : new Date().toISOString(),
  } as Accommodation;

  return (
    <AccommodationDetailClient
      accommodation={serializableAccommodation}
      pointsOfInterest={poiData}
    />
  );
}
