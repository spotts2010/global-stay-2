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
import { Bed, Bath, Users, PlusCircle, Trash2, Save, Loader2 } from '@/lib/icons';
import React, { useTransition, useEffect, useState } from 'react';
import type { BedType } from '@/lib/data';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { updateUnitAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import type { BookableUnit } from './UnitsPageClient';

const bedConfigSchema = z.object({
  id: z.string().optional(), // Keep for keying, but don't save
  type: z.string().min(1, 'Bed type is required.'),
  sleeps: z.coerce.number().min(1, 'Sleeps count is required.'),
  count: z.coerce.number().min(1, 'Quantity must be at least 1.'),
});

const occupancyLayoutSchema = z.object({
  minOccupancy: z.coerce.number().optional().or(z.literal('')),
  maxOccupancy: z.coerce.number().min(1, 'Max Occupancy is required.').or(z.literal('')),
  bedConfigs: z.array(bedConfigSchema),
  privateBathrooms: z.coerce.number().optional().or(z.literal('')),
  sharedBathrooms: z.coerce.number().optional().or(z.literal('')),
});

type OccupancyLayoutFormValues = z.infer<typeof occupancyLayoutSchema>;

export default function OccupancyLayoutClient({
  listingId,
  unit,
  bedTypes,
}: {
  listingId: string;
  unit: BookableUnit | null;
  bedTypes: BedType[];
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const params = useParams();
  const unitId = params.unitId as string;
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const form = useForm<OccupancyLayoutFormValues>({
    resolver: zodResolver(occupancyLayoutSchema),
    defaultValues: {
      minOccupancy: unit?.minOccupancy || '',
      maxOccupancy: unit?.maxOccupancy || '',
      bedConfigs: unit?.bedConfigs || [],
      privateBathrooms: unit?.privateBathrooms || 0,
      sharedBathrooms: unit?.sharedBathrooms || 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'bedConfigs',
  });

  const onSubmit = (data: OccupancyLayoutFormValues) => {
    const dataToSave = {
      ...data,
      minOccupancy: data.minOccupancy === '' ? undefined : Number(data.minOccupancy),
      maxOccupancy: data.maxOccupancy === '' ? undefined : Number(data.maxOccupancy),
      privateBathrooms: data.privateBathrooms === '' ? undefined : Number(data.privateBathrooms),
      sharedBathrooms: data.sharedBathrooms === '' ? undefined : Number(data.sharedBathrooms),
    };

    startTransition(async () => {
      const result = await updateUnitAction(listingId, unitId, dataToSave);
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: "The unit's occupancy and layout have been updated.",
        });
        form.reset(data); // Reset dirty state
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const handleBedTypeChange = (index: number, bedTypeId: string) => {
    const selectedBedType = bedTypes.find((bt) => bt.id === bedTypeId);
    if (selectedBedType) {
      form.setValue(`bedConfigs.${index}.type`, selectedBedType.id, { shouldDirty: true });
      form.setValue(`bedConfigs.${index}.sleeps`, selectedBedType.sleeps || 1, {
        shouldDirty: true,
      });
    }
  };

  if (!hasMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Occupancy & Layout
          </CardTitle>
          <CardDescription>
            Define the guest capacity and bed configuration for this unit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
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
              <Users className="h-5 w-5 text-primary" />
              Occupancy & Layout
            </CardTitle>
            <CardDescription>
              Define the guest capacity and bed configuration for this unit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['occupancy']} className="w-full space-y-4">
              {/* Occupancy Section */}
              <AccordionItem
                value="occupancy"
                className="p-4 bg-background border rounded-lg hover:bg-accent/50"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    Occupancy
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground -mt-2">
                    Define how many guests this unit can accommodate. You can also set a minimum
                    occupancy if required for group or family bookings.
                  </p>
                  <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name="minOccupancy"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Min. Occupancy</Label>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 2"
                              className="w-28"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxOccupancy"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Max. Occupancy*</Label>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 4"
                              required
                              className="w-28"
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

              {/* Bed Configuration Section */}
              <AccordionItem
                value="bed-config"
                className="p-4 bg-background border rounded-lg hover:bg-accent/50"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Bed className="h-5 w-5 text-primary" />
                    Bed Configuration
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground -mt-2">
                    Add the types and number of beds available in this unit. This helps describe the
                    sleeping arrangements clearly.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        type: '',
                        sleeps: 1,
                        count: 1,
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Bed Type
                  </Button>

                  {fields.length > 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 w-full md:w-3/4 lg:w-2/3">
                        <Label className="text-sm font-medium">Bed Type</Label>
                        <div className="grid grid-cols-2 gap-x-2">
                          <Label className="text-sm font-medium">Sleeps</Label>
                          <Label className="text-sm font-medium">Qty</Label>
                        </div>
                      </div>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 w-full md:w-3/4 lg:w-2/3 items-start"
                        >
                          <FormField
                            control={form.control}
                            name={`bedConfigs.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={(val) => handleBedTypeChange(index, val)}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger aria-label="Bed Type">
                                      <SelectValue placeholder="Select bed type..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {bedTypes.map((bedType) => (
                                      <SelectItem key={bedType.id} value={bedType.id}>
                                        {bedType.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-x-2 items-start">
                            <FormField
                              control={form.control}
                              name={`bedConfigs.${index}.sleeps`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="number" min="1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-start gap-2">
                              <FormField
                                control={form.control}
                                name={`bedConfigs.${index}.count`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input type="number" min="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive shrink-0 h-10 w-10"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Bathroom Configuration Section */}
              <AccordionItem
                value="bathroom-config"
                className="p-4 bg-background border rounded-lg hover:bg-accent/50"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Bath className="h-5 w-5 text-primary" />
                    Bathroom Configuration
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground -mt-2">
                    Specify the number of private and shared bathrooms.
                  </p>
                  <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name="privateBathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Private Bathrooms</Label>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="e.g., 1"
                              className="w-28"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sharedBathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Shared Bathrooms</Label>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="e.g., 2"
                              className="w-28"
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
