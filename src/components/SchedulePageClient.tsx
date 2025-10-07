'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Save, Loader2, Calendar } from '@/lib/icons';
import React, { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Accommodation } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SchedulePageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSave = () => {
    startTransition(async () => {
      console.log('Saving schedule');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Changes Saved',
        description: 'The publishing schedule has been updated.',
      });
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Schedule' },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Publish Schedule &amp; Reminders
          </CardTitle>
          <CardDescription>Optionally set a start and end date for visibility.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Publish Start Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Publish End Date</Label>
              <Input type="date" />
            </div>
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
