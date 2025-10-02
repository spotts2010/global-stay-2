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
import { Building, Bed } from 'lucide-react';

export default function BasicInfoPage() {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="unit-name">Unit Name*</Label>
                <Input id="unit-name" placeholder="e.g., 'Queen Room with Balcony'" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit-ref">Unit Ref / Internal Code*</Label>
                <Input id="unit-ref" placeholder="e.g., 'QR-101'" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit-type">Unit Type*</Label>
              <Select defaultValue="room">
                <SelectTrigger id="unit-type" className="w-full md:w-auto md:max-w-xs">
                  <SelectValue placeholder="Select a unit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" /> By Room
                    </div>
                  </SelectItem>
                  <SelectItem value="bed">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4" /> By Bed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Inherited from property selection, but can be overridden.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A short summary about the unit (e.g., 'Spacious room with a private balcony overlooking the city')."
                rows={4}
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
