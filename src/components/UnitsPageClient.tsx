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
import { Bed, Box, Building, FilePen, PlusCircle, Trash2, Users, Loader2, Save } from '@/lib/icons';
import type { Accommodation } from '@/lib/data';
import React, { useState, useTransition, useEffect } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateAccommodationAction } from '@/app/actions';
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

export type BookableUnit = {
  id: string;
  unitRef: string;
  name: string;
  type: 'Room' | 'Bed';
  guests: number;
  price: number;
  status: 'Published' | 'Draft' | 'Archived';
  images?: string[];
};

export default function UnitsPageClient({ listing }: { listing: Accommodation }) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [bookingType, setBookingType] = useState(listing.bookingType || 'room');
  const [isBookingTypeDirty, setIsBookingTypeDirty] = useState(false);
  const [isSaving, startTransition] = useTransition();
  const [hasMounted, setHasMounted] = useState(false);

  const [initialUnits, setInitialUnits] = useState<BookableUnit[]>(() => [
    {
      id: `unit1`, // Simplified ID
      unitRef: 'PR-01',
      name: 'Private Room',
      type: 'Room',
      guests: 2,
      price: listing.price,
      status: 'Published',
    },
    {
      id: `unit2`, // Simplified ID
      unitRef: 'DB-01',
      name: 'Dorm Bed',
      type: 'Bed',
      guests: 1,
      price: listing.price / 4,
      status: 'Published',
    },
  ]);

  const [bookableUnits, setBookableUnits] = useState<BookableUnit[]>(initialUnits);
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

  const handleBookingTypeChange = (value: string) => {
    setBookingType(value);
    setIsBookingTypeDirty(value !== listing.bookingType);
  };

  const handleSaveBookingType = () => {
    startTransition(async () => {
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

  const handleDeleteUnit = (unitId: string) => {
    setBookableUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== unitId));
    toast({
      title: 'Unit Removed',
      description: 'The unit has been removed. Click "Save All" to make this change permanent.',
    });
  };

  const handleSaveAll = () => {
    startTransition(async () => {
      // In a real app, you would have an action to save all units.
      // For now, we simulate the save and update the state.
      console.log('Simulating save for all units:', bookableUnits);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setInitialUnits(bookableUnits); // Set the current state as the new "saved" state
      toast({
        title: 'Changes Saved',
        description: 'All unit configurations have been updated.',
      });
    });
  };

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
          <CardTitle className="font-headline text-xl">Configure Units</CardTitle>
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
                    disabled={!isBookingTypeDirty || isSaving}
                    className="w-28"
                  >
                    {isSaving ? (
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
                    <h3 className="font-semibold flex items-center gap-2">
                      <Box className="h-5 w-5" />
                      Unit Overview
                    </h3>
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
                    <Button onClick={handleSaveAll} disabled={!isUnitsDirty || isSaving}>
                      {isSaving ? (
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
                        <TableHead className="font-bold">Unit Ref</TableHead>
                        <TableHead className="font-bold">Unit Name</TableHead>
                        {bookingType === 'hybrid' && (
                          <TableHead className="font-bold">Unit Type</TableHead>
                        )}
                        <TableHead className="font-bold">Guests</TableHead>
                        <TableHead className="font-bold">Price/Night</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="text-right font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookableUnits.length > 0 ? (
                        bookableUnits.map((unit) => (
                          <TableRow key={unit.id}>
                            <TableCell>{unit.unitRef}</TableCell>
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
                                        <Building className="h-4 w-4" /> Room
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
                                {unit.guests}
                              </div>
                            </TableCell>
                            <TableCell>${unit.price.toFixed(2)}</TableCell>
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
                              <div className="flex items-center justify-end gap-2">
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                  <Link href={getEditUrl(unit.id)}>
                                    <FilePen className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Link>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        the "{unit.name}" unit.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteUnit(unit.id)}>
                                        Continue
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
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
