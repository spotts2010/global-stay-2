// src/app/admin/listings/[id]/edit/users/page.tsx
import 'server-only';

import UsersPageClient from '@/components/UsersPageClient';
import { fetchAccommodationById } from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UsersPage({ params }: PageProps) {
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

  return <UsersPageClient listing={listing} />;
}
