// src/app/admin/listings/[id]/edit/units/[unitId]/inclusions/page.tsx
import 'server-only';
import InclusionsPageClient from '@/components/InclusionsPageClient';
import {
  fetchAccommodationById,
  fetchPrivateInclusions,
  fetchUnitsForAccommodation,
} from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default async function InclusionsPage({
  params,
}: {
  params: { id: string; unitId: string };
}) {
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
  const unitName = unit ? unit.name : params.unitId === 'new' ? 'New Unit' : 'Unit';

  // Fetch master list of all available private inclusions
  const allPrivateInclusions = await fetchPrivateInclusions();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: `/admin/listings` },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Units', href: `/admin/listings/${listing.id}/edit/units` },
          { label: unitName },
          { label: 'Inclusions' },
        ]}
      />
      <InclusionsPageClient
        listingId={listing.id}
        unit={unit}
        allPrivateInclusions={allPrivateInclusions.map((a) => ({
          ...a,
          id: a.systemTag,
        }))}
      />
    </div>
  );
}
