'use client';

import React, { useState, useTransition, useEffect, use } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Save, Loader2, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Accommodation } from '@/lib/data';
import { Form, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { fetchAccommodationById } from '@/lib/firestore';
import { updateAccommodationAction } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Amenity = {
  id: string;
  label: string;
  category: 'All' | 'General' | 'Food & Drink' | 'Activities' | 'Outdoor' | 'Safety' | 'Services';
};

const amenitiesList: Amenity[] = [
  { id: 'wifi', label: 'Wi-Fi', category: 'General' },
  { id: 'parking', label: 'Free Parking', category: 'General' },
  { id: 'lifts', label: 'Lifts', category: 'General' },
  { id: 'checkin_247', label: '24/7 Check-in', category: 'General' },
  { id: 'ev_charger', label: 'EV Charging Station', category: 'General' },
  { id: 'pet_friendly', label: 'Pet Friendly', category: 'General' },
  { id: 'wheelchair_access', label: 'Wheelchair Access', category: 'General' },
  { id: 'lounge', label: 'Lounge', category: 'General' },
  { id: 'books', label: 'Book Exchange', category: 'General' },
  { id: 'restaurant', label: 'Restaurant', category: 'Food & Drink' },
  { id: 'bar', label: 'Bar', category: 'Food & Drink' },
  { id: 'kitchen', label: 'Shared Kitchen', category: 'Food & Drink' },
  { id: 'tennis', label: 'Tennis', category: 'Activities' },
  { id: 'pool', label: 'Pool', category: 'Outdoor' },
  { id: 'jacuzzi', label: 'Hot Tub / Jacuzzi', category: 'Outdoor' },
  { id: 'garden', label: 'Garden', category: 'Outdoor' },
  { id: 'bbq', label: 'BBQ', category: 'Outdoor' },
  { id: 'basketball', label: 'Basketball Courts', category: 'Activities' },
  { id: 'beach_volleyball', label: 'Beach Volleyball', category: 'Activities' },
  { id: 'bike_hire', label: 'Bike Hire', category: 'Activities' },
  { id: 'boat_hire', label: 'Boat Hire', category: 'Activities' },
  { id: 'casino', label: 'Casino', category: 'Activities' },
  { id: 'games_room', label: 'Games Room', category: 'Activities' },
  { id: 'golf_course', label: 'Golf Course', category: 'Activities' },
  { id: 'gym', label: 'Gym / Fitness Center', category: 'Activities' },
  { id: 'kayaks', label: 'Kayaks', category: 'Activities' },
  { id: 'volleyball', label: 'Volleyball', category: 'Activities' },
  { id: 'smoke_detector', label: 'Smoke Detector', category: 'Safety' },
  { id: 'co_detector', label: 'Carbon Monoxide Detector', category: 'Safety' },
  { id: 'fire_extinguisher', label: 'Fire Extinguisher', category: 'Safety' },
  { id: 'laundry', label: 'Laundry Facilities', category: 'Services' },
  { id: 'concierge', label: 'Concierge Service', category: 'Services' },
  { id: 'luggage_storage', label: 'Luggage Storage', category: 'Services' },
  { id: 'spa_treatments', label: 'Spa Treatments', category: 'Services' },
].sort((a, b) => a.label.localeCompare(b.label));

const amenityCategories: Amenity['category'][] = [
  'All',
  'General',
  'Food & Drink',
  'Activities',
  'Outdoor',
  'Safety',
  'Services',
];

type FormValues = {
  amenities: string[];
  chargeableAmenities: string[];
};

// --- Custom SVG Icons ---
const DisabledFeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" stroke="#B3B3B3" strokeWidth="1.5" />
    <path
      d="M16 8h-6c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2 .9 2 2s-.9 2-2 2H8"
      stroke="#B3B3B3"
      strokeWidth="1.5"
    />
    <path d="M12 18V6" stroke="#B3B3B3" strokeWidth="1.5" />
  </svg>
);

const InactiveFeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.5" />
    <path
      d="M16 8h-6c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2 .9 2 2s-.9 2-2 2H8"
      stroke="black"
      strokeWidth="1.5"
    />
    <path d="M12 18V6" stroke="black" strokeWidth="1.5" />
  </svg>
);

const ActiveFeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" fill="#2682CE" stroke="#2682CE" strokeWidth="1.5" />
    <path
      d="M16 8h-6c-1.1 0-2 .9-2 2s.9 2 2 2h4c1.1 0 2 .9 2 2s-.9 2-2 2H8"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 18V6"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const AmenityItem = ({ amenity }: { amenity: Amenity }) => {
  const { watch, setValue, getValues } = useFormContext<FormValues>();
  const isIncluded = watch('amenities')?.includes(amenity.id);
  const isChargeable = watch('chargeableAmenities')?.includes(amenity.id);

  const handleChargeableToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isIncluded) return;

    const currentChargeable = getValues('chargeableAmenities') || [];
    const newChargeable = isChargeable
      ? currentChargeable.filter((id) => id !== amenity.id)
      : [...currentChargeable, amenity.id];
    setValue('chargeableAmenities', newChargeable, { shouldDirty: true });
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2 rounded-md border transition-colors',
        isIncluded ? 'bg-accent border-primary/50' : 'bg-transparent border-border'
      )}
    >
      <Checkbox
        id={`amenity-${amenity.id}`}
        checked={isIncluded}
        onCheckedChange={(checked) => {
          const amenities = getValues('amenities') || [];
          const updatedAmenities = checked
            ? [...amenities, amenity.id]
            : amenities.filter((value) => value !== amenity.id);
          setValue('amenities', updatedAmenities, { shouldDirty: true });

          if (!checked) {
            const currentChargeable = getValues('chargeableAmenities');
            setValue(
              'chargeableAmenities',
              currentChargeable.filter((id) => id !== amenity.id),
              { shouldDirty: true }
            );
          }
        }}
      />

      <FormLabel
        htmlFor={`amenity-${amenity.id}`}
        className="flex-1 text-sm font-normal truncate cursor-pointer"
      >
        {amenity.label}
      </FormLabel>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn('h-5 w-5', isIncluded ? 'cursor-pointer' : 'cursor-not-allowed')}
              onClick={handleChargeableToggle}
              disabled={!isIncluded}
              aria-label="Toggle chargeable"
            >
              {!isIncluded ? (
                <DisabledFeeIcon className="h-5 w-5" />
              ) : isChargeable ? (
                <ActiveFeeIcon className="h-5 w-5" />
              ) : (
                <InactiveFeeIcon className="h-5 w-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle if fees apply</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

function AmenitiesPageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<Amenity['category']>('All');

  const form = useForm<FormValues>({
    defaultValues: {
      amenities: listing?.amenities || [],
      chargeableAmenities: listing?.chargeableAmenities || [],
    },
  });

  const selectedAmenities = form.watch('amenities') || [];

  const handleSave = (formData: FormValues) => {
    const cleanedData = {
      ...formData,
      chargeableAmenities: formData.chargeableAmenities.filter((chargeable) =>
        formData.amenities.includes(chargeable)
      ),
    };

    startTransition(async () => {
      const result = await updateAccommodationAction(listing.id, cleanedData);
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'The shared amenities have been updated.',
        });
        form.reset(cleanedData);
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const AmenityGrid = ({ amenities }: { amenities: Amenity[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
      {amenities.map((amenity) => (
        <AmenityItem key={amenity.id} amenity={amenity} />
      ))}
    </div>
  );

  const filteredAmenities =
    activeCategory === 'All'
      ? amenitiesList
      : amenitiesList.filter((amenity) => amenity.category === activeCategory);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Listings', href: '/admin/listings' },
            { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
            { label: 'Amenities' },
          ]}
        />
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Shared Amenities &amp; Facilities
                </CardTitle>
                <CardDescription>
                  Select all shared amenities for this property and specify if fees apply.
                </CardDescription>
              </div>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
                className="w-full sm:w-auto"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
            <div className="!mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-5 w-5 inline-block">
                <ActiveFeeIcon className="h-5 w-5" />
              </span>
              <span>
                = When enabled, this icon indicates that additional fees may be applicable.
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Label htmlFor="amenity-category-filter" className="text-sm font-medium">
                Filter by:
              </Label>
              <Select
                value={activeCategory}
                onValueChange={(value) => setActiveCategory(value as Amenity['category'])}
              >
                <SelectTrigger id="amenity-category-filter" className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Filter by category..." />
                </SelectTrigger>
                <SelectContent>
                  {amenityCategories.map((category) => {
                    const selectedInCategory = amenitiesList.filter(
                      (a) =>
                        selectedAmenities.includes(a.id) &&
                        (category === 'All' || a.category === category)
                    );
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center justify-between w-full">
                          <span>{category}</span>
                          <Badge variant="secondary" className="ml-4 px-1.5 py-0">
                            {selectedInCategory.length}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <AmenityGrid amenities={filteredAmenities} />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default function AmenitiesPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const [listing, setListing] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      try {
        const data = await fetchAccommodationById(resolvedParams.id);
        if (data) {
          setListing(data);
        } else {
          setError('Listing not found.');
        }
      } catch (err) {
        setError('Failed to load listing data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadListing();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center text-destructive">
        <h1 className="font-bold text-2xl">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <AmenitiesPageClient listing={listing} />;
}
