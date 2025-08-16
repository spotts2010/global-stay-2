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

type AccommodationCardProps = {
  accommodation: Accommodation;
};

const AccommodationCard = ({ accommodation }: AccommodationCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
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

  return (
    <Card className="w-full overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <CardHeader className="p-0">
        <Link
          href={`/accommodation/${accommodation.id}`}
          className="block"
          aria-label={`View details for ${accommodation.name}`}
        >
          <div className="relative aspect-video">
            <Image
              src={accommodation.image}
              alt={accommodation.name}
              fill
              className="object-cover"
              data-ai-hint={accommodation.imageHint}
            />
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
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl font-bold leading-tight">
            <Link
              href={`/accommodation/${accommodation.id}`}
              className="hover:text-primary transition-colors"
            >
              {accommodation.name}
            </Link>
          </CardTitle>
          <div className="flex items-center gap-1 text-sm font-bold text-foreground shrink-0 pl-2">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>{accommodation.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm mt-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {accommodation.location}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold text-primary">${accommodation.price}</span>
          <span className="text-sm text-muted-foreground">/night</span>
        </div>
        <Button asChild>
          <Link href={`/accommodation/${accommodation.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccommodationCard;
