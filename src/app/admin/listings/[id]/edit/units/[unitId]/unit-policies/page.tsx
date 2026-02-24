// src/app/admin/listings/[id]/edit/units/[unitId]/unit-policies/page.tsx
import 'server-only';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUnitById } from '@/lib/firestore.server';
import UnitPoliciesPageClient from '@/components/UnitPoliciesPageClient';
import type { BookableUnit } from '@/components/UnitsPageClient';

// This is now a SERVER component responsible for data fetching
export default async function UnitPoliciesPage({
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

  const unit = unitId === 'new' ? null : await fetchUnitById(listingId, unitId);

  if (unitId !== 'new' && !unit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The specified unit could not be found for this listing.</p>
        </CardContent>
      </Card>
    );
  }

  return <UnitPoliciesPageClient unit={unit as BookableUnit | null} />;
}
