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
import { DollarSign, BedDouble, UserPlus, CalendarClock } from 'lucide-react';
import React from 'react';

export default function PricingPage() {
  // This would be determined by the unit's "type" from the Basic Info page.
  // Hardcoded to 'room' for now, which results in 'Per Unit' pricing.
  const unitType = 'room';
  const pricingModel = unitType === 'room' ? 'Per Unit' : 'Per Person';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing & Stay Requirements</CardTitle>
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
                <div className="space-y-2">
                  <Label htmlFor="base-rate">Base Rate (per night)*</Label>
                  <Input id="base-rate" type="number" placeholder="e.g., 150" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="aud">
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="usd">USD - United States Dollar</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing-model">Pricing Model</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="min-stay">Minimum Stay (nights)</Label>
                  <Input id="min-stay" type="number" placeholder="e.g., 2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-stay">Maximum Stay (nights)</Label>
                  <Input id="max-stay" type="number" placeholder="e.g., 28 (optional)" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Extra Guest Fees Section */}
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
                <div className="space-y-2">
                  <Label htmlFor="included-occupancy">Included Occupancy</Label>
                  <Input id="included-occupancy" type="number" placeholder="e.g., 2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extra-fee">Extra Guest Fee (per night)</Label>
                  <Input id="extra-fee" type="number" placeholder="e.g., 25 (if applicable)" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-start gap-2">
        <Button variant="outline">Save Draft</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
