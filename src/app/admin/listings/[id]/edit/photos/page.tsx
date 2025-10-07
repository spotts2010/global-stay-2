// src/app/admin/listings/[id]/edit/photos/page.tsx
import 'server-only';
import type { Accommodation } from '@/lib/data';
import { fetchAccommodationById } from '@/lib/firestore.server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhotosPageClient from '@/components/PhotosPageClient';
import React from 'react';

interface PhotosPageProps {
  params: {
    id: string;
  };
}

export default async function PhotosPage({ params }: PhotosPageProps) {
  const { id } = params;

  // Early return if no ID
  if (!id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No listing ID provided.</p>
        </CardContent>
      </Card>
    );
  }

  // Fetch the listing data
  let listing: Accommodation | null = null;
  try {
    listing = await fetchAccommodationById(id);
  } catch (error) {
    console.error('Error fetching listing:', error);
  }

  if (!listing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Listing not found or could not be loaded.</p>
        </CardContent>
      </Card>
    );
  }

  // Render the client component responsible for uploads
  return <PhotosPageClient listing={listing} />;
}
