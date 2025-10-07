'use client';

import React, { Suspense } from 'react';
import type { Accommodation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ListingsPageClient from '@/components/ListingsPageClient';
import { MdOutlineList } from 'react-icons/md';
import { BiLoaderAlt } from 'react-icons/bi';

const LoadingSpinner = () => (
  <div className="flex h-64 items-center justify-center">
    <BiLoaderAlt className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// This is a placeholder for the actual data fetching that happens on the server.
// The props will be passed down from a Server Component parent.
type AdminListingsPageProps = {
  initialProperties: Accommodation[];
};

export default function AdminListingsPage({ initialProperties }: AdminListingsPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MdOutlineList className="h-6 w-6 text-primary" />
          Manage Listings
        </CardTitle>
        <CardDescription>View, edit, or change status of accommodation listings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoadingSpinner />}>
          <ListingsPageClient initialProperties={initialProperties} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
