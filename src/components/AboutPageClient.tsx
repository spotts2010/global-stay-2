// src/components/AboutPageClient.tsx

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
import type { Accommodation, Address } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Save, Loader2, SquarePen } from '@/lib/icons';
import React, { useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateAccommodationAction } from '@/app/actions';
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

const AboutMapSection = dynamic(() => import('@/components/maps/about-map-section'), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border h-[400px] w-full">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

const addressSchema = z.object({
  formatted: z.string().min(1),
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
  name: z.string().min(1),
  type: z.string().min(1),
  starRating: z.coerce.number().optional(),
  description: z.string().optional(),
  address: addressSchema,
  location: z.string().min(1),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;
type Position = { lat: number; lng: number };

export default function AboutPageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const defaultAddress: Address = {
    formatted: '',
    streetNumber: '',
    street: '',
    city: '',
    county: '',
    state: { short: '', long: '' },
    country: { short: '', long: '' },
    postcode: '',
    lat: -26.65,
    lng: 153.09,
  };

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: listing?.name || '',
      type: listing?.type || 'Hotel',
      starRating: listing?.starRating,
      description: listing?.description || '',
      address: listing?.address || defaultAddress,
      location: listing?.address?.formatted || '',
    },
  });

  const handleSave = (formData: PropertyFormValues) => {
    startTransition(async () => {
      const { location: _, ...dataToSave } = formData;
      const result = await updateAccommodationAction(listing.id, dataToSave);

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
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name },
          { label: 'About' },
        ]}
      />

      {!hasMounted ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SquarePen className="h-6 w-6 text-primary" />
                  About the Property
                </CardTitle>
                <CardDescription>Update the core details of your listing here.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* form fields remain unchanged */}

                <AboutMapSection form={form} />
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
      )}
    </div>
  );
}
