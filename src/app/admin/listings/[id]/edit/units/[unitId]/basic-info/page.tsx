// src/app/admin/listings/[id]/edit/units/[unitId]/basic-info/page.tsx
import 'server-only';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAccommodationById } from '@/lib/firestore.server';
import BasicInfoClient from '@/components/BasicInfoClient';

// This is now a SERVER component responsible for data fetching
export default async function BasicInfoPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No listing ID provided.</p>
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

  return <BasicInfoClient listing={listing} />;
}
