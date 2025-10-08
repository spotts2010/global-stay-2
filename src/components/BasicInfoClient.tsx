// src/components/BasicInfoClient.tsx
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { Bed, MdOutlineDoorFront, HelpCircle, SquarePen, Save, Loader2 } from '@/lib/icons';
import type { Accommodation } from '@/lib/data';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import React, { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { BookableUnit } from './UnitsPageClient';
import { useParams, useRouter } from 'next/navigation';
import { updateUnitAction } from '@/app/actions';

const unitSchema = z.object({
  name: z.string().min(1, 'Unit name is required.'),
  unitRef: z.string().min(1, 'Unit reference is required.'),
  type: z.enum(['Room', 'Bed']),
  description: z.string().optional(),
});

type UnitFormValues = z.infer<typeof unitSchema>;

export default function BasicInfoClient({
  listing,
  unit,
}: {
  listing: Accommodation;
  unit?: BookableUnit;
}) {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const isCreating = params.unitId === 'new';

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: unit?.name || '',
      unitRef: unit?.unitRef || '',
      type: unit?.type || 'Room',
      description: unit?.description || '',
    },
  });

  const onSubmit = (data: UnitFormValues) => {
    startTransition(async () => {
      const unitId = isCreating ? 'new' : (params.unitId as string);
      const result = await updateUnitAction(listing.id, unitId, data);

      if (result.success) {
        toast({
          title: isCreating ? 'Unit Created' : 'Changes Saved',
          description: `The unit "${data.name}" has been successfully saved.`,
        });
        form.reset(data); // Reset dirty state
        if (isCreating && result.newUnitId) {
          // Redirect to the new unit's edit page
          router.replace(`/admin/listings/${listing.id}/edit/units/${result.newUnitId}/basic-info`);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  // Determine if the dropdown should be disabled
  const isUnitTypeLocked = listing.bookingType !== 'hybrid';
  const defaultUnitType =
    listing.bookingType === 'room' || listing.bookingType === 'hybrid' ? 'Room' : 'Bed';

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SquarePen className="h-5 w-5 text-primary" />
                Basic Info
              </CardTitle>
              <CardDescription>
                Provide details for this unit, including its name, type, and status. This
                information forms the foundation for how the unit is displayed and managed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Unit Name*</Label>
                        <FormControl>
                          <Input placeholder="e.g., 'Queen Room with Balcony'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1.5">
                          <Label>Unit Type*</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="focus:outline-none">
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Inherited from property setting, but can be overridden if property
                                  is 'Hybrid'.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={defaultUnitType}
                          value={field.value}
                          disabled={isUnitTypeLocked}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Room">
                              <div className="flex items-center gap-2">
                                <MdOutlineDoorFront className="h-4 w-4" /> Room
                              </div>
                            </SelectItem>
                            <SelectItem value="Bed">
                              <div className="flex items-center gap-2">
                                <Bed className="h-4 w-4" /> Bed
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unitRef"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Unit Ref / Internal Code*</Label>
                        <FormControl>
                          <Input placeholder="e.g., 'QR-101'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Description</Label>
                      <FormControl>
                        <Textarea
                          placeholder="A short summary about the unit (e.g., 'Spacious room with a private balcony overlooking the city')."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
      </Form>
    </div>
  );
}
