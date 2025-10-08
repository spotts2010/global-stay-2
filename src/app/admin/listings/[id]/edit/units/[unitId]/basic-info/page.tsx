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
  params: { id: string; unitId: string };
}) {
  if (!params.id || !params.unitId) {
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

  let unit: BookableUnit | undefined = undefined;
  if (params.unitId !== 'new') {
    const units = await fetchUnitsForAccommodation(params.id);
    unit = units.find((u) => u.id === params.unitId);
  }

  return <BasicInfoClient listing={listing} unit={unit} />;
}
