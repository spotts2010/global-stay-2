// src/app/admin/listings/[id]/edit/property-policies/page.tsx
import 'server-only';

import PropertyPoliciesPageClient from '@/components/PropertyPoliciesPageClient';
import { fetchAccommodationById } from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyPoliciesPage({ params }: PageProps) {
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

  return <PropertyPoliciesPageClient listing={listing} />;
}
