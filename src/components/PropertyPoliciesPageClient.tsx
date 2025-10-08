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
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Save, Loader2, ShieldQuestion } from '@/lib/icons';
import React, { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Accommodation } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { updateAccommodationPoliciesAction } from '@/app/actions';

const policiesSchema = z.object({
  paymentTerms: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  houseRules: z.string().optional(),
});

type PoliciesFormValues = z.infer<typeof policiesSchema>;

export default function PropertyPoliciesPageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<PoliciesFormValues>({
    resolver: zodResolver(policiesSchema),
    defaultValues: {
      paymentTerms: listing.paymentTerms || '',
      cancellationPolicy: listing.cancellationPolicy || '',
      houseRules: listing.houseRules || '',
    },
  });

  const handleSave = (formData: PoliciesFormValues) => {
    startTransition(async () => {
      const result = await updateAccommodationPoliciesAction(listing.id, formData);
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'The policies and terms have been updated.',
        });
        form.reset(formData); // Resets dirty state
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Property Policies' },
        ]}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldQuestion className="h-5 w-5 text-primary" />
                Property Policies &amp; Terms
              </CardTitle>
              <CardDescription>
                Set the rules and conditions for this property. These will be displayed to guests
                before booking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <Label>Payment Terms</Label>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Full payment required at booking, 50% refundable"
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
                        placeholder="e.g., Free cancellation up to 48 hours before check-in"
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
                        placeholder="e.g., pets allowed but no smoking, no parties"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
    </div>
  );
}
