import Image from 'next/image';
import {
  ArrowRight,
  BedDouble,
  Building,
  MapPin,
  Sparkles,
} from 'lucide-react';

import { accommodations, collections } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AccommodationSearchForm from '@/components/AccommodationSearchForm';
import CuratedCollectionCard from '@/components/CuratedCollectionCard';
import AccommodationCard from '@/components/AccommodationCard';
import AIRecommendations from '@/components/AIRecommendations';

export default function Home() {
  const topRatedAccommodations = [...accommodations].sort(
    (a, b) => b.rating - a.rating
  );

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Luxury hotel lobby"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint="hotel lobby"
        />
        <div className="relative z-20 flex flex-col items-center gap-6 px-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Find Your Next Stay
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-primary-foreground/90">
            Unforgettable properties for your next vacation or business trip.
            Discover a place you'll love to stay.
          </p>
          <Card className="w-full max-w-4xl mt-4">
            <CardContent className="p-4 md:p-6">
              <AccommodationSearchForm />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Curated Collections Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Explore Our Collections
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Discover accommodations perfectly tailored to your travel style,
              from urban lofts to secluded beach houses.
            </p>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <CuratedCollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Top-rated Stays Section */}
      <section className="container mx-auto px-4 md:px-6">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">
          Top-rated Stays
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topRatedAccommodations.slice(0, 8).map((accommodation) => (
            <AccommodationCard
              key={accommodation.id}
              accommodation={accommodation}
            />
          ))}
        </div>
      </section>

      {/* AI & Map Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="h-8 w-8" />
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                Personalized for You
              </h2>
            </div>
            <p className="text-muted-foreground">
              Our AI can help you find the perfect stay based on your unique
              tastes. Tell us what you're looking for, and we'll do the rest.
            </p>
            <AIRecommendations />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary">
              <MapPin className="h-8 w-8" />
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                Explore the Area
              </h2>
            </div>
            <p className="text-muted-foreground">
              Discover accommodations in your desired location with our interactive map.
            </p>
            <Card className="overflow-hidden h-[400px] lg:h-full">
               <Image
                src="https://placehold.co/800x600.png"
                alt="Map of accommodations"
                width={800}
                height={600}
                className="w-full h-full object-cover"
                data-ai-hint="world map"
              />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
