'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Accommodation } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Save, Loader2, Home, MapPin } from 'lucide-react';
import React, { useEffect, useState, useTransition, use } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchAccommodationById } from '@/lib/firestore';
import { updateAccommodationAction } from '@/app/actions';
import { APIProvider, Map, AdvancedMarker, MapMouseEvent } from '@vis.gl/react-google-maps';

interface GmpPlacePicker extends HTMLElement {
  value: {
    formattedAddress: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
}

const propertyFormSchema = z.object({
  name: z.string().min(1, 'Listing name is required'),
  type: z.string().min(1, 'Property type is required'),
  starRating: z.coerce.number().optional(),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;
type Position = { lat: number; lng: number };

const AddressAutocomplete = ({
  field,
  onPlaceSelected,
}: {
  field: {
    onChange: (value: string) => void;
    value: string;
    name: string;
    onBlur: () => void;
    ref: React.Ref<HTMLInputElement>;
  };
  onPlaceSelected: (position: Position) => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const placePickerRef = React.useRef<GmpPlacePicker>(null);

  React.useEffect(() => {
    const picker = placePickerRef.current;
    if (!picker) return;

    const handlePlaceChange = () => {
      const place = picker.value;
      if (place?.formattedAddress && place.location) {
        field.onChange(place.formattedAddress);
        onPlaceSelected({ lat: place.location.latitude, lng: place.location.longitude });
      }
    };

    picker.addEventListener('gmp-placechange', handlePlaceChange);
    return () => {
      picker.removeEventListener('gmp-placechange', handlePlaceChange);
    };
  }, [field, onPlaceSelected]);

  return (
    <div className="relative">
      <gmp-place-picker
        ref={placePickerRef}
        for-input-id="address-input"
        class="w-full"
        country-codes="AU,US,GB,NZ"
      >
        <Input
          id="address-input"
          {...field}
          ref={inputRef}
          placeholder="Search for an address"
          className="pr-8"
        />
      </gmp-place-picker>
      <MapPin className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
};

function AboutPageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [markerPosition, setMarkerPosition] = useState<Position | null>(
    listing.lat && listing.lng ? { lat: listing.lat, lng: listing.lng } : null
  );

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: listing?.name || '',
      type: listing?.type || 'Hotel',
      starRating: listing?.starRating,
      location: listing?.location || '',
      description: listing?.description || '',
      lat: listing?.lat,
      lng: listing?.lng,
    },
  });

  const handlePlaceSelected = (newPosition: Position) => {
    setMarkerPosition(newPosition);
    form.setValue('lat', newPosition.lat, { shouldDirty: true });
    form.setValue('lng', newPosition.lng, { shouldDirty: true });
  };

  const handleMarkerDragEnd = (e: MapMouseEvent) => {
    const lat = e.detail.latLng?.lat;
    const lng = e.detail.latLng?.lng;
    if (lat === undefined || lng === undefined) return;
    const newPos = { lat, lng };
    setMarkerPosition(newPos);
    form.setValue('lat', newPos.lat, { shouldDirty: true });
    form.setValue('lng', newPos.lng, { shouldDirty: true });
    toast({
      title: 'Location Updated',
      description: 'The map marker has been moved.',
    });
  };

  const handleSave = (formData: PropertyFormValues) => {
    startTransition(async () => {
      const result = await updateAccommodationAction(listing.id, formData);
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'The property details have been updated.',
        });
        form.reset(formData);
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Listings', href: '/admin/listings' },
            { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
            { label: 'About' },
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              About the Property
            </CardTitle>
            <CardDescription>Update the core details of your listing here.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow-[3]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Listing Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow-[2]">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Hotel">Hotel</SelectItem>
                          <SelectItem value="Loft">Loft</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Hostel">Hostel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow-[1]">
                <FormField
                  control={form.control}
                  name="starRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Star Rating</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value ? parseInt(value, 10) : undefined)
                        }
                        value={field.value?.toString() ?? ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="N/A" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <AddressAutocomplete field={field} onPlaceSelected={handlePlaceSelected} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Map View</FormLabel>
              <div
                className="aspect-video w-full rounded-lg overflow-hidden border"
                style={{ transform: 'translateZ(0)' }}
              >
                {markerPosition ? (
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                    <Map
                      mapId="DEMO_MAP_ID"
                      defaultCenter={markerPosition}
                      defaultZoom={15}
                      gestureHandling="greedy"
                      onClick={(ev: MapMouseEvent) => {
                        const lat = ev.detail.latLng?.lat;
                        const lng = ev.detail.latLng?.lng;
                        if (!lat || !lng) return;
                        const newPos = { lat, lng };
                        setMarkerPosition(newPos);
                        form.setValue('lat', newPos.lat, { shouldDirty: true });
                        form.setValue('lng', newPos.lng, { shouldDirty: true });
                      }}
                    >
                      <AdvancedMarker
                        position={markerPosition}
                        draggable
                        onDragEnd={handleMarkerDragEnd}
                      />
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-center p-4">
                    Enter an address to see its location on the map.
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isPending || !form.formState.isDirty}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default function AboutPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const [listing, setListing] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      try {
        const data = await fetchAccommodationById(resolvedParams.id);
        if (data) setListing(data);
        else setError('Listing not found.');
      } catch (err) {
        setError('Failed to load listing data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadListing();
  }, [resolvedParams.id]);

  if (loading)
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (error || !listing)
    return (
      <div className="text-center text-destructive">
        <h1 className="font-bold text-2xl">Error</h1>
        <p>{error}</p>
      </div>
    );

  return <AboutPageClient listing={listing} />;
}
