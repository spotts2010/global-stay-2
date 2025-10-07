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
import { Loader2, Save } from '@/lib/icons';

export default function UnitPoliciesPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSave = () => {
    startTransition(async () => {
      // In a real app, this would save the data.
      console.log('Saving unit policies...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Changes Saved (Simulated)',
        description: 'The unit-specific policies have been updated.',
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Policies</CardTitle>
        <CardDescription>
          Set specific rules for this unit. These will override the default property policies where
          filled out.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div className="space-y-2">
            <Label>Check-in Time</Label>
            <Input type="time" defaultValue="14:00" />
          </div>
          <div className="space-y-2">
            <Label>Check-out Time</Label>
            <Input type="time" defaultValue="10:00" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Payment Terms</Label>
          <Textarea placeholder="e.g., Full payment required at booking, 50% refundable" />
        </div>
        <div className="space-y-2">
          <Label>Cancellation Policy</Label>
          <Textarea placeholder="e.g., Non-refundable for this specific unit" />
        </div>
        <div className="space-y-2">
          <Label>House Rules</Label>
          <Textarea placeholder="e.g., No guests under 18 for this unit" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-start gap-2">
        <Button variant="outline">Save Draft</Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
