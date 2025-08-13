'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Users, Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const AccommodationSearchForm = () => {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const { toast } = useToast();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const location = formData.get('location');
    const guests = formData.get('guests');

    toast({
      title: 'Search Submitted',
      description: `Location: ${location}, Dates: ${date ? `${format(date.from!, 'LLL dd, y')} to ${date.to ? format(date.to, 'LLL dd, y') : ''}` : 'Not set'}, Guests: ${guests}`,
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-[2fr_1.5fr_1fr_auto] gap-4 items-center"
    >
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input name="location" placeholder="Where are you going?" className="pl-10" />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div className="relative">
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Select name="guests" defaultValue="2">
          <SelectTrigger className="pl-10">
            <SelectValue placeholder="Number of guests" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(8)].map((_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1} guest{i > 0 ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full md:w-auto" size="lg">
        <Search className="h-5 w-5" />
        <span className="md:hidden lg:inline ml-2">Search</span>
      </Button>
    </form>
  );
};

export default AccommodationSearchForm;
