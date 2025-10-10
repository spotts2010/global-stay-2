'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, CalendarDays, Users, Search } from '@/lib/icons';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

function formatRangeUK(range: DateRange | undefined) {
  if (!range?.from) return 'Pick a date range';
  if (!range.to) return format(range.from, 'LLL dd, yyyy');
  return `${format(range.from, 'LLL dd, yyyy')} – ${format(range.to, 'LLL dd, yyyy')}`;
}

function toURLDateString(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export default function AccommodationSearchForm() {
  const router = useRouter();
  const params = useSearchParams();
  const places = useMapsLibrary('places');

  const [location, setLocation] = React.useState('');
  const [guests, setGuests] = React.useState<number>(2);
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);
  const locationInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setLocation(params.get('location') || '');
    setGuests(Number(params.get('guests')) || 2);
    const fromParam = params.get('from');
    const toParam = params.get('to');
    if (fromParam) {
      const fromDate = parseISO(fromParam);
      const toDate = toParam ? parseISO(toParam) : undefined;
      if (!isNaN(fromDate.getTime())) {
        setRange({ from: fromDate, to: toDate });
      }
    } else {
      setRange(undefined);
    }
  }, [params]);

  React.useEffect(() => {
    if (!places || !locationInputRef.current) return;

    const autocomplete = new places.Autocomplete(locationInputRef.current, {
      fields: ['formatted_address'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setLocation(place.formatted_address);
      }
    });

    return () => {
      listener.remove();
    };
  }, [places]);

  const pickerRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const isLarge =
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const search = new URLSearchParams();
    if (location.trim()) search.set('location', location.trim());
    if (range?.from) search.set('from', toURLDateString(range.from));
    if (range?.to) search.set('to', toURLDateString(range.to));
    if (guests) search.set('guests', String(guests));
    router.push(`/results?${search.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-4xl rounded-lg shadow-md border border-slate-200 bg-white"
      aria-label="Accommodation search"
    >
      <div className="flex flex-col md:flex-row md:items-stretch md:divide-x divide-y md:divide-y-0 divide-slate-200">
        {/* Location */}
        <div className="flex-grow min-w-0 flex items-center gap-2 px-4 h-14">
          <MapPin className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
          <input
            ref={locationInputRef}
            type="text"
            inputMode="search"
            autoComplete="off"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 outline-none h-14"
            aria-label="Location"
          />
        </div>

        {/* Dates */}
        <div
          className="relative flex-shrink-0 flex items-center gap-2 px-4 h-14 w-full md:w-64"
          ref={pickerRef}
        >
          <CalendarDays className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="truncate w-full text-left bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 outline-none"
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <span className={cn(!range?.from && 'text-slate-400')}>{formatRangeUK(range)}</span>
          </button>

          {open && (
            <div className="absolute left-0 top-full z-50 mt-2 rounded-md border border-slate-200 bg-white p-3 shadow-xl">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={isLarge ? 2 : 1}
                pagedNavigation
                weekStartsOn={1}
                className="rdp-custom"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                  onClick={() => setRange(undefined)}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                  onClick={() => setOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="flex flex-shrink-0 items-center gap-2 px-4 h-14 w-full md:w-36">
          <Users className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value, 10))}
            aria-label="Guests"
            className="w-full bg-transparent text-[15px] text-slate-800 outline-none"
          >
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button - restructured for mobile */}
        <div className="p-2 md:p-0">
          <button
            type="submit"
            className={cn(
              'inline-flex h-full min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-6 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              'md:min-h-0 md:rounded-l-none md:rounded-r-md'
            )}
          >
            <Search className="w-4 h-4" aria-hidden />
            <span className="text-[15px] font-medium">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
