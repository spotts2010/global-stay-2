// src/app/admin/listings/[id]/edit/units/page.tsx
import 'server-only';

import UnitsPageClient from '@/components/UnitsPageClient';
import { fetchAccommodationById, fetchUnitsForAccommodation } from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UnitsPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
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

  // Fetch the units from the subcollection
  const units = await fetchUnitsForAccommodation(id);

  return <UnitsPageClient listing={listing} initialUnits={units} />;
}
