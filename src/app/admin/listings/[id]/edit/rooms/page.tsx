'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Box,
  Building,
  FilePen,
  PlusCircle,
  Trash2,
  Users,
  Save,
  Loader2,
} from 'lucide-react';
import type { Accommodation } from '@/lib/data';
import React, { useState, useTransition, useEffect, use } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { fetchAccommodationById } from '@/lib/firestore';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type BookableUnit = {
  id: string;
  unitRef: string;
  name: string;
  type: 'Room' | 'Bed';
  guests: number;
  price: number;
  status: 'Active' | 'Inactive';
};

function RoomsPageClient({ listing }: { listing: Accommodation }) {
  const { toast } = useToast();
  const [bookingType, setBookingType] = useState(listing.bookingType || 'hybrid');
  const [isPending, startTransition] = useTransition();

  const [bookableUnits, _setBookableUnits] = useState<BookableUnit[]>(() => {
    // Create a default bookable unit if none exist, using the listing's base price.
    return [
      {
        id: `${listing.id}-unit1`,
        unitRef: 'PR-01',
        name: 'Private Room',
        type: 'Room',
        guests: 2,
        price: listing.price,
        status: 'Active',
      },
      {
        id: `${listing.id}-unit2`,
        unitRef: 'DB-01',
        name: 'Dorm Bed',
        type: 'Bed',
        guests: 1,
        price: listing.price / 4,
        status: 'Active',
      },
    ];
  });

  const handleSaveChanges = () => {
    startTransition(async () => {
      console.log('Saving changes:', { bookingType, bookableUnits });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Changes Saved',
        description: 'The room configuration has been updated.',
      });
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Rooms' },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Booking Configuration</CardTitle>
          <CardDescription>
            Choose how guests can book this property and manage the available rooms or beds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* --- Booking Type Section --- */}
          <div className="space-y-2">
            <Label htmlFor="booking-type" className="font-semibold">
              Booking Type
            </Label>
            <div className="max-w-md">
              <Select value={bookingType} onValueChange={setBookingType}>
                <SelectTrigger id="booking-type">
                  <SelectValue placeholder="Select how guests book..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room">By Room / Unit (e.g., Hotel, Villa)</SelectItem>
                  <SelectItem value="bed">By Bed (e.g., Hostel Dorm)</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Rooms and Beds)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* --- Bookable Units Section --- */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  Bookable Units
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage rooms, dorms, or beds. Each listing must have at least one unit.
                </p>
              </div>
              <Button type="button" variant="outline" className="mt-2 md:mt-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Unit
              </Button>
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
                          <Badge variant={unit.status === 'Active' ? 'default' : 'outline'}>
                            {unit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                              <FilePen className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function RoomsPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const [listing, setListing] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      try {
        const data = await fetchAccommodationById(resolvedParams.id);
        if (data) {
          setListing(data);
        } else {
          setError('Listing not found.');
        }
      } catch (err) {
        setError('Failed to load listing data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadListing();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center text-destructive">
        <h1 className="font-bold text-2xl">Error</h1>
        <p>{error}</p>
      </div>
    );
  }
  return <RoomsPageClient listing={listing} />;
}
