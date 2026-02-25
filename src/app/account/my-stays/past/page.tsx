// src/app/account/my-stays/past/page.tsx

export const runtime = 'nodejs';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPastBookings } from '@/lib/firestore.server';

type AnyBooking = {
  id: string;
  accommodation?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  total?: number | string;
};

export default async function PastStaysPage() {
  const bookings = (await fetchPastBookings('me')) as unknown as AnyBooking[];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Past stays</h1>
        <p className="text-sm text-muted-foreground">Your previous bookings and stay history.</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No past stays</CardTitle>
            <CardDescription>When you complete a booking, it will appear here.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{b.accommodation ?? 'Accommodation'}</CardTitle>
                <CardDescription className="line-clamp-1">&nbsp;</CardDescription>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Check-in</span>
                  <span>{b.checkIn ?? '-'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Check-out</span>
                  <span>{b.checkOut ?? '-'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Guests</span>
                  <span>{typeof b.guests === 'number' ? b.guests : '-'}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Total</span>
                  <span>{b.total ?? '-'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
