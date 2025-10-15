// src/components/HomeContent.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Sparkles, Building, Loader2 } from '@/lib/icons';
import { useMemo, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import AccommodationSearchForm from '@/components/AccommodationSearchForm';
import CuratedCollectionCard from '@/components/CuratedCollectionCard';
import AccommodationCard from '@/components/AccommodationCard';
import AIRecommendations from '@/components/AIRecommendations';
import type { Accommodation, HeroImage, Collection } from '@/lib/data';
import placeholderImages from '@/lib/placeholder-images.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const defaultHeroImage: HeroImage = {
  url: 'https://images.unsplash.com/photo-1460627390041-532a28402358',
  alt: 'A tropical bungalow over clear water',
  hint: 'tropical resort',
};

const heroImages = placeholderImages.heroImages || [defaultHeroImage];

export default function HomeContent({
  initialAccommodations,
  initialCollections,
  searchParams,
}: {
  initialAccommodations: Accommodation[];
  initialCollections: Collection[];
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [accommodations, setAccommodations] = useState<Accommodation[]>(initialAccommodations);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [loading, setLoading] = useState(false); // Data is now pre-loaded
  const [selectedHeroImage, setSelectedHeroImage] = useState<HeroImage | null>(null);

  const plainSearchParams: { [key: string]: string } = {};
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value === 'string') {
        plainSearchParams[key] = value;
      }
    }
  }

  useEffect(() => {
    setAccommodations(initialAccommodations);
    setCollections(initialCollections);
    setLoading(false);

    if (heroImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * heroImages.length);
      setSelectedHeroImage(heroImages[randomIndex]);
    } else {
      setSelectedHeroImage(defaultHeroImage);
    }
  }, [initialAccommodations, initialCollections]);

  const topRatedAccommodations: Accommodation[] = useMemo(() => {
    const published = accommodations.filter((a) => a.status === 'Published');
    return [...published].sort((a, b) => b.rating - a.rating);
  }, [accommodations]);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white bg-black"
        aria-labelledby="hero-heading"
      >
        {selectedHeroImage ? (
          <>
            <Image
              src={selectedHeroImage.url || defaultHeroImage.url}
              alt={selectedHeroImage.alt}
              data-ai-hint={selectedHeroImage.hint}
              fill
              sizes="100vw"
              priority
              className="z-0 object-cover"
              onError={() => setSelectedHeroImage(defaultHeroImage)}
            />
            <div className="absolute inset-0 bg-black/50 z-10" />
            <div className="relative z-20 flex flex-col items-center gap-6 px-4 w-full max-w-7xl">
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
              <div className="w-full mt-4 shadow-lg rounded-lg">
                <AccommodationSearchForm searchParams={plainSearchParams} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
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
              View All <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {collections.map((collection: Collection) => (
              <CarouselItem key={collection.id} className="basis-full sm:basis-1/2 lg:basis-1/4">
                <div className="p-1 h-full">
                  <CuratedCollectionCard collection={collection} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
        </Carousel>
      </section>

      {/* Top-rated Stays Section */}
      <section className="container mx-auto px-4 md:px-6" aria-labelledby="top-rated-heading">
        <h2
          id="top-rated-heading"
          className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          Top-rated Stays
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : accommodations.length === 0 ? (
          <div className="text-center text-destructive">
            Could not load top-rated stays. Please try again later.
          </div>
        ) : (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {topRatedAccommodations.map((accommodation) => (
                <CarouselItem
                  key={accommodation.id}
                  className="basis-full sm:basis-1/2 lg:basis-1/4"
                >
                  <div className="p-1 h-full">
                    <AccommodationCard accommodation={accommodation} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          </Carousel>
        )}
      </section>

      {/* AI & Host Section */}
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
              you're looking for, and we will do the rest.
            </p>
            <AIRecommendations />
          </div>

          {/* List Your Property Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary">
              <Building className="h-8 w-8" aria-hidden="true" />
              <h2 className="font-headline text-3xl md:text-4xl font-bold">List Your Property</h2>
            </div>
            <p className="text-muted-foreground">
              Turn your space into your next opportunity. Join our community of hosts today.
            </p>
            <div className="h-full overflow-hidden group transition-all duration-300 hover:shadow-xl rounded-lg">
              <div className="relative h-full">
                <div className="relative h-full w-full min-h-[400px]">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/global-stay-20.firebasestorage.app/o/images%2F1760332686919.png?alt=media&token=de319530-ae6c-449c-9e24-f3c4431d6b34"
                    alt="A person working on a laptop in a modern apartment."
                    data-ai-hint="person laptop"
                    fill
                    sizes="(max-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-headline text-2xl font-bold max-w-md">
                    Manage your listings with ease, so you can feel like you're on holiday too.
                  </h3>
                  <Button asChild className="mt-4">
                    <Link href="/admin/listings">List Your Property</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
