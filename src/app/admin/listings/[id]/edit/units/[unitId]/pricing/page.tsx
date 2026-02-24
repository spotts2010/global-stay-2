// src/app/admin/listings/[id]/edit/units/[unitId]/pricing/page.tsx
import 'server-only';

import PricingPageClient from '@/components/PricingPageClient';
import { BookableUnit } from '@/components/UnitsPageClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAccommodationById, fetchUnitsForAccommodation } from '@/lib/firestore.server';

type PageProps = {
  params: Promise<{ id: string; unitId: string }>;
};

// SERVER component responsible for data fetching
export default async function PricingPage({ params }: PageProps) {
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

  const units = await fetchUnitsForAccommodation(id);
  const unit = units.find((u) => u.id === unitId);

  if (!unit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unit not found.</p>
        </CardContent>
      </Card>
    );
  }

  return <PricingPageClient listing={listing} unit={unit as BookableUnit} />;
}
