// src/app/admin/listings/[id]/edit/units/[unitId]/basic-info/page.tsx
import 'server-only';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAccommodationById, fetchUnitsForAccommodation } from '@/lib/firestore.server';
import BasicInfoClient from '@/components/BasicInfoClient';
import { BookableUnit } from '@/components/UnitsPageClient';

// This is now a SERVER component responsible for data fetching
export default async function BasicInfoPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = await params;

  if (!id || !unitId) {
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

  const listing = await fetchAccommodationById(id);

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

  let unit: BookableUnit | undefined = undefined;
  if (unitId !== 'new') {
    const units = await fetchUnitsForAccommodation(id);
    unit = units.find((u) => u.id === unitId);
  }

  return <BasicInfoClient listing={listing} unit={unit} />;
}
