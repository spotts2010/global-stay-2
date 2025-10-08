'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, BedDouble, UserPlus, CalendarClock, Save, Loader2 } from '@/lib/icons';
import React, { useTransition, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateUnitAction } from '@/app/actions';
import type { Accommodation, Currency } from '@/lib/data';
import type { BookableUnit } from './UnitsPageClient';
import { useParams } from 'next/navigation';

const pricingSchema = z.object({
  price: z.coerce.number().min(0, 'Price must be a positive number.').optional(),
  currency: z.string().min(1, 'Currency is required.'),
  minStay: z.coerce
    .number()
    .min(1, 'Minimum stay must be at least 1.')
    .optional()
    .or(z.literal('')),
  maxStay: z.coerce
    .number()
    .min(1, 'Maximum stay must be at least 1.')
    .optional()
    .or(z.literal('')),
  includedOccupancy: z.coerce
    .number()
    .min(1, 'Included occupancy must be at least 1.')
    .optional()
    .or(z.literal('')),
  extraGuestFee: z.coerce
    .number()
    .min(0, 'Fee must be a positive number.')
    .optional()
    .or(z.literal('')),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

export default function PricingPageClient({
  listing,
  unit,
}: {
  listing: Accommodation;
  unit: BookableUnit;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const unitId = params.unitId as string;
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      price: unit.price || 0,
      currency: listing.currency,
      minStay: unit.minStay || '',
      maxStay: unit.maxStay || '',
      includedOccupancy: unit.includedOccupancy || '',
      extraGuestFee: unit.extraGuestFee || '',
    },
  });

  const onSubmit = (data: PricingFormValues) => {
    const dataToSave = {
      price: data.price,
      currency: data.currency as Currency,
      minStay: data.minStay === '' ? undefined : Number(data.minStay),
      maxStay: data.maxStay === '' ? undefined : Number(data.maxStay),
      includedOccupancy: data.includedOccupancy === '' ? undefined : Number(data.includedOccupancy),
      extraGuestFee: data.extraGuestFee === '' ? undefined : Number(data.extraGuestFee),
    };

    startTransition(async () => {
      const result = await updateUnitAction(listing.id, unitId, dataToSave);
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: "The unit's pricing has been updated.",
        });
        form.reset(data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error,
        });
      }
    });
  };

  const pricingModel = unit.type === 'Room' ? 'Per Unit' : 'Per Person';

  if (!hasMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Pricing & Stay Requirements
          </CardTitle>
          <CardDescription>
            Set the pricing model, rates, and stay conditions for this unit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Pricing & Stay Requirements
            </CardTitle>
            <CardDescription>
              Set the pricing model, rates, and stay conditions for this unit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['base-pricing']} className="w-full space-y-4">
              {/* Base Pricing Section */}
              <AccordionItem
                value="base-pricing"
                className="p-4 bg-background border rounded-lg hover:bg-accent/50"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Base Pricing
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Base Rate (per night)*</Label>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 150" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Currency</Label>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                              <SelectItem value="USD">USD - United States Dollar</SelectItem>
                              <SelectItem value="GBP">GBP - British Pound</SelectItem>
                              <SelectItem value="EUR">EUR - Euro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <Label>Pricing Model</Label>
                      <div className="flex items-center h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm">
                        {pricingModel === 'Per Unit' ? (
                          <BedDouble className="mr-2 h-4 w-4 text-muted-foreground" />
                        ) : (
                          <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        {pricingModel}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Stay Requirements Section */}
              <AccordionItem
                value="stay-requirements"
                className="p-4 bg-background border rounded-lg hover:bg-accent/50"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    Stay Requirements
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="minStay"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Minimum Stay (nights)</Label>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxStay"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Maximum Stay (nights)</Label>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 28 (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Extra Guest Fees Section - ONLY for Room types */}
              {unit.type === 'Room' && (
                <AccordionItem
                  value="extra-fees"
                  className="p-4 bg-background border rounded-lg hover:bg-accent/50"
                >
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Extra Guest Fees
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="includedOccupancy"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Base price covers up to</Label>
                            <FormControl>
                              <Input type="number" placeholder="Number of guests..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="extraGuestFee"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Extra Guest Fee (per night)</Label>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 25 (if applicable)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-start gap-2">
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
    </FormProvider>
  );
}
