'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Save, Loader2, Building2 } from 'lucide-react';
import React, { useState, useTransition, useEffect, use } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Accommodation } from '@/lib/data';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fetchAccommodationById } from '@/lib/firestore';

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

function AmenitiesPageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Amenity['category']>('All');

  const form = useForm({
    defaultValues: {
      amenities: listing?.amenities || [],
    },
  });

  const handleSave = (formData: { amenities: string[] }) => {
    startTransition(async () => {
      console.log('Saving amenities:', formData.amenities);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Changes Saved',
        description: 'The shared amenities have been updated.',
      });
      form.reset({ amenities: formData.amenities });
    });
  };

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
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Shared Amenities &amp; Facilities
            </CardTitle>
            <CardDescription>
              Select all the shared amenities that apply to this property.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as Amenity['category'])}
                  >
                    <TabsList className="mb-4 flex-wrap h-auto">
                      {amenityCategories.map((category) => (
                        <TabsTrigger key={category} value={category}>
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {amenityCategories.map((category) => (
                      <TabsContent key={category} value={category}>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3">
                          {amenitiesList
                            .filter(
                              (amenity) => category === 'All' || amenity.category === category
                            )
                            .map((amenity) => (
                              <FormField
                                key={amenity.id}
                                control={form.control}
                                name="amenities"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={amenity.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(amenity.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), amenity.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== amenity.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{amenity.label}</FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="sticky bottom-0 py-4 flex justify-start">
          <Button type="submit" disabled={isPending || !form.formState.isDirty}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
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
