// src/app/admin/listings/[id]/edit/units/[unitId]/pricing/page.tsx
import 'server-only';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAccommodationById, fetchUnitsForAccommodation } from '@/lib/firestore.server';
import PricingPageClient from '@/components/PricingPageClient';
import { BookableUnit } from '@/components/UnitsPageClient';

// This is now a SERVER component responsible for data fetching
export default async function PricingPage({ params }: { params: { id: string; unitId: string } }) {
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

  const units = await fetchUnitsForAccommodation(params.id);
  const unit = units.find((u) => u.id === params.unitId);

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
