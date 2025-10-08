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
import { Bed, Bath, Users, PlusCircle, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { BedType } from '@/lib/data';

type BedConfig = {
  id: string;
  type: string; // BedType ID
  sleeps: number | '';
  count: number;
};

export default function OccupancyLayoutClient({ bedTypes }: { bedTypes: BedType[] }) {
  const [bedConfigs, setBedConfigs] = useState<BedConfig[]>([]);
  const [sharedBathrooms, setSharedBathrooms] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const addBedConfig = () => {
    setBedConfigs([...bedConfigs, { id: `bed_${Date.now()}`, type: '', sleeps: '', count: 1 }]);
  };

  const removeBedConfig = (id: string) => {
    setBedConfigs(bedConfigs.filter((bed) => bed.id !== id));
  };

  const handleBedTypeChange = (id: string, bedTypeId: string) => {
    const selectedBedType = bedTypes.find((bt) => bt.id === bedTypeId);
    const sleepsValue = selectedBedType?.sleeps ?? '';
    setBedConfigs(
      bedConfigs.map((bed) =>
        bed.id === id ? { ...bed, type: bedTypeId, sleeps: sleepsValue } : bed
      )
    );
  };

  const handleBedDetailChange = (id: string, key: 'sleeps' | 'count', value: string | number) => {
    setBedConfigs(bedConfigs.map((bed) => (bed.id === id ? { ...bed, [key]: value } : bed)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy & Layout</CardTitle>
        <CardDescription>
          Define the guest capacity and bed configuration for this unit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasMounted && (
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
                  <div className="space-y-2">
                    <Label htmlFor="min-occupancy">Min. Occupancy</Label>
                    <Input
                      id="min-occupancy"
                      type="number"
                      placeholder="e.g., 2"
                      className="bg-white w-28"
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-occupancy">Max. Occupancy*</Label>
                    <Input
                      id="max-occupancy"
                      type="number"
                      placeholder="e.g., 4"
                      required
                      className="bg-white w-28"
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                    />
                  </div>
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
                <Button type="button" variant="outline" onClick={addBedConfig}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Bed Type
                </Button>

                {bedConfigs.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1 w-full md:w-3/4 lg:w-2/3">
                      <Label className="text-sm font-medium">Bed Type</Label>
                      <div className="grid grid-cols-2 gap-x-2">
                        <Label className="text-sm font-medium">Sleeps</Label>
                        <Label className="text-sm font-medium">Qty</Label>
                      </div>
                    </div>
                    {bedConfigs.map((bed) => (
                      <div
                        key={bed.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 w-full md:w-3/4 lg:w-2/3 items-end"
                      >
                        <Select
                          value={bed.type}
                          onValueChange={(val) => handleBedTypeChange(bed.id, val)}
                        >
                          <SelectTrigger className="bg-white" aria-label="Bed Type">
                            <SelectValue placeholder="Select bed type..." />
                          </SelectTrigger>
                          <SelectContent>
                            {bedTypes.map((bedType) => (
                              <SelectItem key={bedType.id} value={bedType.id}>
                                {bedType.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="grid grid-cols-2 gap-x-2 items-end">
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g. 2"
                            required={bed.sleeps === ''}
                            value={bed.sleeps}
                            onChange={(e) =>
                              handleBedDetailChange(bed.id, 'sleeps', e.target.value)
                            }
                            className="bg-white"
                            onWheel={(e) => (e.target as HTMLElement).blur()}
                          />
                          <div className="flex items-end gap-2">
                            <Input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              value={bed.count}
                              onChange={(e) =>
                                handleBedDetailChange(
                                  bed.id,
                                  'count',
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="bg-white"
                              onWheel={(e) => (e.target as HTMLElement).blur()}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive shrink-0 h-10 w-10"
                              onClick={() => removeBedConfig(bed.id)}
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
                  <div className="space-y-2">
                    <Label htmlFor="private-bathrooms">Private Bathrooms</Label>
                    <Input
                      id="private-bathrooms"
                      type="number"
                      min="0"
                      placeholder="e.g., 1"
                      defaultValue={1}
                      className="bg-white w-28"
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shared-bathrooms">Shared Bathrooms</Label>
                    <Input
                      id="shared-bathrooms"
                      type="number"
                      min="0"
                      placeholder="e.g., 2"
                      value={sharedBathrooms}
                      onChange={(e) => setSharedBathrooms(parseInt(e.target.value) || 0)}
                      className="bg-white w-28"
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter className="flex justify-start gap-2">
        <Button variant="outline">Save Draft</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
