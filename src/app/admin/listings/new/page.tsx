// src/app/admin/listings/new/page.tsx
import 'server-only';
import { Suspense } from 'react';
import NewListingPageClient from '@/components/NewListingPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import { APIProvider } from '@vis.gl/react-google-maps';

function NewListingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function NewListingPage() {
  return (
    <Suspense fallback={<NewListingSkeleton />}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <NewListingPageClient />
      </APIProvider>
    </Suspense>
  );
}
