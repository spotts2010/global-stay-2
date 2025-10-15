// src/components/NewListingClient.tsx
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
import { Save, Loader2, MapPin, SquarePen } from '@/lib/icons';
import React, { useState, useTransition, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createListingAction } from '@/app/actions';
import { Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { formatPlaceResult } from '@/utils/formatPlaceResult';
import { useRouter } from 'next/navigation';

const addressSchema = z.object({
  formatted: z.string().optional(),
  streetNumber: z.string().optional(),
  street: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  state: z.object({ short: z.string(), long: z.string() }).optional(),
  country: z.object({ short: z.string(), long: z.string() }).optional(),
  postcode: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  searchIndex: z.string().optional(),
});

const propertyFormSchema = z.object({
  name: z.string().min(1, 'Listing name is required'),
  type: z.string().min(1, 'Property type is required'),
  starRating: z.coerce.number().optional(),
  description: z.string().optional(),
  address: addressSchema.optional(),
  location: z.string().min(1, 'Location is required'),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;
type Position = { lat: number; lng: number };

function AddressAutocomplete({
  onPlaceSelected,
  initialValue,
}: {
  onPlaceSelected: (place: google.maps.places.PlaceResult | null) => void;
  initialValue: string;
}) {
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types', 'address_components'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      onPlaceSelected(autocomplete.getPlace());
    });

    return () => listener.remove();
  }, [places, onPlaceSelected]);

  return (
    <div className="relative w-full">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        ref={inputRef}
        defaultValue={initialValue}
        className="pl-10 bg-white"
        placeholder="Search for an address"
        onChange={(e) => {
          if (!e.target.value) onPlaceSelected(null);
        }}
      />
    </div>
  );
}

function MapView({
  markerPosition,
  onMarkerDragEnd,
  mapKey,
}: {
  markerPosition: Position | null;
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
  mapKey: number;
}) {
  return (
    <div style={{ height: '400px', width: '100%' }} className="rounded-lg overflow-hidden border">
      <Map
        key={mapKey}
        mapId="DEMO_MAP_ID"
        style={{ width: '100%', height: '100%' }}
        defaultCenter={markerPosition || { lat: -25.2744, lng: 133.7751 }}
        defaultZoom={markerPosition ? 15 : 4}
        gestureHandling={'auto'}
        disableDefaultUI={false}
      >
        {markerPosition && (
          <AdvancedMarker
            position={markerPosition}
            gmpDraggable
            onDragEnd={onMarkerDragEnd}
          ></AdvancedMarker>
        )}
      </Map>
    </div>
  );
}

export default function NewListingClient() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const [mapKey, setMapKey] = useState(0);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: '',
      type: 'Hotel',
      starRating: undefined,
      description: '',
      address: {},
      location: '',
    },
  });

  const [markerPosition, setMarkerPosition] = useState<Position | null>(null);

  const handlePlaceSelected = (place: google.maps.places.PlaceResult | null) => {
    if (!place) return;
    const structuredAddress = formatPlaceResult(place);
    const { lat, lng, formatted } = structuredAddress;
    if (lat && lng) {
      const newPosition = { lat, lng };
      setMarkerPosition(newPosition);
      form.setValue('address', structuredAddress, { shouldDirty: true });
      form.setValue('location', formatted || '', { shouldDirty: true });
      setMapKey((prevKey) => prevKey + 1);
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPosition);
      form.setValue('address.lat', newPosition.lat, { shouldDirty: true });
      form.setValue('address.lng', newPosition.lng, { shouldDirty: true });
    }
  };

  const handleSave = (formData: PropertyFormValues) => {
    startTransition(async () => {
      const { location: _, ...dataToSave } = formData;
      const result = await createListingAction(dataToSave);
      if (result.success && result.id) {
        toast({
          title: 'Listing Created',
          description: `"${dataToSave.name}" created successfully. You will be redirected to edit the new listing.`,
        });
        router.push(`/admin/listings/${result.id}/edit/about`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Creation Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SquarePen className="h-6 w-6 text-primary" />
              Property Details
            </CardTitle>
            <CardDescription>Enter the main details for your new property listing.</CardDescription>
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
                        <Input {...field} className="bg-white" />
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
                  <FormLabel>Property Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Location</FormLabel>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <AddressAutocomplete
                          onPlaceSelected={handlePlaceSelected}
                          initialValue={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormLabel>Map View</FormLabel>
                <MapView
                  markerPosition={markerPosition}
                  onMarkerDragEnd={handleMarkerDragEnd}
                  mapKey={mapKey}
                />
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
              Create Listing
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
