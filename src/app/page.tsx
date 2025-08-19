// src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';

import { collections, type Collection } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AccommodationSearchForm from '@/components/AccommodationSearchForm';
import CuratedCollectionCard from '@/components/CuratedCollectionCard';
import AccommodationCard from '@/components/AccommodationCard';
import AIRecommendations from '@/components/AIRecommendations';
import { fetchAccommodations } from '@/lib/firestore';
import type { Accommodation } from '@/lib/data';

export default async function Home() {
  const accommodations: Accommodation[] = await fetchAccommodations();

  // Explicit typing for better DX
  const topRatedAccommodations: Accommodation[] = [...accommodations].sort(
    (a, b) => b.rating - a.rating
  );

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="A luxurious hotel lobby interior with modern decor"
          data-ai-hint="hotel lobby"
          fill
          priority
          className="z-0 object-cover"
        />
        <div className="relative z-20 flex flex-col items-center gap-6 px-4">
          <h1
            id="hero-heading"
            className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            Find Your Next Stay
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-primary-foreground/90">
            Unforgettable properties for your next holiday or business trip. Discover a place
            you&apos;ll love to stay.
          </p>

          {/* Search form with shadow + rounded corners, no background or padding */}
          <div className="w-full max-w-4xl mt-4 shadow-lg rounded-lg">
            <AccommodationSearchForm />
          </div>
        </div>
      </section>

      {/* Curated Collections Section */}
      <section className="container mx-auto px-4 md:px-6" aria-labelledby="collections-heading">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 id="collections-heading" className="font-headline text-3xl md:text-4xl font-bold">
              Explore Our Collections
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Discover accommodations perfectly tailored to your travelling style, from urban lofts
              to secluded beach houses.
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="mt-4 md:mt-0"
            aria-label="View all collections"
          >
            <Link href="/collections">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection: Collection) => (
            <CuratedCollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Top-rated Stays Section */}
      <section className="container mx-auto px-4 md:px-6" aria-labelledby="top-rated-heading">
        <h2
          id="top-rated-heading"
          className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          Top-rated Stays
        </h2>
        {accommodations.length === 0 ? (
          <div className="text-center text-destructive">
            Could not load top-rated stays. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topRatedAccommodations.slice(0, 8).map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
        )}
      </section>

      {/* AI & Map Section */}
      <section className="container mx-auto px-4 md:px-6" aria-labelledby="personalised-heading">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* AI Recommendations */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="h-8 w-8" aria-hidden="true" />
              <h2
                id="personalised-heading"
                className="font-headline text-3xl md:text-4xl font-bold"
              >
                Personalised for You
              </h2>
            </div>
            <p className="text-muted-foreground">
              Our AI can help you find the perfect stay based on your unique tastes. Tell us what
              you&apos;re looking for, and we&apos;ll do the rest.
            </p>
            <AIRecommendations />
          </div>

          {/* Map */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary">
              <MapPin className="h-8 w-8" aria-hidden="true" />
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Explore the Area</h2>
            </div>
            <p className="text-muted-foreground">
              Discover accommodations in your desired location with our interactive map.
            </p>
            <Card className="overflow-hidden h-[400px] lg:h-full">
              <Image
                src="https://placehold.co/800x600.png"
                alt="Map preview showing accommodations in a city area"
                data-ai-hint="world map"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
