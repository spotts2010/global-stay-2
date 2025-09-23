'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Loader2, Map } from 'lucide-react';
import React, { useState, useEffect, use } from 'react';
import type { Accommodation } from '@/lib/data';
import { fetchAccommodationById } from '@/lib/firestore';

function PoisPageClient({ listing }: { listing: Accommodation }) {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Points of Interest' },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Places & Points of Interest
          </CardTitle>
          <CardDescription>
            Add nearby attractions, restaurants, and transport links to help guests explore the
            area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg">
            <p>This feature is currently being rebuilt. Please check back soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PoisPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const [listing, setListing] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const listingData = await fetchAccommodationById(resolvedParams.id);
        if (listingData) {
          setListing(listingData);
        } else {
          setError('Listing not found.');
        }
      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center text-destructive">
        <h1 className="font-bold text-2xl">Error</h1>
        <p>{error}</p>
      </div>
    );
  }
  return <PoisPageClient listing={listing} />;
}
