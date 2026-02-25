// src/app/account/my-stays/upcoming/page.tsx

'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { format, isWithinInterval, differenceInDays, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Users, CalendarDays, Eye, Grid3x3, CalendarIcon } from '@/lib/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { BookingCard } from '@/components/BookingCard';
import Link from 'next/link';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { convertCurrency, formatCurrency } from '@/lib/currency';

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/1/600/400';

type AnyBooking = {
  id?: string;
  accommodationId?: string;
  accommodation?: {
    id?: string;
    name?: string;
    image?: string;
    imageHint?: string;
    currency?: string;
  };
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  guests?: number;
  totalPrice?: number;
  [key: string]: unknown;
};

/**
 * TEMP STUBS (to avoid importing firebase-admin via firestore.server in client bundles)
 * Next step will be to replace these with an API route call.
 */
async function fetchBookings(userId: string): Promise<AnyBooking[]> {
  void userId;
  return [];
}

async function fetchAccommodationById(
  accommodationId: string
): Promise<AnyBooking['accommodation'] | null> {
  void accommodationId;
  return null;
}

type ViewMode = 'grid' | 'calendar';

function toDate(value: AnyBooking['startDate']): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const BookingItem = ({
  booking,
  onViewDetails,
}: {
  booking: AnyBooking;
  onViewDetails: (booking: AnyBooking) => void;
}) => {
  const { preferences } = useUserPreferences();

  const accommodation = booking.accommodation ?? {};
  const accommodationName = accommodation.name ?? 'Accommodation';
  const accommodationId = accommodation.id ?? booking.accommodationId ?? '';
  const image = accommodation.image ?? PLACEHOLDER_IMAGE;

  const start = toDate(booking.startDate);
  const end = toDate(booking.endDate);

  const nights = start && end ? Math.max(0, differenceInDays(end, start)) : null;

  const fromCurrency = preferences.currency;
  const totalPrice = typeof booking.totalPrice === 'number' ? booking.totalPrice : 0;
  const convertedPrice = convertCurrency(totalPrice, fromCurrency, preferences.currency);
  const formattedTotal = formatCurrency(convertedPrice, preferences.currency);

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link
          href={accommodationId ? `/accommodation/${accommodationId}` : '#'}
          className="block w-full h-full"
          aria-label={`View details for ${accommodationName}`}
        >
          <Image
            src={image}
            alt={accommodationName}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={accommodation.imageHint}
          />
        </Link>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl">{accommodationName}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-2">
          <CalendarDays className="h-4 w-4" />
          <span>
            {start ? format(start, 'MMM d') : '—'} – {end ? format(end, 'MMM d, yyyy') : '—'}
          </span>
        </CardDescription>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{typeof booking.guests === 'number' ? booking.guests : '—'} guests</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{nights !== null ? `${nights} nights` : '—'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-medium">{formattedTotal}</div>
        <Button variant="outline" size="sm" onClick={() => onViewDetails(booking)}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function UpcomingStaysPage() {
  const [bookings, setBookings] = useState<AnyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<AnyBooking | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const getBookings = async () => {
      setLoading(true);

      const userId = 'user1';
      const fetchedBookings = await fetchBookings(userId);

      const enriched = await Promise.all(
        fetchedBookings.map(async (booking) => {
          const start = toDate(booking.startDate);
          const end = toDate(booking.endDate);

          const next: AnyBooking = {
            ...booking,
            startDate: start ?? booking.startDate ?? null,
            endDate: end ?? booking.endDate ?? null,
          };

          const accId = typeof next.accommodationId === 'string' ? next.accommodationId : '';

          if (accId) {
            const accommodation = await fetchAccommodationById(accId);
            if (accommodation) next.accommodation = accommodation;
          }

          return next;
        })
      );

      const now = new Date();
      const upcoming = enriched.filter((booking) => {
        const end = toDate(booking.endDate);
        if (!end) return false;
        return end >= now;
      });

      setBookings(upcoming);
      setLoading(false);
    };

    getBookings();
  }, []);

  const bookingsOnSelectedDate =
    selectedDate && bookings.length > 0
      ? bookings.filter((booking) => {
          const start = toDate(booking.startDate);
          const end = toDate(booking.endDate);
          if (!start || !end) return false;

          return (
            isSameDay(selectedDate, start) ||
            isSameDay(selectedDate, end) ||
            isWithinInterval(selectedDate, { start, end })
          );
        })
      : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading bookings…
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Upcoming stays</h1>
        <p className="text-sm text-muted-foreground">Your upcoming bookings and stay details.</p>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList>
          <TabsTrigger value="grid">
            <Grid3x3 className="mr-2 h-4 w-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          {bookings.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No upcoming stays</CardTitle>
                <CardDescription>When you book a stay, it will appear here.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking, idx) => (
                <BookingItem
                  key={(typeof booking.id === 'string' && booking.id) || `booking-${idx}`}
                  booking={booking}
                  onViewDetails={setSelectedBooking}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select a date</CardTitle>
              <CardDescription>See bookings that overlap a specific day.</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={(day) => setSelectedDate(day ?? null)}
              />
            </CardContent>
          </Card>

          {selectedDate ? (
            bookingsOnSelectedDate.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No bookings on this date</CardTitle>
                  <CardDescription>Try another date.</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bookingsOnSelectedDate.map((booking, idx) => (
                  <BookingItem
                    key={(typeof booking.id === 'string' && booking.id) || `booking-date-${idx}`}
                    booking={booking}
                    onViewDetails={setSelectedBooking}
                  />
                ))}
              </div>
            )
          ) : null}
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => (!open ? setSelectedBooking(null) : null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
            <DialogDescription>Review your booking information.</DialogDescription>
          </DialogHeader>

          {selectedBooking ? (
            <div className="space-y-4">
              <BookingCard booking={selectedBooking as any} />
              <div className="flex justify-end">
                <Button asChild>
                  <Link
                    href={
                      selectedBooking.accommodation?.id
                        ? `/accommodation/${selectedBooking.accommodation.id}`
                        : '#'
                    }
                  >
                    View Accommodation
                  </Link>
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
