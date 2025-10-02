'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { Accommodation } from '@/lib/data';
import { fetchAccommodationById } from '@/lib/firestore';
import { useParams } from 'next/navigation';

// Dynamically import the client component that uses react-beautiful-dnd
const PhotosPageClient = dynamic(() => import('@/components/PhotosPageClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

export default function PhotosPage() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      try {
        const data = await fetchAccommodationById(id);
        if (data) {
          setListing(data);
        } else {
          setError('Listing not found.');
        }
      } catch (err) {
        setError('Failed to load listing data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadListing();
    }
  }, [id]);

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
        <p>{error || 'An unknown error occurred.'}</p>
      </div>
    );
  }

  // The PhotosPageClient component is now rendered dynamically on the client side only
  return <PhotosPageClient listing={listing} />;
}
