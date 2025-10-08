'use client';

import {
  Star,
  MapPin,
  Hotel,
  MdOutlinePrivacyTip,
  Banknote,
  Ban,
  Wifi,
  Waves,
  Dumbbell,
  Car,
  Utensils,
  Accessibility,
} from '@/lib/icons';
import { APIProvider, Map as GoogleMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhotoGallery from '@/components/PhotoGallery';
import ReviewCard from '@/components/ReviewCard';
import { Separator } from '@/components/ui/separator';
import type { Accommodation, Place } from '@/lib/data';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// --- Helper Functions & Components ---

const FeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" fill="#2682CE" stroke="#2682CE" strokeWidth="1.5" />
    <path
      d="M16 8h-6c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2 .9 2 2s-.9 2-2 2H8"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 18V6"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const getPropertyTypeLabel = (starRating: number | undefined, type: string) => {
  if (starRating && starRating > 0) {
    return `${starRating}-star ${type}`;
  }
  return type;
};

type SortOption = 'distance' | 'category' | 'a-z' | 'z-a';

const PointsOfInterestDisplay = ({
  places,
  distanceUnit,
}: {
  places: Place[];
  distanceUnit: 'km' | 'miles';
}) => {
  const [sort, setSort] = useState<SortOption>('distance');
  const [showAll, setShowAll] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const sortedPlaces = useMemo(() => {
    const visiblePlaces = places.filter((p) => p.visible);
    switch (sort) {
      case 'category':
        return visiblePlaces.sort((a, b) => {
          if (a.category < b.category) return -1;
          if (a.category > b.category) return 1;
          return (a.distance ?? Infinity) - (b.distance ?? Infinity);
        });
      case 'a-z':
        return [...visiblePlaces].sort((a, b) => a.name.localeCompare(b.name));
      case 'z-a':
        return [...visiblePlaces].sort((a, b) => b.name.localeCompare(a.name));
      case 'distance':
      default:
        return [...visiblePlaces].sort(
          (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
        );
    }
  }, [places, sort]);

  const placesToShow = sort === 'distance' && !showAll ? sortedPlaces.slice(0, 10) : sortedPlaces;

  let lastCategory = '';

  if (places.length === 0) {
    return <p className="text-muted-foreground">No points of interest have been added yet.</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="font-headline text-2xl font-bold">Points of Interest</h2>
        {hasMounted && (
          <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[200px] bg-card">
              <SelectValue placeholder="View by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Distance (nearest)</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {placesToShow.map((place) => {
          const showCategoryHeader = sort === 'category' && place.category !== lastCategory;
          lastCategory = place.category;
          return (
            <React.Fragment key={place.id}>
              {showCategoryHeader && (
                <h4 className="font-semibold text-primary mt-4 md:col-span-2">{place.category}</h4>
              )}
              <div className="flex justify-between items-center text-sm">
                <span>
                  {place.name}{' '}
                  <span className="text-muted-foreground">
                    ({place.distance?.toFixed(1)} {distanceUnit})
                  </span>
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {sort === 'distance' && sortedPlaces.length > 10 && (
        <div className="mt-4">
          <Button variant="link" className="p-0 h-auto" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : 'Show More'}
          </Button>
        </div>
      )}
    </div>
  );
};

const PoliciesSection = ({ accommodation }: { accommodation: Accommodation }) => {
  const { paymentTerms, cancellationPolicy, houseRules } = accommodation;

  const hasPolicies = paymentTerms || cancellationPolicy || houseRules;

  if (!hasPolicies) {
    return null;
  }

  return (
    <div>
      <h2 className="font-headline text-2xl font-bold mb-4">Policies &amp; Terms</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentTerms && (
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <Banknote className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{paymentTerms}</CardContent>
          </Card>
        )}
        {cancellationPolicy && (
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <Ban className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {cancellationPolicy}
            </CardContent>
          </Card>
        )}
        {houseRules && (
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <MdOutlinePrivacyTip className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">House Rules</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{houseRules}</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const AmenityIcon = ({ amenity }: { amenity: string }) => {
  const icons: Record<string, React.ElementType> = {
    wifi: Wifi,
    parking: Car,
    kitchen: Utensils,
    pool: Waves,
    gym: Dumbbell,
  };
  const Icon = icons[amenity] || Hotel;
  return <Icon className="h-5 w-5 text-muted-foreground" />;
};

// --- Main Page Component ---
type AccommodationDetailClientProps = {
  accommodation: Accommodation;
  pointsOfInterest: Place[];
  allAmenities: { id: string; label: string; category: string }[];
};

export default function AccommodationDetailClient({
  accommodation,
  pointsOfInterest,
  allAmenities,
}: AccommodationDetailClientProps) {
  const searchParams = useSearchParams();
  const { preferences } = useUserPreferences();
  const mapRef = useRef<HTMLDivElement>(null);

  const amenityMap = useMemo(() => {
    return new Map(allAmenities.map((amenity) => [amenity.id, amenity.label]));
  }, [allAmenities]);

  const handleShowOnMap = (e: React.MouseEvent) => {
    e.preventDefault();
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const position = { lat: accommodation.lat, lng: accommodation.lng };
  const allImages =
    accommodation.images && accommodation.images.length > 0
      ? accommodation.images.filter(Boolean) // Filter out empty strings
      : accommodation.image
        ? [accommodation.image]
        : [];

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
      <PhotoGallery images={allImages} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-8">
        <div className="lg:col-span-2">
          {/* Header Section */}
          <div className="pb-4 border-b">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{accommodation.name}</h1>
            <div className="flex flex-col items-start mt-2 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{accommodation.location}</span>
                <a
                  href="#map-section"
                  onClick={handleShowOnMap}
                  className="ml-2 text-sm text-primary hover:underline"
                >
                  (Show on Map)
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-4">
                <div className="flex items-center gap-1">
                  <Hotel className="h-4 w-4" />
                  <span>{getPropertyTypeLabel(accommodation.starRating, accommodation.type)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>
                    {accommodation.rating} ({accommodation.reviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {accommodation.description && (
            <>
              <div className="pt-6">
                <p className="text-muted-foreground whitespace-pre-line">
                  {accommodation.description}
                </p>
              </div>
              <Separator className="my-6" />
            </>
          )}

          {/* Amenities Section */}
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="font-headline text-2xl font-bold mb-4">Amenities</h2>
              {accommodation.chargeableAmenities &&
                accommodation.chargeableAmenities.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FeeIcon className="h-4 w-4" />
                    <span>Additional fees may apply</span>
                  </div>
                )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {(accommodation.amenities || []).map((amenityTag) => (
                <div key={amenityTag} className="flex items-center gap-3">
                  <AmenityIcon amenity={amenityTag} />
                  <span>{amenityMap.get(amenityTag) || amenityTag}</span>
                  {accommodation.chargeableAmenities?.includes(amenityTag) && (
                    <FeeIcon className="h-4 w-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Accessibility Section */}
          <div>
            <h2 className="font-headline text-2xl font-bold mb-4">Accessibility</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Accessibility className="h-5 w-5 text-muted-foreground" />
                <span>Wheelchair accessible</span>
              </div>
              <div className="flex items-center gap-3">
                <Accessibility className="h-5 w-5 text-muted-foreground" />
                <span>Elevator access</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Location & Map Section */}
          <div ref={mapRef} id="map-section">
            <h2 className="font-headline text-2xl font-bold mb-4">Location</h2>
            <div className="aspect-video rounded-lg overflow-hidden border">
              <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                <GoogleMap
                  mapId="DEMO_MAP_ID"
                  defaultCenter={position}
                  defaultZoom={15}
                  gestureHandling="greedy"
                >
                  <AdvancedMarker position={position} />
                </GoogleMap>
              </APIProvider>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{accommodation.location}</p>
          </div>

          <Separator className="my-6" />

          {/* Points of Interest Section */}
          <PointsOfInterestDisplay
            places={pointsOfInterest}
            distanceUnit={preferences.distanceUnit}
          />

          <Separator className="my-6" />

          {/* Policies Section */}
          <PoliciesSection accommodation={accommodation} />

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
