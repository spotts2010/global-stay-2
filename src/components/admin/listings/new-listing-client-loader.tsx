// src/components/admin/listings/new-listing-client-loader.tsx
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

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

const NewListingPageClient = dynamic(() => import('@/components/NewListingPageClient'), {
  ssr: false,
  loading: () => <NewListingSkeleton />,
});

export default function NewListingClientLoader() {
  return <NewListingPageClient />;
}
