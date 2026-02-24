// src/app/admin/listings/[id]/edit/units/[unitId]/accessibility-features/page.tsx
import 'server-only';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  fetchAccommodationById,
  fetchUnitById,
  fetchAccessibilityFeatures,
} from '@/lib/firestore.server';
import AccessibilityPageClient from '@/components/AccessibilityPageClient';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BookableUnit } from '@/components/UnitsPageClient';
import { use } from 'react';

export default function UnitAccessibilityPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id: listingId, unitId } = use(params);

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

  const listing = use(fetchAccommodationById(listingId));
  if (!listing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listing Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The specified listing could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  let unit: BookableUnit | undefined;
  if (unitId !== 'new') {
    unit = use(fetchUnitById(listingId, unitId)) || undefined;
    if (!unit) {
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
  }

  const allFeatures = use(fetchAccessibilityFeatures());

  type FeatureWithPrivateFlag = { isPrivate?: boolean };
  const privateFeatures = allFeatures.filter(
    (feature) => (feature as FeatureWithPrivateFlag).isPrivate === true
  );
  const unitName = unit ? unit.name : unitId === 'new' ? 'New Unit' : 'Unit';

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: `/admin/listings` },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Units', href: `/admin/listings/${listing.id}/edit/units` },
          { label: unitName },
          { label: 'Accessibility' },
        ]}
      />
      <AccessibilityPageClient
        listing={listing}
        unit={unit}
        allAccessibilityFeatures={privateFeatures.map((a) => ({ ...a, id: a.systemTag }))}
      />
    </div>
  );
}
