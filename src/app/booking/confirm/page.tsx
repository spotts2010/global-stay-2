'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Check, /* Clock, User, */ Users } from 'lucide-react';

export default function BookingConfirmationPage() {
  const { toast } = useToast();

  // Placeholder data - in a real app, this would come from state or URL params
  const bookingDetails = {
    accommodation: {
      name: 'The Oceanfront Pearl',
      location: 'Malibu, California',
    },
    dates: {
      from: '2024-10-15',
      to: '2024-10-20',
    },
    guests: 2,
    pricePerNight: 850,
    nights: 5,
    totalPrice: 4250,
    taxes: 340,
  };

  const handleConfirm = () => {
    toast({
      title: 'Booking Confirmed!',
      description: `Your stay at ${bookingDetails.accommodation.name} is booked.`,
    });
    // In a real app, this would also redirect to a "My Bookings" page or similar
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-2xl pb-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Confirm Your Booking</CardTitle>
          <CardDescription>
            Please review the details below before confirming your stay.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-bold text-lg">{bookingDetails.accommodation.name}</h3>
            <p className="text-muted-foreground">{bookingDetails.accommodation.location}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Check-in / Check-out</p>
                <p className="text-sm text-muted-foreground">
                  {bookingDetails.dates.from} to {bookingDetails.dates.to}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Guests</p>
                <p className="text-sm text-muted-foreground">{bookingDetails.guests} guest(s)</p>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-bold mb-2">Price Details</h4>
            <div className="space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>
                  ${bookingDetails.pricePerNight} x {bookingDetails.nights} nights
                </span>
                <span>${bookingDetails.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & fees</span>
                <span>${bookingDetails.taxes}</span>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${bookingDetails.totalPrice + bookingDetails.taxes}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-lg" size="lg" onClick={handleConfirm}>
            <Check className="mr-2 h-5 w-5" />
            Confirm & Book
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
