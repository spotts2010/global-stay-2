'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from './ui/checkbox';
import type { Amenity } from '@/lib/data';

const amenities: { id: Amenity; label: string }[] = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Pool' },
  { id: 'gym', label: 'Gym' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'kitchen', label: 'Kitchen' },
];

export default function PropertyForm() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Placeholder for form submission logic
    console.log('Form submitted');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add/Edit Property</CardTitle>
        <CardDescription>Fill out the details for your property listing.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input id="title" placeholder="e.g., The Oceanfront Pearl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your amazing property..." rows={5} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price per night ($)</Label>
              <Input id="price" type="number" placeholder="e.g., 850" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-type">Property Type</Label>
              <Select>
                <SelectTrigger id="property-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Loft">Loft</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox id={`amenity-${amenity.id}`} />
                  <Label htmlFor={`amenity-${amenity.id}`} className="font-normal">
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Images</Label>
            <Input id="images" type="file" multiple />
            <p className="text-xs text-muted-foreground">
              Upload up to 5 images for your property.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Save Property</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
