// src/app/admin/listings/page.tsx
import 'server-only';
import { Suspense } from 'react';
import { fetchAccommodations } from '@/lib/firestore.server';
import type { Accommodation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ListingsPageClient from '@/components/ListingsPageClient';
import { BiLoaderAlt, ListingsIcon } from '@/lib/icons';

const LoadingSpinner = () => (
  <div className="flex h-64 items-center justify-center">
    <BiLoaderAlt className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// This is now a Server Component that fetches data
export default async function AdminListingsPage() {
  // Fetch ALL accommodations for the admin view
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
        <Suspense fallback={<LoadingSpinner />}>
          <ListingsPageClient initialProperties={accommodations} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
