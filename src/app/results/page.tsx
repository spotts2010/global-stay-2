'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

// Utility: format date into UK style
function formatDateUK(dateString: string | undefined) {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  if (isNaN(+date)) return undefined;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ResultsPage() {
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    return {
      location: searchParams.get('location') || 'Any location',
      from: formatDateUK(searchParams.get('from') || undefined),
      to: formatDateUK(searchParams.get('to') || undefined),
      guests: searchParams.get('guests') || 'Any number',
    };
  }, [searchParams]);

  // 🔹 Mock data (replace later with real API results)
  const results = [
    {
      id: 1,
      name: 'Test Villa by the Beach',
      description: 'Sleeps 4 · Ocean views',
    },
    {
      id: 2,
      name: 'City Apartment',
      description: 'Sleeps 2 · Central location',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      {/* Page heading */}
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Search Results</h1>

      {/* Active filters summary */}
      <section
        aria-label="Your search filters"
        className="mb-10 rounded-lg bg-white p-5 shadow-sm border border-slate-200"
      >
        <h2 className="text-lg font-semibold mb-3">Your Search</h2>
        <ul className="space-y-1 text-slate-700">
          <li>
            <span className="font-medium">Location:</span> {filters.location}
          </li>
          <li>
            <span className="font-medium">Dates:</span>{' '}
            {filters.from && filters.to ? `${filters.from} → ${filters.to}` : 'Not set'}
          </li>
          <li>
            <span className="font-medium">Guests:</span> {filters.guests}
          </li>
        </ul>
      </section>

      {/* Results */}
      <section aria-label="Accommodation results">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <article
                key={item.id}
                className="rounded-lg bg-white p-4 shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
                <p className="text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-600 py-20">
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm">Try adjusting your filters.</p>
          </div>
        )}
      </section>
    </main>
  );
}
