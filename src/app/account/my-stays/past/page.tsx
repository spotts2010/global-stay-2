// src/app/account/my-stays/past/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPastBookings } from '@/lib/firestore';
import type { EnrichedBooking } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { BookingCard } from '@/components/BookingCard';

export default function PastStaysPage() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPastBookings = async () => {
      setLoading(true);
      // In a real app, you'd get the logged-in user's ID
      const userId = 'user1';
      const fetchedBookings = await fetchPastBookings(userId);

      setBookings(fetchedBookings);
      setLoading(false);
    };
    getPastBookings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Past Stays</CardTitle>
        <CardDescription>A record of your previous adventures.</CardDescription>
      </CardHeader>
      <CardContent>
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
            <p>You have no past stays recorded.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
