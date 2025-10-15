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
import { fetchBookings, fetchAccommodationById } from '@/lib/firestore';
import type { EnrichedBooking } from '@/lib/data';
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

// Card for the Modal view - more spacious
const BookingSummaryCard = ({ booking }: { booking: EnrichedBooking }) => {
  const { preferences } = useUserPreferences();
  if (!booking.accommodation) return null;

  const nights =
    booking.startDate && booking.endDate
      ? differenceInDays(new Date(booking.endDate), new Date(booking.startDate))
      : 0;
  const days = nights > 0 ? nights + 1 : 0;

  const convertedPrice =
    booking.totalPrice && booking.accommodation.currency
      ? convertCurrency(booking.totalPrice, booking.accommodation.currency, preferences.currency)
      : booking.totalPrice || 0;

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-0 relative aspect-video">
        <Link
          href={`/accommodation/${booking.accommodation.id}`}
          className="block w-full h-full"
          aria-label={`View details for ${booking.accommodation.name}`}
        >
          <Image
            src={booking.accommodation.image || PLACEHOLDER_IMAGE}
            alt={booking.accommodation.name}
            fill
            sizes="(max-width: 640px) 90vw, 480px"
            className="object-cover"
            data-ai-hint={booking.accommodation.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl">{booking.accommodation.name}</CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CalendarDays className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <CardDescription>
                {booking.startDate && booking.endDate
                  ? `${format(new Date(booking.startDate), 'LLL dd, yyyy')} - ${format(new Date(booking.endDate), 'LLL dd, yyyy')}`
                  : 'Dates not specified'}
              </CardDescription>
              {days > 0 && (
                <CardDescription className="text-xs">
                  ({days} Days / {nights} Nights)
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{booking.guests} Guests</span>
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg text-foreground">
            <span>{formatCurrency(convertedPrice, preferences.currency)}</span>
          </div>
          <Button asChild className="mt-2">
            <Link href={`/accommodation/${booking.accommodation.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Booking
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function UpcomingStaysPage() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<EnrichedBooking | null>(null);
  const [month, setMonth] = useState<Date | undefined>(undefined);
  const [bookedDays, setBookedDays] = useState<({ from: Date; to: Date } | null)[]>([]);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const getBookings = async () => {
      setLoading(true);
      // In a real app, you'd get the logged-in user's ID
      const userId = 'user1';
      const fetchedBookings = await fetchBookings(userId);

      const enrichedBookings: EnrichedBooking[] = await Promise.all(
        fetchedBookings.map(async (booking) => {
          const enrichedBooking: EnrichedBooking = {
            ...booking,
            startDate: booking.startDate ? new Date(booking.startDate) : undefined,
            endDate: booking.endDate ? new Date(booking.endDate) : undefined,
          };
          if (enrichedBooking.accommodationId) {
            const accommodation = await fetchAccommodationById(enrichedBooking.accommodationId);
            enrichedBooking.accommodation = accommodation || undefined;
          }
          return enrichedBooking;
        })
      );

      setBookings(enrichedBookings);

      // This logic is now inside useEffect to prevent hydration errors
      setMonth(new Date());
      setToday(new Date());
      setBookedDays(
        enrichedBookings
          .map((b) =>
            b.startDate && b.endDate
              ? { from: new Date(b.startDate), to: new Date(b.endDate) }
              : null
          )
          .filter((d): d is { from: Date; to: Date } => d !== null)
      );

      setLoading(false);
    };
    getBookings();
  }, []);

  const handleDayClick = (day: Date) => {
    const booking = bookings.find(
      (b) =>
        b.startDate &&
        b.endDate &&
        (isWithinInterval(day, { start: new Date(b.startDate), end: new Date(b.endDate) }) ||
          isSameDay(day, new Date(b.startDate)) ||
          isSameDay(day, new Date(b.endDate)))
    );
    if (booking) {
      setSelectedBooking(booking);
    }
  };

  const bookedDaysModifier = { booked: bookedDays };
  const todayModifier = today ? { today: today } : {};

  return (
    <>
      <Card>
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle className="font-headline text-2xl">Upcoming Stays</CardTitle>
            <CardDescription>View your upcoming bookings here.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="grid">
                <Grid3x3 className="mr-2 h-4 w-4" />
                Grid View
              </TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="mt-4">
              <div className="rounded-lg border">
                {loading || !month ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <Calendar
                      mode="multiple"
                      numberOfMonths={3}
                      pagedNavigation
                      fixedWeeks
                      selected={undefined}
                      onDayClick={handleDayClick}
                      month={month}
                      onMonthChange={setMonth}
                      modifiers={{
                        ...bookedDaysModifier,
                        ...todayModifier,
                      }}
                      modifiersClassNames={{
                        booked:
                          'bg-primary/90 text-primary-foreground rounded-md [&:not(.day-outside)]:bg-primary/90',
                        today:
                          'bg-orange-500/90 text-orange-50 rounded-full [&:not([aria-selected])]:bg-orange-500/90',
                      }}
                      classNames={{
                        day_outside: 'text-muted-foreground opacity-50',
                      }}
                    />
                    <div className="p-4 border-t flex items-center gap-4 text-sm">
                      <span className="font-bold">Legend:</span>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-orange-500" />
                        <span>Today</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-md bg-primary" />
                        <span>Upcoming Stay</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent value="grid" className="mt-4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                  <p>You have no upcoming stays.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Summary of your upcoming stay.</DialogDescription>
          </DialogHeader>
          {selectedBooking && <BookingSummaryCard booking={selectedBooking} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
