// src/app/admin/listings/[id]/edit/units/page.tsx
import 'server-only';
import { fetchAccommodationById, fetchUnitsForAccommodation } from '@/lib/firestore.server';
import UnitsPageClient from '@/components/UnitsPageClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function UnitsPage({ params }: { params: { id: string } }) {
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

  // Fetch the units from the subcollection
  const units = await fetchUnitsForAccommodation(params.id);

  return <UnitsPageClient listing={listing} initialUnits={units} />;
}
