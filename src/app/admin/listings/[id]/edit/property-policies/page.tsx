// src/app/admin/listings/[id]/edit/property-policies/page.tsx
import 'server-only';
import PropertyPoliciesPageClient from '@/components/PropertyPoliciesPageClient';
import { fetchAccommodationById } from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function PropertyPoliciesPage({ params }: { params: { id: string } }) {
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

  return <PropertyPoliciesPageClient listing={listing} />;
}
