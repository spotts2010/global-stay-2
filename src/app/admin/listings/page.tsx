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

// Define the placeholder image URL
const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/1/64/64';

export default async function AdminListingsPage() {
  const properties: Accommodation[] = await fetchAccommodations();

  // Sanitize properties on the server to ensure valid image URLs
  const serializableProperties = properties.map((p) => {
    // Determine the cover image. Use the first valid image, or the placeholder.
    const coverImage =
      p.images && p.images.length > 0 && p.images[0] ? p.images[0] : PLACEHOLDER_IMAGE;

    return {
      ...p,
      // Ensure lastModified is a serializable string
      lastModified: isTimestamp(p.lastModified)
        ? p.lastModified.toDate().toISOString()
        : new Date().toISOString(),
      // Set the main `image` prop to a guaranteed valid URL for the client component.
      image: coverImage,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutList className="h-6 w-6 text-primary" />
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
