// src/app/page.tsx
import 'server-only';
import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import { Loader2 } from '@/lib/icons';
import { fetchHomepageAccommodations } from '@/lib/firestore.server';
import type { Collection, Accommodation } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';

type SearchParams = Record<string, string | string[] | undefined>;

// This is now a SERVER component that passes initial data to the client.
export default async function Home({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const resolvedSearchParams = (await searchParams) ?? {};

  // Fetch initial data on the server.
  const accommodations: Accommodation[] = await fetchHomepageAccommodations({ limit: 12 });
  const collections: Collection[] = placeholderImages.collections;

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <HomeContent
        initialAccommodations={accommodations}
        initialCollections={collections}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}
