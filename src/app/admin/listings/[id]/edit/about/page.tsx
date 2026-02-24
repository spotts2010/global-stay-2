// src/app/admin/listings/[id]/edit/about/page.tsx
import 'server-only';

import AboutPageClient from '@/components/AboutPageClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Accommodation } from '@/lib/data';
import { fetchAccommodationById } from '@/lib/firestore.server';

type PageProps = {
  params: Promise<{ id: string }>;
};

// SERVER component responsible for data fetching
export default async function AboutPage({ params }: PageProps) {
  const { id } = await params;

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

  const accommodationData = await fetchAccommodationById(id);

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
