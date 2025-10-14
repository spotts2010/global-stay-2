// src/app/results/page.tsx
import 'server-only';
import { Suspense } from 'react';
import { fetchAccommodations } from '@/lib/firestore.server';
import ResultsPageClient from '@/components/ResultsPageClient';
import { Loader2 } from '@/lib/icons';
import { Accommodation } from '@/lib/data';

// This is now a SERVER component responsible for data fetching
export default async function ResultsPage() {
  // Fetch only published accommodations with correct pricing from the server
  const initialAccommodations: Accommodation[] = await fetchAccommodations({ publishedOnly: true });

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <ResultsPageClient initialAccommodations={initialAccommodations} />
    </Suspense>
  );
}
