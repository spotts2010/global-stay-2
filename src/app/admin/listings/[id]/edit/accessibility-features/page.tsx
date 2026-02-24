// src/app/admin/listings/[id]/edit/accessibility-features/page.tsx
import 'server-only';

import AccessibilityPageClient from '@/components/AccessibilityPageClient';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAccessibilityFeatures, fetchAccommodationById } from '@/lib/firestore.server';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccessibilityPage({ params }: PageProps) {
  const { id } = await params;
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

  // Fetch master list and filter for ONLY shared features
  const allFeatures = await fetchAccessibilityFeatures();

  const sharedFeatures = allFeatures.filter(
    (feature): feature is typeof feature & { isShared: boolean } =>
      'isShared' in feature && feature.isShared === true
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Accessibility Features (Shared)' },
        ]}
      />
      <AccessibilityPageClient
        listing={listing}
        unit={undefined} // Explicitly pass undefined for the listing-level page
        allAccessibilityFeatures={sharedFeatures.map((a) => ({
          ...a,
          id: a.systemTag,
        }))}
      />
    </div>
  );
}
