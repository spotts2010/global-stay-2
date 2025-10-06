// src/app/accommodation/[id]/page.tsx
import 'server-only';
import { fetchAccommodationById, fetchPointsOfInterest } from '@/lib/firestore.server';
import AccommodationDetailClient from '@/components/AccommodationDetailClient';
import type { Accommodation } from '@/lib/data';

// This is now a SERVER component responsible for data fetching
export default async function AccommodationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return <div>Error: Accommodation ID is missing.</div>;
  }

  // Fetch all data on the server first. The data is already serialized.
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

  return (
    <AccommodationDetailClient
      accommodation={accommodationData as Accommodation}
      pointsOfInterest={poiData}
    />
  );
}
