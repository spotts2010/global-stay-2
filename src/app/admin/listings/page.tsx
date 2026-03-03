// src/app/admin/listings/page.tsx

import 'server-only';
import { fetchAccommodations } from '@/lib/firestore.server';
import type { Accommodation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ListingsClientLoader from '@/components/admin/listings/listings-client-loader';
import { ListingsIcon } from '@/lib/icons';

// This is now a Server Component that fetches data
export default async function AdminListingsPage() {
  const accommodations: Accommodation[] = await fetchAccommodations({ publishedOnly: false });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListingsIcon className="h-6 w-6 text-primary" />
          Manage Listings
        </CardTitle>
        <CardDescription>View, edit, or change status of accommodation listings.</CardDescription>
      </CardHeader>
      <CardContent>
        <ListingsClientLoader initialProperties={accommodations} />
      </CardContent>
    </Card>
  );
}
