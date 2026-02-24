// src/app/accommodation/[id]/page.tsx
import 'server-only';

import AccommodationDetailClient from '@/components/AccommodationDetailClient';
import type { Accommodation } from '@/lib/data';
import type { BookableUnit } from '@/components/UnitsPageClient';
import {
  fetchAccommodationById,
  fetchPointsOfInterest,
  fetchSharedAmenities,
  fetchUnitsForAccommodation,
} from '@/lib/firestore.server';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccommodationDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    return <div>Error: Accommodation ID is missing.</div>;
  }

  const [accommodationData, poiData, allAmenities, unitsData] = await Promise.all([
    fetchAccommodationById(id),
    fetchPointsOfInterest(id),
    fetchSharedAmenities(),
    fetchUnitsForAccommodation(id),
  ]);

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
      allAmenities={allAmenities}
      units={(unitsData ?? []) as BookableUnit[]}
    />
  );
}
