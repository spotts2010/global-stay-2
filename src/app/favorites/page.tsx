'use client';

import AccommodationCard from '@/components/AccommodationCard';
import { useFavorites } from '@/context/FavoritesContext';
import { accommodations } from '@/lib/data';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const favoriteAccommodations = accommodations.filter((acc) => favorites.includes(acc.id));

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 pb-16">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Your Favourites</h1>
        <p className="text-muted-foreground mt-2 text-lg">A collection of places you've saved.</p>
      </div>

      {favoriteAccommodations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteAccommodations.map((accommodation) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
          <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="font-headline text-2xl font-bold">No Favourites Yet</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            Click the heart icon on any listing to save it here for later.
          </p>
        </div>
      )}
    </div>
  );
}
