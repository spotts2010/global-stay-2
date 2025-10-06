// src/app/admin/listings/[id]/edit/units/page.tsx
import 'server-only';
import { fetchAccommodationById } from '@/lib/firestore.server';
import UnitsPageClient from '@/components/UnitsPageClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function UnitsPage({ params }: { params: { id: string } }) {
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

  // The client component for this page doesn't directly use `lastModified`,
  // so serialization isn't strictly necessary for the passed props.
  // However, it's good practice to be aware of what is being passed.

  return <UnitsPageClient listing={listing} />;
}
