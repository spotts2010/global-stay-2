// src/components/NewListingPageClient.tsx
'use client';

import { ArrowLeft } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import NewListingClient from '@/components/NewListingClient';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

function BackButton() {
  const searchParams = useSearchParams();
  const backLink = `/admin/listings?${searchParams.toString()}`;
  return (
    <Button asChild variant="outline">
      <Link href={backLink}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Listings
      </Link>
    </Button>
  );
}

export default function NewListingPageClient() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Create New Listing</h1>
          <p className="text-sm text-muted-foreground">
            Fill out the form to add a new accommodation to your listings.
          </p>
        </div>
        <Suspense>
          <BackButton />
        </Suspense>
      </div>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <NewListingClient />
      </APIProvider>
    </div>
  );
}
