'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building, Loader2 } from 'lucide-react';
import { Suspense, useMemo, useState, useEffect } from 'react';

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
import { Card, CardContent } from '@/components/ui/card';

type HomeContentProps = {
  initialAccommodations: Accommodation[];
};

const defaultHeroImage: HeroImage = {
  url: 'https://images.unsplash.com/photo-1460627390041-532a28402358',
  alt: 'A tropical bungalow over clear water',
  hint: 'tropical resort',
};

export default function HomeContent({ initialAccommodations }: HomeContentProps) {
  const [accommodations, _setAccommodations] = useState<Accommodation[]>(initialAccommodations);
  const [loading, _setLoading] = useState(false);
  const [selectedHeroImage, setSelectedHeroImage] = useState<HeroImage | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const heroImages = placeholderImages.heroImages;
  const collections: Collection[] = placeholderImages.collections;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && heroImages && heroImages.length > 0) {
      setSelectedHeroImage(heroImages[0]);
    } else if (hasMounted) {
      setSelectedHeroImage(defaultHeroImage);
    }
  }, [hasMounted, heroImages]);

  useEffect(() => {
    if (hasMounted && heroImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * heroImages.length);
      setSelectedHeroImage(heroImages[randomIndex]);
    }
  }, [hasMounted, heroImages]);

  const topRatedAccommodations: Accommodation[] = useMemo(
    () => [...accommodations].sort((a, b) => b.rating - a.rating),
    [accommodations]
  );

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white bg-black"
        aria-labelledby="hero-heading"
      >
        {hasMounted && selectedHeroImage ? (
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
              <div className="w-full max-w-4xl mt-4 shadow-lg rounded-lg">
                <Suspense fallback={<div className="h-14 bg-white rounded-lg" />}>
                  <AccommodationSearchForm />
                </Suspense>
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
              View All <ArrowRight className="ml-2 h-4 w-4" />
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
            <Card className="h-full overflow-hidden group transition-all duration-300 hover:shadow-xl">
              <div className="relative h-full">
                <div className="relative h-full w-full min-h-[400px]">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
                    alt="A smiling couple handing keys over a table"
                    data-ai-hint="smiling couple keys"
                    fill
                    sizes="(max-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-headline text-2xl font-bold max-w-md">
                    Manage your listings with ease, so you can feel like you're on holiday too.
                  </h3>
                  <Button asChild className="mt-4">
                    <Link href="/admin/listings">List Your Property</Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
