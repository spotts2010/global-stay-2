// src/components/ListingsPageClient.tsx
'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import Image from 'next/image';
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
  ListFilter,
  FilePen,
  Trash2,
  Check,
  RotateCcw,
  Loader2,
  ArrowUp,
  ArrowDown,
  FaArchive,
  ImageIcon,
} from '@/lib/icons';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import {
  updateAccommodationStatusAction,
  duplicateListingAction,
  deleteListingAction,
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

type ListingStatus = 'All' | 'Published' | 'Draft' | 'Archived';
type SortKey = 'name' | 'price' | 'status' | 'lastModified';
type SortDirection = 'asc' | 'desc';

type EnrichedProperty = Accommodation & {
  host: string;
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
  const [isTransitioning, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);

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
    if (initialProperties) {
      const enriched = initialProperties.map((p) => ({
        ...p,
        host: 'Sam Potts',
        lastModified: p.lastModified ? new Date(p.lastModified) : new Date(),
      }));
      setProperties(enriched);
    }
  }, [initialProperties]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const handleStatusChange = (id: string, status: 'Published' | 'Draft' | 'Archived') => {
    setPendingAction(id);
    startTransition(async () => {
      const result = await updateAccommodationStatusAction(id, status);
      if (result.success) {
        toast({
          title: 'Status Updated',
          description: `The listing status has been changed to ${status}.`,
        });
        setProperties((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  lastModified: new Date(),
                }
              : p
          )
        );
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.error,
        });
      }
      setPendingAction(null);
    });
  };

  const handleDuplicateListing = (id: string) => {
    setPendingAction(id);
    startTransition(async () => {
      const result = await duplicateListingAction(id);
      if (result.success) {
        toast({
          title: 'Listing Duplicated',
          description: 'A new draft has been created. Refreshing list...',
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Duplication Failed',
          description: result.error,
        });
      }
      setPendingAction(null);
    });
  };

  const handleDeleteListing = (id: string, name: string) => {
    setPendingAction(id);
    startTransition(async () => {
      const result = await deleteListingAction(id);
      if (result.success) {
        toast({
          title: 'Listing Deleted',
          description: `"${name}" has been permanently deleted.`,
        });
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast({
          variant: 'destructive',
          title: 'Deletion Failed',
          description: result.error,
        });
      }
      setPendingAction(null);
    });
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
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
  const getShortLocation = (property: EnrichedProperty): string => {
    if (property.address?.city && property.address?.country?.long) {
      return [property.address.city, property.address.country.long].filter(Boolean).join(', ');
    }
    return [property.city, property.country].filter(Boolean).join(', ');
  };

  const filteredAndSortedProperties = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = properties.filter((property) => {
      const matchesStatus = statusFilter === 'All' || property.status === statusFilter;

      const matchesSearch =
        searchTerm === '' ||
        property.name.toLowerCase().includes(lowerSearch) ||
        (property.searchIndex?.toLowerCase().includes(lowerSearch) ?? false) ||
        property.address?.city?.toLowerCase().includes(lowerSearch) ||
        property.address?.state?.long?.toLowerCase().includes(lowerSearch) ||
        property.address?.country?.long?.toLowerCase().includes(lowerSearch);

      return matchesStatus && matchesSearch;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number | Date | undefined = a[sortConfig.key];
      let bValue: string | number | Date | undefined = b[sortConfig.key];

      if (sortConfig.key === 'lastModified') {
        aValue = a.lastModified;
        bValue = b.lastModified;
      } else if (sortConfig.key === 'price') {
        aValue = convertCurrency(a.price, a.currency, preferences.currency);
        bValue = convertCurrency(b.price, b.currency, preferences.currency);
      }

      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';

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
      {/* Search + Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Input
            type="search"
            placeholder="Search by name or location..."
            className="pl-8 h-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                Filter
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
          <Button asChild size="sm" className="h-8 gap-1">
            <Link href="/admin/listings/new">
              <PlusCircle className="h-3.5 w-3.5" />
              New Listing
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
            <TableHead>
              <SortableHeader sortKey="name">Name</SortableHeader>
            </TableHead>
            <TableHead className="hidden md:table-cell">Units</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
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
              const isPending = pendingAction === property.id && isTransitioning;

              return (
                <TableRow key={property.id}>
                  <TableCell className="hidden sm:table-cell">
                    {coverImage ? (
                      <Image
                        alt={property.name}
                        className="aspect-square rounded-md object-cover"
                        height={64}
                        width={64}
                        src={coverImage}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{property.unitsCount || 0}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {getShortLocation(property)}
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
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                              <Link href={getEditUrl(property.id)}>
                                <FilePen className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDuplicateListing(property.id)}
                              disabled={isPending}
                            >
                              {isPending && pendingAction === property.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Duplicate</TooltipContent>
                        </Tooltip>

                        {property.status === 'Draft' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-600"
                                onClick={() => handleStatusChange(property.id, 'Published')}
                                disabled={!canPublish || isPending}
                              >
                                {isPending && pendingAction === property.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {canPublish
                                ? 'Publish'
                                : 'Listing requires a cover image to be published.'}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-amber-600"
                                onClick={() => handleStatusChange(property.id, 'Draft')}
                                disabled={isPending}
                              >
                                {isPending && pendingAction === property.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RotateCcw className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Return to Draft</TooltipContent>
                          </Tooltip>
                        )}

                        {property.status === 'Draft' ? (
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    disabled={isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete "
                                  {property.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteListing(property.id, property.name)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
                                {isPending && pendingAction === property.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <FaArchive className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Archive</TooltipContent>
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
              <TableCell colSpan={7} className="h-24 text-center">
                No properties found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
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
