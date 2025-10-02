// src/app/admin/listings/[id]/edit/schedule/page.tsx
import 'server-only';
import SchedulePageClient from '@/components/SchedulePageClient';
import { fetchAccommodationById } from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SchedulePage({ params }: { params: { id: string } }) {
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

  return <SchedulePageClient listing={listing} />;
}
