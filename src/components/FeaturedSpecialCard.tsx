// src/components/FeaturedSpecialCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MapPin } from 'lucide-react';
import type { Accommodation } from '@/lib/data';

type FeaturedSpecialCardProps = {
  accommodation: Accommodation;
};

const FeaturedSpecialCard = ({ accommodation }: FeaturedSpecialCardProps) => {
  return (
    <Card className="h-full overflow-hidden group transition-all duration-300 hover:shadow-xl">
      <Link
        href={`/accommodation/${accommodation.id}`}
        className="block w-full h-full"
        aria-label={`View details for ${accommodation.name}`}
      >
        <div className="relative h-full">
          <div className="relative h-[60%] w-full">
            <Image
              src={accommodation.image}
              alt={accommodation.name}
              fill
              sizes="(max-width: 1024px) 50vw, 100vw"
              className="object-cover"
              data-ai-hint={accommodation.imageHint}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="font-headline text-2xl font-bold">{accommodation.name}</h3>
            <div className="flex items-center gap-1 text-sm mt-1 text-white/90">
              <MapPin className="h-4 w-4" />
              {accommodation.location}
            </div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-xs">Starts from</p>
                <p>
                  <span className="text-2xl font-bold">${accommodation.price}</span>
                  <span className="text-white/90">/night</span>
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-white/90 text-black hover:bg-white transition-transform duration-300 group-hover:scale-105"
              >
                View Deal
              </Button>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
};

export default FeaturedSpecialCard;
