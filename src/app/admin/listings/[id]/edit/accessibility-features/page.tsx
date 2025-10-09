// src/app/admin/listings/[id]/edit/accessibility-features/page.tsx
import 'server-only';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAccommodationById, fetchAccessibilityFeatures } from '@/lib/firestore.server';
import AccessibilityPageClient from '@/components/AccessibilityPageClient';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { use } from 'react';

export default function AccessibilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = use(fetchAccommodationById(id));

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
  const allFeatures = use(fetchAccessibilityFeatures());
  const sharedFeatures = allFeatures.filter((feature) => feature.isShared);

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
