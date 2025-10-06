// src/app/admin/listings/[id]/edit/about/page.tsx
import 'server-only';
import { fetchAccommodationById } from '@/lib/firestore.server';
import AboutPageClient from '@/components/AboutPageClient';
import type { Accommodation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This is now a SERVER component responsible for data fetching
export default async function AboutPage({ params }: { params: { id: string } }) {
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

  // Data is already serialized by the fetching function
  const accommodationData = await fetchAccommodationById(params.id);

  if (!accommodationData) {
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

  return <AboutPageClient listing={accommodationData as Accommodation} />;
}
