// src/app/page.tsx
import 'server-only';
import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import { Loader2 } from '@/lib/icons';
import { fetchAccommodations } from '@/lib/firestore.server';
import { Collection, Accommodation } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';

// This is now a SERVER component that passes initial data to the client.
export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Fetch initial data on the server.
  const accommodations: Accommodation[] = await fetchAccommodations({ publishedOnly: true });
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
        searchParams={searchParams}
      />
    </Suspense>
  );
}
