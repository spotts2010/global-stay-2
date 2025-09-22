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

const propertyFormSchema = z.object({
  name: z.string().min(1, 'Listing name is required'),
  type: z.string().min(1, 'Property type is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const AddressAutocomplete = ({
  field,
}: {
  field: {
    onChange: (value: string) => void;
    value: string;
    name: string;
    onBlur: () => void;
    ref: React.Ref<HTMLInputElement>;
  };
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const placePickerRef = React.useRef<HTMLElement & { value: google.maps.places.Place }>(null); // Ref for the web component

  React.useEffect(() => {
    const picker = placePickerRef.current;
    if (!picker) return;

    const handlePlaceChange = () => {
      const place = picker.value;
      if (place?.formattedAddress) {
        field.onChange(place.formattedAddress);
      }
    };

    picker.addEventListener('gmp-placechange', handlePlaceChange);

    return () => {
      picker.removeEventListener('gmp-placechange', handlePlaceChange);
    };
  }, [field]);

  return (
    <div className="relative">
      <gmp-place-picker
        ref={placePickerRef}
        for-input-id="address-input"
        class="w-full"
        placeholder="Search for an address"
        country-codes={['AU', 'US', 'GB', 'NZ']}
      >
        <Input id="address-input" {...field} ref={inputRef} className="pr-8" />
      </gmp-place-picker>
      <MapPin className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
};

function AboutPageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: listing?.name || '',
      type: listing?.type || 'Hotel',
      location: listing?.location || '',
      description: listing?.description || '',
    },
  });

  const handleSave = (formData: PropertyFormValues) => {
    startTransition(async () => {
      const result = await updateAccommodationAction(listing.id, formData);
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'The property details have been updated.',
        });
        form.reset(formData); // Resets the form's dirty state to the new values
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
            {
              label: listing.name,
              href: `/admin/listings/${listing.id}/edit/about`,
            },
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <AddressAutocomplete field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

// This is the main page component that receives props from the layout
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
  return <AboutPageClient listing={listing} />;
}
