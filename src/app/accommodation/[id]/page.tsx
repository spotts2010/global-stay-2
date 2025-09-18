'use client';

import Image from 'next/image';
import {
  Star,
  MapPin,
  Wifi as _Wifi,
  Car as _Car,
  Utensils as _Utensils,
  Award,
  Users as _Users,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PhotoGallery from '@/components/PhotoGallery';
import AmenityIcon from '@/components/AmenityIcon';
import ReviewCard from '@/components/ReviewCard';
import { Separator } from '@/components/ui/separator';
import { fetchAccommodationById } from '@/lib/firestore';
import type { Accommodation } from '@/lib/data';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { convertCurrency, formatCurrency, getCurrencySymbol } from '@/lib/currency';

export default function AccommodationDetailPage({ params }: { params: { id: string } }) {
  const id = use(params);
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const { preferences } = useUserPreferences();

  useEffect(() => {
    const getAccommodation = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await fetchAccommodationById(id.id);
        setAccommodation(data);
      } catch (e) {
        console.error(`Failed to fetch accommodation for id ${id.id}:`, e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getAccommodation();
  }, [id.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center pb-16">
        <h1 className="font-headline text-2xl font-bold text-destructive">An Error Occurred</h1>
        <p className="text-muted-foreground mt-2">
          We couldn&apos;t load the accommodation details. Please try again later.
        </p>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center pb-16">
        <h1 className="font-headline text-2xl font-bold">Accommodation not found</h1>
        <p className="text-muted-foreground mt-2">
          The listing you are looking for does not exist or has been moved.
        </p>
      </div>
    );
  }

  // TODO: Replace with dynamic reviews from Firestore
  const reviews = [
    {
      id: 'r1',
      author: 'Jane Doe',
      rating: 5,
      comment:
        "Absolutely stunning villa with breathtaking views. The pool was amazing and the host was very accommodating. Can't wait to come back!",
    },
    {
      id: 'r2',
      author: 'John Smith',
      rating: 4,
      comment:
        'Great location and very clean. The apartment had everything we needed for a comfortable stay in the city.',
    },
  ];

  const cleanSearchParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (value) {
      cleanSearchParams[key] = value;
    }
  }

  const resultsLink = `/results?${new URLSearchParams(cleanSearchParams).toString()}`;

  const convertedPrice = convertCurrency(
    accommodation.price,
    accommodation.currency,
    preferences.currency
  );

  const currencySymbol = getCurrencySymbol(preferences.currency);

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 pb-16">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={resultsLink}>Show Results</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{accommodation.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PhotoGallery
        images={accommodation.images.length > 0 ? accommodation.images : [accommodation.image]}
        imageHints={[accommodation.imageHint, 'living room', 'bedroom', 'bathroom', 'exterior']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-8">
        <div className="lg:col-span-2">
          {/* Header Section */}
          <div className="pb-4 border-b">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{accommodation.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{accommodation.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>
                  {accommodation.rating} ({accommodation.reviewsCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>{accommodation.type}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Amenities Section */}
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="font-headline text-2xl font-bold mb-4">Amenities</h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">{currencySymbol}</span> = Additional fees
                may apply
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accommodation.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3">
                  <AmenityIcon amenity={amenity} />
                  <span className="capitalize">{amenity}</span>
                  {accommodation.chargeableAmenities?.includes(amenity) && (
                    <span className="font-bold text-primary">{currencySymbol}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Location & Map Section */}
          <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Location</h2>
            <div className="aspect-video rounded-lg overflow-hidden border">
              <Image
                src="https://placehold.co/800x450.png"
                alt="Map showing accommodation location"
                width={800}
                height={450}
                className="w-full h-full object-cover"
                data-ai-hint="map location"
              />
            </div>
            <p className="text-muted-foreground mt-2">{accommodation.location}</p>
          </div>

          <Separator className="my-6" />

          {/* Reviews Section */}
          <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(convertedPrice, preferences.currency)}
                </span>
                <span className="text-muted-foreground">/ night</span>
              </div>
              <Button className="w-full text-lg" size="lg">
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
