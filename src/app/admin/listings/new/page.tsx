// src/app/admin/listings/new/page.tsx
'use client';

import { ArrowLeft } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import NewListingClient from '@/components/NewListingClient';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NewListingPage() {
  const searchParams = useSearchParams();
  const backLink = `/admin/listings?${searchParams.toString()}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Create New Listing</h1>
          <p className="text-sm text-muted-foreground">
            Fill out the form to add a new accommodation to your listings.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={backLink}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Link>
        </Button>
      </div>
      <NewListingClient />
    </div>
  );
}
