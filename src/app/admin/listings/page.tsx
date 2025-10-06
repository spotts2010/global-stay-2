// src/app/admin/listings/page.tsx
import { Suspense } from 'react';
import { fetchAccommodations } from '@/lib/firestore.server';
import type { Accommodation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LayoutList, Loader2 } from 'lucide-react';
import ListingsPageClient from '@/components/ListingsPageClient';

// Define the placeholder image URL
const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/1/64/64';

export default async function AdminListingsPage() {
  // Data is already serialized by the fetching function
  const properties: Accommodation[] = await fetchAccommodations();

  // Sanitize properties on the server to ensure valid image URLs
  const sanitizedProperties = properties.map((p) => {
    // Determine the cover image. Use the first valid image, or the placeholder.
    const coverImage =
      p.images && p.images.length > 0 && p.images[0] ? p.images[0] : PLACEHOLDER_IMAGE;
    return { ...p, image: coverImage };
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
            initialProperties={sanitizedProperties as unknown as Accommodation[]}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
