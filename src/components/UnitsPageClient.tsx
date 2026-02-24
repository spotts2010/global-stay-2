// src/components/UnitsPageClient.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Bed,
  FilePen,
  PlusCircle,
  Trash2,
  Users,
  Loader2,
  Save,
  Copy,
  FaArchive,
  RotateCcw,
  Check,
  ArrowUp,
  ArrowDown,
  MdOutlineDoorFront,
  BedDouble,
} from '@/lib/icons';
import type { Accommodation } from '@/lib/data';
import React, { useState, useTransition, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateAccommodationAction, updateUnitsAction, duplicateUnitAction } from '@/app/actions';
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
import { formatCurrency } from '@/lib/currency';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export type BookableUnit = {
  id: string;
  unitRef: string;
  name: string;
  type: 'Room' | 'Bed';
  minOccupancy?: number;
  maxOccupancy?: number;
  price?: number;
  status: 'Published' | 'Draft' | 'Archived';
  images?: string[];
  inclusions?: string[];
  chargeableInclusions?: string[];
  bedConfigs?: {
    id?: string;
    type: string;
    sleeps: number;
    count: number;
  }[];
  privateBathrooms?: number;
  sharedBathrooms?: number;
  description?: string;
  area?: number;
  minStay?: number;
  maxStay?: number;
  includedOccupancy?: number;
  extraGuestFee?: number;
  accessibilityFeatures?: string[];
  chargeableAccessibilityFeatures?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  paymentTerms?: string;
  cancellationPolicy?: string;
  houseRules?: string;
};

type SortKey = 'unitRef' | 'name' | 'type' | 'maxOccupancy' | 'price' | 'status';
type SortDirection = 'asc' | 'desc';

export default function UnitsPageClient({
  listing,
  initialUnits,
}: {
  listing: Accommodation;
  initialUnits: BookableUnit[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { preferences } = useUserPreferences();
  const [bookingType, setBookingType] = useState(listing.bookingType || 'room');
  const [isBookingTypeDirty, setIsBookingTypeDirty] = useState(false);
  const [isSavingBookingType, startBookingTypeTransition] = useTransition();
  const [isSavingUnits, startUnitsTransition] = useTransition();
  const [isDuplicating, startDuplicationTransition] = useTransition();
  const [hasMounted, setHasMounted] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'unitRef',
    direction: 'asc',
  });

  const [bookableUnits, setBookableUnits] = useState<BookableUnit[]>(
    initialUnits.map((u) => ({ ...u, status: u.status || 'Draft' }))
  );
  const [isUnitsDirty, setIsUnitsDirty] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setIsUnitsDirty(JSON.stringify(bookableUnits) !== JSON.stringify(initialUnits));
  }, [bookableUnits, initialUnits]);

  const getEditUrl = (unitId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `/admin/listings/${listing.id}/edit/units/${unitId}/basic-info?${params.toString()}`;
  };

  const handleBookingTypeChange = (value: 'room' | 'bed' | 'hybrid') => {
    setBookingType(value);
    setIsBookingTypeDirty(value !== listing.bookingType);
  };

  const handleSaveBookingType = () => {
    startBookingTypeTransition(async () => {
      const result = await updateAccommodationAction(listing.id, {
        bookingType: bookingType as 'room' | 'bed' | 'hybrid',
      });
      if (result.success) {
        toast({
          title: 'Setting Saved',
          description: 'The unit type setting has been updated.',
        });
        setIsBookingTypeDirty(false);
        listing.bookingType = bookingType as 'room' | 'bed' | 'hybrid';
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const handleDuplicateUnit = (unitToDuplicateId: string) => {
    startDuplicationTransition(async () => {
      const result = await duplicateUnitAction(listing.id, unitToDuplicateId);
      if (result.success && result.newUnitId) {
        toast({
          title: 'Unit Duplicated',
          description: 'Redirecting to the new unit to complete details.',
        });
        // Redirect to the new unit's edit page
        router.push(getEditUrl(result.newUnitId));
      } else {
        toast({
          variant: 'destructive',
          title: 'Duplication Failed',
          description: result.error || 'Could not duplicate the unit.',
        });
      }
    });
  };

  const handleDeleteUnit = (unitId: string) => {
    setBookableUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== unitId));
    toast({
      title: 'Unit Removed',
      description: 'The unit has been removed. Click "Save All" to make this change permanent.',
    });
  };

  const handleStatusChange = (unitId: string, newStatus: 'Published' | 'Draft' | 'Archived') => {
    setBookableUnits((prevUnits) =>
      prevUnits.map((unit) => (unit.id === unitId ? { ...unit, status: newStatus } : unit))
    );
  };

  const handleSaveAll = () => {
    startUnitsTransition(async () => {
      const result = await updateUnitsAction(listing.id, bookableUnits);
      if (result.success) {
        setIsUnitsDirty(false);
        toast({
          title: 'Changes Saved',
          description: 'All unit configurations have been updated.',
        });
        // Update initialUnits to reflect the new state after saving
        initialUnits.splice(0, initialUnits.length, ...bookableUnits);
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const calculateMaxOccupancy = (unit: BookableUnit): number => {
    if (!unit.bedConfigs || unit.bedConfigs.length === 0) {
      return unit.maxOccupancy || 0;
    }
    return unit.bedConfigs.reduce((total, config) => total + config.sleeps * config.count, 0);
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
      <ArrowUp className="ml-2 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-2 h-3 w-3" />
    );
  };

  const sortedUnits = useMemo(() => {
    const sortableItems = [...bookableUnits];
    sortableItems.sort((a, b) => {
      const key = sortConfig.key;
      const aValue = key === 'maxOccupancy' ? calculateMaxOccupancy(a) : a[key];
      const bValue = key === 'maxOccupancy' ? calculateMaxOccupancy(b) : b[key];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [bookableUnits, sortConfig]);

  const SortableHeader = ({
    sortKey,
    children,
  }: {
    sortKey: SortKey;
    children: React.ReactNode;
  }) => (
    <Button variant="ghost" onClick={() => requestSort(sortKey)} className="pl-0 h-auto font-bold">
      {children}
      {getSortIcon(sortKey)}
    </Button>
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Units' },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <BedDouble className="h-6 w-6 text-primary" />
            Configure Units
          </CardTitle>
          <CardDescription>
            View and manage all units for this property. Add new units or edit existing ones to set
            occupancy, amenities, pricing, and availability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {hasMounted && (
            <>
              {/* --- Unit Types Section --- */}
              <div className="space-y-2">
                <Label htmlFor="booking-type" className="font-semibold">
                  Unit Types
                </Label>
                <div className="flex items-center gap-2 max-w-lg">
                  <Select value={bookingType} onValueChange={handleBookingTypeChange}>
                    <SelectTrigger id="booking-type">
                      <SelectValue placeholder="Select how guests book..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room">By Unit/Room (e.g., Villa, Suite)</SelectItem>
                      <SelectItem value="bed">By Bed (e.g., Hostel Dorm)</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Rooms and Beds)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSaveBookingType}
                    disabled={!isBookingTypeDirty || isSavingBookingType}
                    className="w-28"
                  >
                    {isSavingBookingType ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save
                  </Button>
                </div>
              </div>

              <Separator />

              {/* --- Unit Overview Section --- */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold">Unit Overview</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage rooms, dorms, or beds. Each listing must have at least one unit.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Button asChild type="button" variant="outline">
                      <Link href={getEditUrl('new')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Unit
                      </Link>
                    </Button>
                    <Button
                      onClick={handleSaveAll}
                      disabled={!isUnitsDirty || isSavingUnits || isDuplicating}
                    >
                      {isSavingUnits ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save All
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <SortableHeader sortKey="unitRef">Unit Ref</SortableHeader>
                        </TableHead>
                        <TableHead>
                          <SortableHeader sortKey="name">Unit Name</SortableHeader>
                        </TableHead>
                        {bookingType === 'hybrid' && (
                          <TableHead>
                            <SortableHeader sortKey="type">Unit Type</SortableHeader>
                          </TableHead>
                        )}
                        <TableHead>
                          <SortableHeader sortKey="maxOccupancy">Guests</SortableHeader>
                        </TableHead>
                        <TableHead>
                          <SortableHeader sortKey="price">Price</SortableHeader>
                        </TableHead>
                        <TableHead>
                          <SortableHeader sortKey="status">Status</SortableHeader>
                        </TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedUnits.length > 0 ? (
                        sortedUnits.map((unit) => {
                          const canPublish = unit.unitRef && unit.unitRef.trim() !== '';
                          const isDuplicatingThis = isDuplicating && unit.id === unit.id; // Example logic
                          return (
                            <TableRow key={unit.id}>
                              <TableCell>{unit.unitRef || '—'}</TableCell>
                              <TableCell className="font-medium">{unit.name}</TableCell>
                              {bookingType === 'hybrid' && (
                                <TableCell>
                                  <Select defaultValue={unit.type.toLowerCase()}>
                                    <SelectTrigger className="h-8 text-xs w-28">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="room">
                                        <div className="flex items-center gap-2">
                                          <MdOutlineDoorFront className="h-4 w-4" /> Room
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="bed">
                                        <div className="flex items-center gap-2">
                                          <Bed className="h-4 w-4" /> Bed
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              )}
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  {calculateMaxOccupancy(unit) || 'N/A'}
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatCurrency(unit.price || 0, preferences.currency)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    unit.status === 'Published'
                                      ? 'default'
                                      : unit.status === 'Archived'
                                        ? 'destructive'
                                        : 'outline'
                                  }
                                >
                                  {unit.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <TooltipProvider>
                                  <div className="flex items-center justify-end gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          asChild
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                        >
                                          <Link href={getEditUrl(unit.id)}>
                                            <FilePen className="h-4 w-4" />
                                          </Link>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit Unit</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => handleDuplicateUnit(unit.id)}
                                          disabled={isDuplicating}
                                        >
                                          {isDuplicatingThis ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Copy className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Duplicate Unit</TooltipContent>
                                    </Tooltip>

                                    {unit.status === 'Draft' ? (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-green-600"
                                            onClick={() => handleStatusChange(unit.id, 'Published')}
                                            disabled={!canPublish}
                                          >
                                            <Check className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {canPublish
                                            ? 'Publish Unit'
                                            : 'A unique Unit Ref is required to publish.'}
                                        </TooltipContent>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-amber-600"
                                            onClick={() => handleStatusChange(unit.id, 'Draft')}
                                          >
                                            <RotateCcw className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Return to Draft</TooltipContent>
                                      </Tooltip>
                                    )}

                                    {unit.status === 'Draft' ? (
                                      <AlertDialog>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <AlertDialogTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </AlertDialogTrigger>
                                          </TooltipTrigger>
                                          <TooltipContent>Delete Unit</TooltipContent>
                                        </Tooltip>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This action cannot be undone. This will permanently
                                              delete the "{unit.name}" unit.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDeleteUnit(unit.id)}
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
                                            onClick={() => handleStatusChange(unit.id, 'Archived')}
                                          >
                                            <FaArchive className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Archive Unit</TooltipContent>
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
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            No bookable units have been configured for this listing yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
