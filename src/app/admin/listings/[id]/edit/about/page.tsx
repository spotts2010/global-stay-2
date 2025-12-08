// src/app/admin/listings/[id]/edit/about/page.tsx
import 'server-only';
import { fetchAccommodationById } from '@/lib/firestore.server';
import AboutPageClient from '@/components/AboutPageClient';
import type { Accommodation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { use } from 'react';

// This is now a SERVER component responsible for data fetching
export default function AboutPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
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

  // We need to await the fetch inside the component body now
  const accommodationData = use(fetchAccommodationById(id));

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
