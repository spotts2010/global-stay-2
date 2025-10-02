// src/app/results/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { fetchAccommodations } from '@/lib/firestore';
import type { Accommodation } from '@/lib/data';
import AccommodationCard from '@/components/AccommodationCard';
import { MapPin, Calendar, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useSearchParams } from 'next/navigation';

// Utility: format date for display, ensuring UTC is handled correctly.
function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Any date';
  // IMPORTANT: Parse date strings by treating them as being in the user's local timezone (Brisbane for this example).
  // This creates a Date object that correctly represents the intended day.
  const date = toZonedTime(`${dateString}T00:00:00`, 'Australia/Brisbane');
  // Then format it. Using a specific format avoids locale-based ambiguity.
  return format(date, 'LLL dd, yyyy');
}

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  const location = searchParams.get('location');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const guests = searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined;

  useEffect(() => {
    const loadAccommodations = async () => {
      setLoading(true);
      // NOTE: This should be a more efficient query, e.g. using a server-side search function
      const allAccommodations = await fetchAccommodations();

      const filtered = allAccommodations.filter((accommodation) => {
        if (
          location &&
          location.trim() &&
          !accommodation.location.toLowerCase().includes(location.toLowerCase())
        ) {
          return false;
        }
        return true;
      });

      setAccommodations(filtered);
      setLoading(false);
    };

    loadAccommodations();
  }, [location, from, to, guests]);

  const formattedDateRange = from && to ? `${formatDate(from)} - ${formatDate(to)}` : 'Any date';

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
        {/* Combined Heading and Filters */}
        <section
          aria-labelledby="search-results-heading"
          className="mb-8 rounded-lg bg-white p-4 shadow-sm border border-slate-200"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 id="search-results-heading" className="text-2xl font-bold text-slate-900">
              Search Results
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

        {/* Results */}
        <section aria-label="Accommodation results">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : accommodations.length > 0 ? (
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
                We couldn't find any accommodations matching your search. Please try adjusting your
                filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <ResultsPageContent />
    </Suspense>
  );
}
