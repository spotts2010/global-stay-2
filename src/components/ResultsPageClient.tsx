// src/components/ResultsPageClient.tsx
'use client';

import { useState, useMemo } from 'react';
import type { Accommodation } from '@/lib/data';
import AccommodationCard from '@/components/AccommodationCard';
import { MapPin, CalendarDays as Calendar, Users, List, Map as MapIcon } from '@/lib/icons';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { format, parseISO } from 'date-fns';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Utility: format date for display, ensuring UTC is handled correctly.
function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Any date';
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return format(date, 'LLL dd, yyyy');
  } catch (_e) {
    return 'Invalid date';
  }
}

export default function ResultsPageClient({
  initialAccommodations,
  searchParams,
}: {
  initialAccommodations: Accommodation[];
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  // Correctly read search parameters
  const location = (searchParams?.location as string) || '';
  const from = searchParams?.from as string;
  const to = searchParams?.to as string;
  const guests = searchParams?.guests ? Number(searchParams.guests) : undefined;
  const locationLower = location.toLowerCase().trim();

  // Filter accommodations based on search params
  const accommodations = useMemo(() => {
    if (!initialAccommodations || initialAccommodations.length === 0) return [];

    return initialAccommodations.filter((acc) => {
      // Location match
      const matchesLocation =
        !locationLower ||
        acc.city?.toLowerCase().includes(locationLower) ||
        acc.state?.toLowerCase().includes(locationLower) ||
        acc.country?.toLowerCase().includes(locationLower) ||
        acc.name?.toLowerCase().includes(locationLower);

      // Guests match (using placeholder as maxGuests is not available yet)
      // This part will be updated once maxGuests is available on the Accommodation type.
      const matchesGuests = !guests || (acc.maxGuests && acc.maxGuests >= guests);

      // Return true only if both match
      return matchesLocation && matchesGuests;
    });
  }, [initialAccommodations, locationLower, guests]);

  // Format date range for display
  const formattedDateRange =
    from && to
      ? `${formatDate(from)} - ${formatDate(to)}`
      : from
        ? formatDate(from)
        : to
          ? formatDate(to)
          : 'Any date';

  const plainSearchParams: { [key: string]: string } = {};
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value === 'string') {
        plainSearchParams[key] = value;
      }
    }
  }

  // Map center based on filtered accommodations
  const mapCenter = useMemo(() => {
    if (accommodations.length === 0) return { lat: -25.2744, lng: 133.7751 }; // Default to Australia center
    const { lat, lng } = accommodations.reduce(
      (acc, curr) => ({
        lat: acc.lat + curr.lat,
        lng: acc.lng + curr.lng,
      }),
      { lat: 0, lng: 0 }
    );
    return { lat: lat / accommodations.length, lng: lng / accommodations.length };
  }, [accommodations]);

  const activeAccommodation = useMemo(
    () => accommodations.find((a) => a.id === activeMarkerId),
    [accommodations, activeMarkerId]
  );

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

        {/* Header + Filters */}
        <section
          aria-labelledby="search-results-heading"
          className="mb-8 rounded-lg bg-white p-4 shadow-sm border border-slate-200"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 id="search-results-heading" className="text-2xl font-bold text-slate-900">
              Search Results ({accommodations.length})
            </h1>

            <div className="flex-grow flex flex-col sm:flex-row items-center justify-end gap-4 text-sm text-slate-700 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">Location:</span>
                <span>{location || 'Any location'}</span>
              </div>

              <div className="hidden sm:block border-l h-6 border-slate-200"></div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium">Dates:</span>
                <span>{formattedDateRange}</span>
              </div>

              <div className="hidden sm:block border-l h-6 border-slate-200"></div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium">Guests:</span>
                <span>{guests ? `${guests} guest(s)` : 'Any'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section aria-label="Accommodation results">
          <Tabs defaultValue="card" className="w-full">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="card">
                  <List className="mr-2 h-4 w-4" />
                  Card View
                </TabsTrigger>
                <TabsTrigger value="map">
                  <MapIcon className="mr-2 h-4 w-4" />
                  Map View
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Card View */}
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

            {/* Map View */}
            <TabsContent value="map">
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border">
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                  <Map
                    mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID as string}
                    defaultCenter={mapCenter}
                    defaultZoom={accommodations.length > 1 ? 4 : 10}
                    gestureHandling="greedy"
                    disableDefaultUI={true}
                    onClick={() => setActiveMarkerId(null)}
                  >
                    {accommodations.map((accommodation) => (
                      <AdvancedMarker
                        key={accommodation.id}
                        position={{ lat: accommodation.lat, lng: accommodation.lng }}
                        onClick={() => setActiveMarkerId(accommodation.id)}
                      />
                    ))}

                    {activeAccommodation && (
                      <InfoWindow
                        position={{
                          lat: activeAccommodation.lat,
                          lng: activeAccommodation.lng,
                        }}
                        pixelOffset={[0, -50]}
                        onCloseClick={() => setActiveMarkerId(null)}
                        headerDisabled
                      >
                        <div className="w-80">
                          <AccommodationCard
                            accommodation={activeAccommodation}
                            disableHover
                            searchParams={plainSearchParams}
                          />
                        </div>
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
