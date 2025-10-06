// src/components/ListingsPageClient.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Copy,
  PlusCircle,
  Upload,
  ListFilter,
  FilePen,
  Trash2,
  Check,
  ArrowUp,
  ArrowDown,
  Archive,
  RotateCcw,
  Loader2,
  Search,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Accommodation } from '@/lib/data';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { updateAccommodationStatusAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ListingStatus = 'All' | 'Published' | 'Draft' | 'Archived';
type SortKey = 'name' | 'price' | 'status' | 'host' | 'lastModified';
type SortDirection = 'asc' | 'desc';

type EnrichedProperty = Accommodation & {
  host: string;
  units: number;
};

export default function ListingsPageClient({
  initialProperties,
}: {
  initialProperties: Accommodation[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { preferences } = useUserPreferences();
  const [_isPendingGlobal, startTransition] = useTransition();

  const [properties, setProperties] = useState<EnrichedProperty[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<ListingStatus>(
    (searchParams.get('status') as ListingStatus) || 'All'
  );
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(searchParams.get('limit') || '10');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: (searchParams.get('sortKey') as SortKey) || 'lastModified',
    direction: (searchParams.get('sortDir') as SortDirection) || 'desc',
  });

  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setStatusFilter((searchParams.get('status') as ListingStatus) || 'All');
    setCurrentPage(Number(searchParams.get('page')) || 1);
    setItemsPerPage(searchParams.get('limit') || '10');
    setSortConfig({
      key: (searchParams.get('sortKey') as SortKey) || 'lastModified',
      direction: (searchParams.get('sortDir') as SortDirection) || 'desc',
    });
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set('q', searchTerm);
    else params.delete('q');
    if (statusFilter !== 'All') params.set('status', statusFilter);
    else params.delete('status');
    if (currentPage !== 1) params.set('page', String(currentPage));
    else params.delete('page');
    if (itemsPerPage !== '10') params.set('limit', itemsPerPage);
    else params.delete('limit');
    if (sortConfig.key !== 'lastModified') params.set('sortKey', sortConfig.key);
    else params.delete('sortKey');
    if (sortConfig.direction !== 'desc') params.set('sortDir', sortConfig.direction);
    else params.delete('sortDir');

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    searchTerm,
    statusFilter,
    currentPage,
    itemsPerPage,
    sortConfig,
    pathname,
    router,
    searchParams,
  ]);

  useEffect(() => {
    const enriched = initialProperties.map((p) => ({
      ...p,
      host: 'Sam Potts', // Placeholder
      units: p.type === 'Hotel' ? 4 : 1, // Example logic
    }));
    setProperties(enriched);
  }, [initialProperties]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const handleStatusChange = (id: string, status: 'Published' | 'Draft' | 'Archived') => {
    startTransition(async () => {
      setPendingIds((prev) => new Set(prev).add(id));
      const result = await updateAccommodationStatusAction(id, status);
      setPendingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      if (result.success) {
        toast({
          title: 'Status Updated',
          description: `The listing status has been changed to ${status}.`,
        });
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status, lastModified: new Date() } : p))
        );
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.error,
        });
      }
    });
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  const getShortLocation = (fullLocation: string): string => {
    if (!fullLocation) return '';
    const parts = fullLocation.split(',').map((p) => p.trim());
    if (parts.length < 2) return fullLocation;

    const country = parts[parts.length - 1];
    let city = parts[0];

    if (country.toLowerCase() === 'usa' || country.toLowerCase() === 'united states') {
      if (parts.length > 2) {
        city = parts[parts.length - 3];
      }
      return `${city}, USA`;
    }

    if (parts.length > 1) {
      city = parts[parts.length - 2];
    }
    return `${city}, ${country}`;
  };

  const filteredAndSortedProperties = useMemo(() => {
    const filtered = properties.filter((property) => {
      const matchesStatus = statusFilter === 'All' || property.status === statusFilter;
      const matchesSearch =
        searchTerm === '' ||
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number | Date | undefined = a[sortConfig.key];
      let bValue: string | number | Date | undefined = b[sortConfig.key];

      if (sortConfig.key === 'lastModified') {
        aValue = new Date(a.lastModified);
        bValue = new Date(b.lastModified);
      } else if (sortConfig.key === 'price') {
        aValue = convertCurrency(a.price, a.currency, preferences.currency);
        bValue = convertCurrency(b.price, b.currency, preferences.currency);
      }

      aValue = aValue ?? '';
      bValue = bValue ?? '';

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [properties, statusFilter, searchTerm, sortConfig, preferences.currency]);

  const itemsPerPageNum =
    itemsPerPage === 'All' ? filteredAndSortedProperties.length : parseInt(itemsPerPage);
  const totalPages = Math.ceil(filteredAndSortedProperties.length / itemsPerPageNum);
  const paginatedProperties = filteredAndSortedProperties.slice(
    (currentPage - 1) * itemsPerPageNum,
    currentPage * itemsPerPageNum
  );

  const SortableHeader = ({
    sortKey,
    children,
  }: {
    sortKey: SortKey;
    children: React.ReactNode;
  }) => (
    <button className="flex items-center gap-1 font-bold" onClick={() => requestSort(sortKey)}>
      {children}
      {getSortIcon(sortKey)}
    </button>
  );

  const getEditUrl = (propertyId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `/admin/listings/${propertyId}/edit/about?${params.toString()}`;
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or location..."
            className="pl-8 h-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="All">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as ListingStatus)}
              >
                <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Published">Published</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Draft">Draft</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Archived">Archived</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Upload className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Import</span>
          </Button>
          <Button asChild size="sm" className="h-8 gap-1">
            <Link href="/admin/listings/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New</span>
            </Link>
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>
              <SortableHeader sortKey="name">Name</SortableHeader>
            </TableHead>
            <TableHead className="hidden md:table-cell">Units</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden lg:table-cell">
              <SortableHeader sortKey="host">Host</SortableHeader>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <SortableHeader sortKey="price">Price</SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader sortKey="status">Status</SortableHeader>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProperties.length > 0 ? (
            paginatedProperties.map((property) => {
              const convertedPrice = convertCurrency(
                property.price,
                property.currency,
                preferences.currency
              );
              const canPublish = property.images && property.images.length > 0;
              const coverImage = property.image;
              const isPending = pendingIds.has(property.id);

              return (
                <TableRow key={property.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={property.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={coverImage}
                      width="64"
                      data-ai-hint={property.imageHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{property.units}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {getShortLocation(property.location)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {property.host}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatCurrency(convertedPrice, preferences.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        property.status === 'Published'
                          ? 'default'
                          : property.status === 'Archived'
                            ? 'destructive'
                            : 'outline'
                      }
                    >
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                              <Link href={getEditUrl(property.id)}>
                                <FilePen className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Listing</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Duplicate */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Duplicate Listing</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Publish / Draft / Archive */}
                        {property.status === 'Published' || property.status === 'Archived' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-amber-600"
                                onClick={() => handleStatusChange(property.id, 'Draft')}
                                disabled={isPending}
                              >
                                {isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RotateCcw className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Return to Draft</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-600"
                                onClick={() => handleStatusChange(property.id, 'Published')}
                                disabled={isPending || !canPublish}
                              >
                                {isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {canPublish ? (
                                <p>Publish Listing</p>
                              ) : (
                                <p>A cover image is required to publish.</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Delete / Archive */}
                        {property.status === 'Draft' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Listing</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleStatusChange(property.id, 'Archived')}
                                disabled={isPending}
                              >
                                {isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Archive className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Archive Listing</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No properties found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 0 && (
        <div className="flex items-center justify-end mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                  }}
                  className={cn('h-8', currentPage === 1 && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
              <PaginationItem className="text-sm font-medium h-8 flex items-center px-3">
                Page {currentPage} of {totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  }}
                  className={cn(
                    'h-8',
                    currentPage === totalPages && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
