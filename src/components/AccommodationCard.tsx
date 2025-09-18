// src/components/AccommodationCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Star } from 'lucide-react';
import type { Accommodation } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/context/FavoritesContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { convertCurrency, formatCurrency } from '@/lib/currency';

type AccommodationCardProps = {
  accommodation: Accommodation;
  searchParams?: { [key: string]: string | string[] | undefined };
};

const AccommodationCard = ({ accommodation, searchParams }: AccommodationCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { preferences } = useUserPreferences();
  const favorite = isFavorite(accommodation.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(accommodation.id);
    } else {
      addFavorite(accommodation.id);
    }
  };

  const queryString = searchParams
    ? new URLSearchParams(searchParams as Record<string, string>).toString()
    : '';
  const detailUrl = `/accommodation/${accommodation.id}${queryString ? `?${queryString}` : ''}`;

  const convertedPrice = convertCurrency(
    accommodation.price,
    accommodation.currency,
    preferences.currency
  );
  const formattedPrice = formatCurrency(convertedPrice.toFixed(0), preferences.currency);

  return (
    <Card className="w-full h-full overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <CardHeader className="p-0">
        <Link
          href={detailUrl}
          className="block"
          aria-label={`View details for ${accommodation.name}`}
        >
          <div className="relative aspect-video">
            <Image
              src={accommodation.image}
              alt={accommodation.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
              data-ai-hint={accommodation.imageHint}
            />
            <div className="absolute bottom-3 left-3">
              <div className="bg-black/60 text-white px-2 py-0.5 rounded-sm">
                <span className="text-base font-bold">{formattedPrice}</span>
                <span className="text-xs">/night</span>
              </div>
            </div>
          </div>
        </Link>
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white z-10"
          onClick={toggleFavorite}
          aria-label={favorite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            className={cn(
              'h-5 w-5 text-black/50 transition-colors',
              favorite && 'fill-red-500 text-red-500'
            )}
          />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl font-bold leading-tight">
          <Link href={detailUrl} className="hover:text-primary transition-colors">
            {accommodation.name}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm mt-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {accommodation.location}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm font-bold text-foreground">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span>{accommodation.rating.toFixed(1)}</span>
        </div>
        <Button asChild>
          <Link href={detailUrl}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccommodationCard;
