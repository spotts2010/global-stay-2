// src/components/ResultsPageClient.tsx
'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  Users,
  MapPin,
  Search,
  List,
  Map as MapIcon,
  CalendarDays,
  Star,
  Hotel,
} from '@/lib/icons';
import type { Accommodation } from '@/lib/data';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccommodationCard from './AccommodationCard';
import AccommodationSearchForm from './AccommodationSearchForm';
import { useSearchParams } from 'next/navigation';
import { logger } from '@/lib/logger';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

// ========================
// SearchSummary Component
// ========================
const SearchSummary = ({ onModify }: { onModify: () => void }) => {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || 'Any location';
  const guests = searchParams.get('guests');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const guestsText = guests
    ? `${guests} ${Number(guests) === 1 ? 'guest' : 'guests'}`
    : 'Any guests';

  let dateText = 'Pick a date range';
  try {
    if (from && to) {
      dateText = `${format(parseISO(from), 'LLL dd, yyyy')} - ${format(
        parseISO(to),
        'LLL dd, yyyy'
      )}`;
    } else if (from) {
      dateText = `From ${format(parseISO(from), 'LLL dd, yyyy')}`;
    }
  } catch (error) {
    logger.error('Error parsing date in search summary', error);
    dateText = 'Invalid Date';
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-lg shadow-md border border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row md:items-stretch md:divide-x divide-y md:divide-y-0 divide-slate-200">
          {/* Mobile version */}
          <div className="p-4 md:hidden">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-800 truncate">
                <MapPin className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-800 truncate">
                <CalendarDays className="w-4 h-4 shrink-0 text-slate-500" />
                <span>{dateText}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-800 truncate">
                <Users className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
                <span>{guestsText}</span>
              </div>
              <Button onClick={onModify} className="w-full rounded-md mt-2">
                <Search className="mr-2 h-4 w-4" />
                Modify Search
              </Button>
            </div>
          </div>

          {/* Desktop version */}
          <div className="hidden md:flex md:flex-[2.5] min-w-0 items-center gap-2 px-4 h-14">
            <MapPin className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
            <span className="truncate text-sm">{location}</span>
          </div>
          <div className="hidden md:flex relative md:flex-[2] items-center gap-2 px-4 h-14">
            <CalendarDays className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
            <span className="truncate text-sm">{dateText}</span>
          </div>
          <div className="hidden md:flex md:flex-1 items-center gap-2 px-4 h-14">
            <Users className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
            <span className="truncate text-sm">{guestsText}</span>
          </div>
          <div className="hidden md:block p-0">
            <button
              type="button"
              onClick={onModify}
              className={cn(
                'inline-flex h-full min-h-[44px] w-full items-center justify-center gap-2 rounded-r-md bg-primary px-6 text-white hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'md:min-h-0 md:rounded-l-none md:h-14'
              )}
            >
              <Search className="w-4 h-4" aria-hidden />
              <span className="text-[15px] font-medium">Modify</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getPropertyTypeLabel = (starRating: number | undefined, type: string) => {
  if (starRating && starRating > 0) {
    return `${starRating}-star ${type}`;
  }
  return type;
};

// ========================
// MapInfoWindowCard Component
// ========================
const MapInfoWindowCard = ({
  accommodation,
  searchParams,
}: {
  accommodation: Accommodation;
  searchParams: { [key: string]: string };
}) => {
  const { preferences } = useUserPreferences();
  const queryString = new URLSearchParams(searchParams).toString();
  const detailUrl = `/accommodation/${accommodation.id}${queryString ? `?${queryString}` : ''}`;

  const convertedPrice = convertCurrency(
    accommodation.price,
    accommodation.currency,
    preferences.currency
  );
  const formattedPrice = formatCurrency(convertedPrice.toFixed(0), preferences.currency);

  return (
    <Link href={detailUrl} className="block w-64 text-left">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="p-3">
          <CardTitle className="font-headline text-base font-bold leading-tight">
            {accommodation.name}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs mt-1 text-muted-foreground">
            <Hotel className="h-3 w-3" />
            {getPropertyTypeLabel(accommodation.starRating, accommodation.type)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm font-bold text-foreground">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>{accommodation.rating.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-sm font-bold">{formattedPrice}</span>
              <span className="text-xs text-muted-foreground">/night</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// ========================
// Main Page Content
// ========================
function ResultsPageContent({ initialAccommodations }: { initialAccommodations: Accommodation[] }) {
  const searchParams = useSearchParams();
  const [isEditingSearch, setIsEditingSearch] = useState(!searchParams.get('location'));
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const accommodations = useMemo(() => {
    const locationQuery = searchParams.get('location');

    if (!locationQuery) {
      return initialAccommodations;
    }

    const searchTerms = locationQuery
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean);

    if (searchTerms.length === 0) {
      return initialAccommodations;
    }

    return initialAccommodations.filter((acc) => {
      const searchableString = [
        acc.name,
        acc.city,
        acc.state,
        acc.country,
        acc.location,
        acc.address?.city,
        acc.address?.state?.long,
        acc.address?.country?.long,
        acc.address?.formatted,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchTerms.some((term) => searchableString.includes(term));
    });
  }, [initialAccommodations, searchParams]);

  const mapCenter = useMemo(() => {
    const validAccommodations = accommodations.filter(
      (acc) => acc.address?.lat && acc.address?.lng
    );

    if (validAccommodations.length === 0) return { lat: -25.2744, lng: 133.7751 };

    const { lat, lng } = validAccommodations.reduce(
      (acc, curr) => ({
        lat: acc.lat + (curr.address?.lat ?? 0),
        lng: acc.lng + (curr.address?.lng ?? 0),
      }),
      { lat: 0, lng: 0 }
    );
    return { lat: lat / validAccommodations.length, lng: lng / validAccommodations.length };
  }, [accommodations]);

  const activeAccommodation = useMemo(
    () => accommodations.find((a) => a.id === activeMarkerId),
    [accommodations, activeMarkerId]
  );

  const handleSearchSubmit = () => {
    setIsEditingSearch(false);
  };

  const plainSearchParams: { [key: string]: string } = {};
  for (const [key, value] of searchParams.entries()) {
    if (value) {
      plainSearchParams[key] = value;
    }
  }

  return (
    <main className="min-h-screen bg-slate-50/50 px-4 md:px-6 py-5 pb-16">
      <div className="container mx-auto">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Search Results</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mb-8">
          {isEditingSearch ? (
            <div className="mx-auto w-full max-w-4xl">
              <AccommodationSearchForm
                searchParams={plainSearchParams}
                onSearch={handleSearchSubmit}
              />
            </div>
          ) : (
            <SearchSummary onModify={() => setIsEditingSearch(true)} />
          )}
        </section>

        <section aria-label="Accommodation results">
          <Tabs defaultValue="card" className="w-full">
            <div className="flex flex-col mb-4 gap-4">
              <TabsList className="w-full md:w-auto self-start">
                <TabsTrigger value="card" className="w-full">
                  <List className="mr-2 h-4 w-4" />
                  Card View
                </TabsTrigger>
                <TabsTrigger value="map" className="w-full">
                  <MapIcon className="mr-2 h-4 w-4" />
                  Map View
                </TabsTrigger>
              </TabsList>
              <h1
                id="search-results-heading"
                className="text-2xl font-bold text-slate-900 text-left"
              >
                {accommodations.length} result{accommodations.length !== 1 ? 's' : ''} found
              </h1>
            </div>

            <TabsContent value="card">
              {accommodations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {accommodations.map((accommodation: Accommodation) => (
                    <AccommodationCard
                      key={accommodation.id}
                      accommodation={accommodation}
                      searchParams={plainSearchParams}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-600 py-20 border-2 border-dashed rounded-lg">
                  <h2 className="font-headline text-2xl font-bold">No Results Found</h2>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    We couldn't find any accommodations matching your search. Please try adjusting
                    your filters.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="map">
              <div className="aspect-[4/5] md:aspect-[16/9] w-full rounded-lg overflow-hidden border">
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                  <Map
                    mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
                    defaultCenter={mapCenter}
                    defaultZoom={accommodations.length > 1 ? 4 : 10}
                    gestureHandling="greedy"
                    disableDefaultUI={true}
                    onClick={() => setActiveMarkerId(null)}
                  >
                    {accommodations.map(
                      (accommodation) =>
                        accommodation.address?.lat &&
                        accommodation.address?.lng && (
                          <AdvancedMarker
                            key={accommodation.id}
                            position={{
                              lat: accommodation.address.lat,
                              lng: accommodation.address.lng,
                            }}
                            onClick={() => setActiveMarkerId(accommodation.id)}
                          />
                        )
                    )}

                    {activeAccommodation &&
                      activeAccommodation.address.lat &&
                      activeAccommodation.address.lng && (
                        <InfoWindow
                          position={{
                            lat: activeAccommodation.address.lat,
                            lng: activeAccommodation.address.lng,
                          }}
                          pixelOffset={[0, -50]}
                          onCloseClick={() => setActiveMarkerId(null)}
                          headerDisabled
                        >
                          {isMobile ? (
                            <MapInfoWindowCard
                              accommodation={activeAccommodation}
                              searchParams={plainSearchParams}
                            />
                          ) : (
                            <div className="w-80">
                              <AccommodationCard
                                accommodation={activeAccommodation}
                                disableHover
                                searchParams={plainSearchParams}
                              />
                            </div>
                          )}
                        </InfoWindow>
                      )}
                  </Map>
                </APIProvider>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}

// The outer component now only handles the Suspense boundary.
export default function ResultsPageClient(props: { initialAccommodations: Accommodation[] }) {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <ResultsPageContent {...props} />
    </Suspense>
  );
}
