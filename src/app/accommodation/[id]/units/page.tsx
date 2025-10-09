// src/app/accommodation/[id]/units/page.tsx
import 'server-only';
import {
  fetchAccommodationById,
  fetchPrivateInclusions,
  fetchUnitsForAccommodation,
  fetchAccessibilityFeatures,
} from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookableUnit } from '@/components/UnitsPageClient';
import UnitSelectionPageClient from '@/components/UnitSelectionPageClient';

// This is a SERVER component responsible for data fetching
export default async function SelectUnitPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;

  if (!id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Accommodation ID is missing.</p>
        </CardContent>
      </Card>
    );
  }

  const accommodationData = await fetchAccommodationById(id);
  const unitsData = (await fetchUnitsForAccommodation(id)) as BookableUnit[];
  const allInclusions = await fetchPrivateInclusions();
  const allAccessibilityFeatures = await fetchAccessibilityFeatures();

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
    <UnitSelectionPageClient
      accommodation={accommodationData}
      units={unitsData}
      allInclusions={allInclusions}
      allAccessibilityFeatures={allAccessibilityFeatures}
      searchParams={searchParams}
    />
  );
}
