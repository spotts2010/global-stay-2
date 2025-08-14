'use client';

import * as React from 'react';
import { addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

// Example of unavailable dates - in a real app, this would come from props/API
const unavailableDates = [new Date(), addDays(new Date(), 2), addDays(new Date(), 5)];

export default function AvailabilityCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-headline text-lg font-bold mb-4">Check Availability</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(day) =>
          day < new Date() ||
          unavailableDates.some((unavailableDate) => {
            return day.getFullYear() === unavailableDate.getFullYear() &&
                   day.getMonth() === unavailableDate.getMonth() &&
                   day.getDate() === unavailableDate.getDate();
          })
        }
        className="rounded-md"
      />
      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-muted border"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-destructive/20 border border-destructive/50 line-through"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
