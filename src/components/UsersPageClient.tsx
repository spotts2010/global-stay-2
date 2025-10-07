'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Save, Loader2, Users } from '@/lib/icons';
import React, { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Accommodation } from '@/lib/data';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function UsersPageClient({ listing }: { listing: Accommodation }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSave = () => {
    startTransition(async () => {
      console.log('Saving user access');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Changes Saved',
        description: 'User access settings have been updated.',
      });
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Listings', href: '/admin/listings' },
          { label: listing.name, href: `/admin/listings/${listing.id}/edit/about` },
          { label: 'Users' },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            User Access
          </CardTitle>
          <CardDescription>
            Manage which users have permission to view or edit this listing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Select defaultValue="sam">
                <SelectTrigger id="host">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sam">Sam Host (sam@redbackweb.au)</SelectItem>
                  <SelectItem value="julia">Julia Nolte (julia.nolte@example.com)</SelectItem>
                </SelectContent>
              </Select>
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
