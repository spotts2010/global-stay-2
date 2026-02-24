// src/app/admin/listings/[id]/edit/units/[unitId]/occupancy-layout/page.tsx
import 'server-only';
import { fetchBedTypes, fetchUnitsForAccommodation } from '@/lib/firestore.server';
import type { BedType } from '@/lib/data';
import OccupancyLayoutClient from '@/components/OccupancyLayoutClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BookableUnit } from '@/components/UnitsPageClient';

// This is now a SERVER component responsible for data fetching
export default async function OccupancyLayoutPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id: listingId, unitId } = await params;

  if (!listingId || !unitId) {
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

  const bedTypes: BedType[] = await fetchBedTypes();
  // Sort bed types alphabetically by name before passing to the client
  const sortedBedTypes = bedTypes.sort((a, b) => a.name.localeCompare(b.name));

  let unit: BookableUnit | null = null;

  if (unitId !== 'new') {
    const units = await fetchUnitsForAccommodation(listingId);
    unit = units.find((u) => u.id === unitId) || null;
  }

  return <OccupancyLayoutClient listingId={listingId} unit={unit} bedTypes={sortedBedTypes} />;
}
