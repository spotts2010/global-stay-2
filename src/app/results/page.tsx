import { fetchAccommodations } from '@/lib/firestore';
import type { Accommodation } from '@/lib/data';
import AccommodationCard from '@/components/AccommodationCard';
import { MapPin, Calendar, Users } from 'lucide-react';

// Utility: format date for display
function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Any date';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// This is now an async Server Component
export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const location = searchParams.location as string | undefined;
  const from = searchParams.from as string | undefined;
  const to = searchParams.to as string | undefined;
  const guests = searchParams.guests ? Number(searchParams.guests) : undefined;

  // 1. Fetch all accommodations
  const allAccommodations = await fetchAccommodations();

  // 2. Filter accommodations based on search criteria
  const filteredAccommodations = allAccommodations.filter((accommodation) => {
    // Location filter (case-insensitive partial match)
    if (
      location &&
      location.trim() &&
      !accommodation.location.toLowerCase().includes(location.toLowerCase())
    ) {
      return false;
    }
    // Note: Date and guest filtering would be implemented here in a real scenario
    // This is a simplified example. We'll add date/guest filtering in a future step.
    return true;
  });

  const formattedDateRange =
    from && to ? `${formatDate(from)} - ${formatDate(to)}` : 'Any date';

  return (
    <main className="min-h-screen bg-slate-50/50 px-4 md:px-6 py-10 pb-16">
      <div className="container mx-auto">
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
          {filteredAccommodations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredAccommodations.map((accommodation: Accommodation) => (
                <AccommodationCard key={accommodation.id} accommodation={accommodation} />
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
