// src/app/admin/listings/[id]/edit/units/[unitId]/accessibility-features/page.tsx
import 'server-only';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAccommodationById, fetchUnitById } from '@/lib/firestore.server';
import AccessibilityPageClient from '@/components/AccessibilityPageClient';

// This is now a SERVER component responsible for data fetching
export default async function AccessibilityPage({
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

  // Fetch only the specific unit needed
  const unit = params.unitId === 'new' ? undefined : await fetchUnitById(params.id, params.unitId);

  return <AccessibilityPageClient listing={listing} unit={unit} />;
}
