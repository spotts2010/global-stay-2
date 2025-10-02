// src/components/BookingCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { EnrichedBooking } from '@/lib/data';
import { CalendarDays, Eye, Users } from 'lucide-react';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { convertCurrency, formatCurrency } from '@/lib/currency';

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/1/600/400';

export const BookingCard = ({ booking }: { booking: EnrichedBooking }) => {
  const { preferences } = useUserPreferences();
  if (!booking.accommodation) return null;

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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={booking.accommodation.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl">
          <Link
            href={`/accommodation/${booking.accommodation.id}`}
            className="hover:text-primary transition-colors"
          >
            {booking.accommodation.name}
          </Link>
        </CardTitle>
        <div className="text-sm text-muted-foreground mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>
              {booking.startDate && booking.endDate
                ? `${format(new Date(booking.startDate), 'LLL dd, yyyy')} - ${format(new Date(booking.endDate), 'LLL dd, yyyy')}`
                : 'Dates not specified'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{booking.guests} Guests</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-semibold text-lg text-foreground">
          <span>{formatCurrency(convertedPrice, preferences.currency)}</span>
        </div>
        <Button size="sm" asChild>
          <Link href={`/accommodation/${booking.accommodation.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
