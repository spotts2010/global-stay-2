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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { Loader2, Save, Shield } from '@/lib/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { updateUnitAction } from '@/app/actions';
import type { BookableUnit } from '@/components/UnitsPageClient';
import { useParams, useRouter } from 'next/navigation';

const unitPoliciesSchema = z.object({
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  paymentTerms: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  houseRules: z.string().optional(),
});

type UnitPoliciesFormValues = z.infer<typeof unitPoliciesSchema>;

export default function UnitPoliciesPageClient({ unit }: { unit: BookableUnit | null }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const unitId = params.unitId as string;
  const isCreating = unitId === 'new' || !unit;

  const form = useForm<UnitPoliciesFormValues>({
    resolver: zodResolver(unitPoliciesSchema),
    defaultValues: {
      checkInTime: unit?.checkInTime || '14:00',
      checkOutTime: unit?.checkOutTime || '10:00',
      paymentTerms: unit?.paymentTerms || '',
      cancellationPolicy: unit?.cancellationPolicy || '',
      houseRules: unit?.houseRules || '',
    },
  });

  const handleSave = (data: UnitPoliciesFormValues) => {
    startTransition(async () => {
      const result = await updateUnitAction(listingId, unitId, data);
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'The unit-specific policies have been updated.',
        });
        if (isCreating && result.newUnitId) {
          router.replace(
            `/admin/listings/${listingId}/edit/units/${result.newUnitId}/unit-policies`
          );
        } else {
          form.reset(data); // Reset dirty state only on update
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

  if (isCreating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Save Required</CardTitle>
          <CardDescription>
            You must first save the unit's basic info before you can configure its policies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/admin/listings/${listingId}/edit/units/${unitId}/basic-info`)
            }
          >
            Go to Basic Info
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Unit Policies
            </CardTitle>
            <CardDescription>
              Set specific rules for this unit. These will override the default property policies
              where filled out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <FormField
                control={form.control}
                name="checkInTime"
                render={({ field }) => (
                  <FormItem>
                    <Label>Check-in Time</Label>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkOutTime"
                render={({ field }) => (
                  <FormItem>
                    <Label>Check-out Time</Label>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <Label>Payment Terms</Label>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Full payment required at booking, 50% refundable for this unit."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cancellationPolicy"
              render={({ field }) => (
                <FormItem>
                  <Label>Cancellation Policy</Label>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., This specific unit is non-refundable."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="houseRules"
              render={({ field }) => (
                <FormItem>
                  <Label>House Rules</Label>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., No guests under 18 allowed in this unit."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
  );
}
