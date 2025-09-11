'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function formatRangeUK(range: DateRange | undefined) {
  if (!range?.from || !range?.to) return '';
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${fmt(range.from)} – ${fmt(range.to)}`;
}

export default function AccommodationSearchForm() {
  const router = useRouter();
  const params = useSearchParams();

  // Initialize state with default values
  const [location, setLocation] = React.useState('');
  const [guests, setGuests] = React.useState<number>(2);
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);

  // Defer reading from searchParams until the component has mounted on the client
  React.useEffect(() => {
    setLocation(params.get('location') ?? '');
    const g = parseInt(params.get('guests') ?? '2', 10);
    setGuests(Number.isFinite(g) && g > 0 ? g : 2);
    const from = params.get('from');
    const to = params.get('to');
    if (from && to) {
      const f = new Date(from);
      const t = new Date(to);
      if (!isNaN(+f) && !isNaN(+t)) {
        setRange({ from: f, to: t });
      }
    }
  }, [params]);

  // Date popover (headless)
  const pickerRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!pickerRef.current) return;
      if (!pickerRef.current.contains(e.target as Node)) {
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
    if (range?.from) search.set('from', range.from.toISOString());
    if (range?.to) search.set('to', range.to.toISOString());
    search.set('guests', String(guests));
    router.push(`/results?${search.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-6 w-full max-w-4xl rounded-lg shadow-md border border-slate-200 bg-white"
      aria-label="Accommodation search"
    >
      <div className="flex flex-col md:flex-row md:items-stretch md:divide-x divide-y md:divide-y-0 divide-slate-200">
        {/* Location */}
        <div className="flex min-w-0 flex-1 items-center gap-2 px-4 h-14">
          <MapPin className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
          <input
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
        <div className="relative flex items-center gap-2 px-4 h-14" ref={pickerRef}>
          <Calendar className="w-4 h-4 shrink-0 text-slate-500" aria-hidden />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="truncate w-full text-left bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 outline-none"
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            {range?.from && range?.to ? formatRangeUK(range) : 'Pick a date range'}
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
        <div className="flex items-center gap-2 px-4 h-14">
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

        {/* Search Button */}
        <div className="flex items-center">
          <button
            type="submit"
            className="inline-flex h-full items-center gap-2 rounded-none rounded-r-lg bg-blue-600 px-4 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 justify-center w-full md:w-auto"
          >
            <Search className="w-4 h-4" aria-hidden />
            <span className="text-[15px] font-medium">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
