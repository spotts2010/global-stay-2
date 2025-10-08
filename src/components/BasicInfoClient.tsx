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
import { Bed, MdOutlineDoorFront, HelpCircle } from '@/lib/icons';
import type { Accommodation } from '@/lib/data';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';

export default function BasicInfoClient({ listing }: { listing: Accommodation }) {
  // Determine if the dropdown should be disabled
  const isUnitTypeLocked = listing.bookingType !== 'hybrid';

  // Determine the default value for the dropdown
  // If it's not hybrid, lock it to the property's booking type.
  const defaultUnitType =
    listing.bookingType === 'room' || listing.bookingType === 'hybrid' ? 'Room' : 'Bed';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
          <CardDescription>
            Provide details for this unit, including its name, type, and status. This information
            forms the foundation for how the unit is displayed and managed within the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="unit-name">Unit Name*</Label>
                <Input
                  id="unit-name"
                  placeholder="e.g., 'Queen Room with Balcony'"
                  required
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="unit-type">Unit Type*</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="focus:outline-none">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Inherited from property selection, but can be overridden if the property
                          is set to 'Hybrid'.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select defaultValue={defaultUnitType} disabled={isUnitTypeLocked}>
                  <SelectTrigger id="unit-type" className="w-full bg-white">
                    <SelectValue placeholder="Select a unit type" />
                  </SelectTrigger>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit-ref">Unit Ref / Internal Code*</Label>
                <Input id="unit-ref" placeholder="e.g., 'QR-101'" required className="bg-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A short summary about the unit (e.g., 'Spacious room with a private balcony overlooking the city')."
                rows={4}
                className="bg-white"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-start gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
