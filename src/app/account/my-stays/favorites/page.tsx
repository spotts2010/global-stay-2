// src/app/account/my-stays/favorites/page.tsx

'use client';

import { useEffect, useState } from 'react';
import AccommodationCard from '@/components/AccommodationCard';
import { useFavorites } from '@/context/FavoritesContext';
import { Heart } from '@/lib/icons';
import { fetchAccommodationById } from '@/lib/firestore';
import type { Accommodation } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccommodations = async () => {
      setLoading(true);
      const favoriteAccommodations = (
        await Promise.all(favorites.map((id) => fetchAccommodationById(id)))
      ).filter((a): a is Accommodation => a !== null);
      setAccommodations(favoriteAccommodations);
      setLoading(false);
    };

    if (favorites.length > 0) {
      loadAccommodations();
    } else {
      setLoading(false);
    }
  }, [favorites]);

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl">Your Saved Places</CardTitle>
          <CardDescription>A collection of places you've saved for future trips.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading saved places...</div>
        ) : accommodations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {accommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
            <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="font-headline text-2xl font-bold">No Saved Places Yet</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Click the heart icon on any listing to save it here for later.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
