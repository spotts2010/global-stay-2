'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Save, Loader2, ShieldQuestion } from 'lucide-react';
import React, { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Accommodation } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function PoliciesPageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSave = () => {
    startTransition(async () => {
      console.log('Saving policies');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Changes Saved',
        description: 'The policies and terms have been updated.',
      });
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Policies' },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldQuestion className="h-5 w-5 text-primary" />
            Policies &amp; Terms
          </CardTitle>
          <CardDescription>
            Set the rules and conditions for this property. These will be displayed to guests before
            booking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Payment Terms</Label>
            <Textarea placeholder="e.g., Full payment required at booking, 50% refundable" />
          </div>
          <div className="space-y-2">
            <Label>Cancellation Policy</Label>
            <Textarea placeholder="e.g., Free cancellation up to 48 hours before check-in" />
          </div>
          <div className="space-y-2">
            <Label>House Rules</Label>
            <Textarea placeholder="e.g., pets allowed but no smoking, no parties" />
          </div>
        </CardContent>
      </Card>
      <div className="sticky bottom-0 py-4 flex justify-start">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
