'use client';

import { useState } from 'react';
import AccommodationCard from '@/components/AccommodationCard';
import FilterPanel from '@/components/FilterPanel';
import { accommodations } from '@/lib/data';
import type { Accommodation } from '@/lib/data';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 8;

interface FilterState {
  priceRange: [number, number];
  propertyType: string;
  rating: number;
}

export default function SearchPage() {
  const [filteredAccommodations, setFilteredAccommodations] =
    useState<Accommodation[]>(accommodations);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredAccommodations.length / ITEMS_PER_PAGE);

  const handleFilterChange = (filters: FilterState) => {
    console.log('Applying filters:', filters);
    // For now, we'll just reset to the full list.
    // Replace this with real filtering logic.
    let updatedList = accommodations;

    if (filters.priceRange) {
      updatedList = updatedList.filter(
        (acc) => acc.price >= filters.priceRange[0] && acc.price <= filters.priceRange[1]
      );
    }
    if (filters.propertyType && filters.propertyType !== 'all') {
      updatedList = updatedList.filter((acc) => acc.type === filters.propertyType);
    }
    if (filters.rating > 0) {
      updatedList = updatedList.filter((acc) => acc.rating >= filters.rating);
    }

    setFilteredAccommodations(updatedList);
    setCurrentPage(1);
  };

  const paginatedAccommodations = filteredAccommodations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <FilterPanel onFilterChange={handleFilterChange} />
        </aside>
        <main className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold">Search Results</h1>
            <p className="text-muted-foreground mt-1">
              {filteredAccommodations.length} properties found
            </p>
          </div>

          {paginatedAccommodations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedAccommodations.map((accommodation) => (
                <AccommodationCard key={accommodation.id} accommodation={accommodation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-headline text-2xl font-bold">No results found</h2>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
