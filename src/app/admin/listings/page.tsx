
// src/app/admin/listings/page.tsx
import { Suspense } from 'react';
import { fetchAccommodations } from '@/lib/firestore.server';
import type { Accommodation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LayoutList, Loader2 } from 'lucide-react';
import ListingsPageClient from '@/components/ListingsPageClient';

function isTimestamp(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  );
}

export default async function AdminListingsPage() {
  const properties: Accommodation[] = await fetchAccommodations();

  // Convert Firestore Timestamps to serializable ISO strings before passing to client.
  const serializableProperties = properties.map((p) => ({
    ...p,
    lastModified: isTimestamp(p.lastModified)
      ? p.lastModified.toDate().toISOString()
      : new Date().toISOString(),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutList className="h-6 w-6" />
          Manage Listings
        </CardTitle>
        <CardDescription>View, edit, or change status of accommodation listings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <ListingsPageClient
            initialProperties={serializableProperties as unknown as Accommodation[]}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
