'use client';

import Image from 'next/image';
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
import { Separator } from './ui/separator';
import {
  Box,
  Building2,
  Calendar,
  Camera,
  Copy,
  FilePen,
  ImageIcon,
  MapPin,
  PlusCircle,
  ShieldQuestion,
  Trash2,
  Upload,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const amenitiesList: { id: string; label: string }[] = [
  { id: 'bar', label: 'Bar' },
  { id: 'basketball', label: 'Basketball Courts' },
  { id: 'bbq', label: 'BBQ' },
  { id: 'beach_volleyball', label: 'Beach Volleyball' },
  { id: 'bike_hire', label: 'Bike Hire' },
  { id: 'boat_hire', label: 'Boat Hire' },
  { id: 'books', label: 'Book Exchange' },
  { id: 'casino', label: 'Casino' },
  { id: 'checkin_247', label: '24/7 Check-in' },
  { id: 'co_detector', label: 'Carbon Monoxide Detector' },
  { id: 'concierge', label: 'Concierge Service' },
  { id: 'ev_charger', label: 'EV Charging Station' },
  { id: 'fire_extinguisher', label: 'Fire Extinguisher' },
  { id: 'games_room', label: 'Games Room' },
  { id: 'garden', label: 'Garden' },
  { id: 'golf_course', label: 'Golf Course' },
  { id: 'gym', label: 'Gym / Fitness Center' },
  { id: 'jacuzzi', label: 'Hot Tub / Jacuzzi' },
  { id: 'kayaks', label: 'Kayaks' },
  { id: 'laundry', label: 'Laundry Facilities' },
  { id: 'lifts', label: 'Lifts' },
  { id: 'lounge', label: 'Lounge' },
  { id: 'luggage_storage', label: 'Luggage Storage' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'pet_friendly', label: 'Pet Friendly' },
  { id: 'pool', label: 'Pool' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'kitchen', label: 'Shared Kitchen' },
  { id: 'smoke_detector', label: 'Smoke Detector' },
  { id: 'spa_treatments', label: 'Spa Treatments' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'volleyball', label: 'Volleyball' },
  { id: 'wheelchair_access', label: 'Wheelchair Access' },
  { id: 'wifi', label: 'Wi-Fi' },
];

const bookableUnits = [
  { id: '1', name: '8-bed Dorm', ref: 'D1001', guests: 8, currency: 'AUD', price: 50.0 },
  { id: '2', name: '8-bed Dorm', ref: 'D1002', guests: 8, currency: 'AUD', price: 50.0 },
  { id: '3', name: 'Private Double', ref: 'P2001', guests: 2, currency: 'AUD', price: 200.0 },
  { id: '4', name: 'Private Double', ref: 'P2002', guests: 2, currency: 'AUD', price: 200.0 },
];

export default function PropertyForm() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="listing-name">Listing Name</Label>
            <Input id="listing-name" defaultValue="1849 Backpackers" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property-type">Property Type</Label>
            <Select defaultValue="Hotel">
              <SelectTrigger id="property-type">
                <SelectValue />
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
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Input
                id="location"
                defaultValue="45 Peels Pl, Albany, WA 6330, Australia"
                className="pr-8"
              />
              <MapPin className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Overall Description</Label>
            <Textarea
              id="description"
              defaultValue="Casual hostel with Wi-Fi & all-you-can-eat pancake breakfast, plus loaner bikes and 2 kitchens."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Shared Image Gallery
            </CardTitle>
            <CardDescription>
              Manage your listing's photos. Drag to reorder. The first image will be the cover
              image.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-3 md:grid-cols-5 gap-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary">
            <Image
              src="https://picsum.photos/300/300?random=1"
              alt="Bunk beds in a dorm room"
              fill
              className="object-cover"
              data-ai-hint="dorm room"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src="https://picsum.photos/300/300?random=2"
              alt="Private double room with a made bed"
              fill
              className="object-cover"
              data-ai-hint="double bed"
            />
          </div>
          <div className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent cursor-pointer">
            <Camera className="h-8 w-8" />
            <span className="text-xs mt-2">Add Images</span>
          </div>
        </CardContent>
      </Card>

      {/* Host */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Host
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="sam">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sam">Sam Host (sam@redbackweb.au)</SelectItem>
              <SelectItem value="julia">Julia Nolte (julia.nolte@example.com)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Shared Amenities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Shared Amenities
            </CardTitle>
            <CardDescription>
              Select all amenities that are shared across all units.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
            {amenitiesList.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox id={`amenity-${amenity.id}`} />
                <Label htmlFor={`amenity-${amenity.id}`} className="font-normal">
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bookable Units */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" />
              Bookable Units & Inclusions
            </CardTitle>
            <CardDescription>
              Manage specific rooms or bookable units. Each listing must have at least one unit.
            </CardDescription>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Import Units
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Unit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit Name</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookableUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>
                    <Input defaultValue={unit.ref} className="h-8 font-mono text-xs" />
                  </TableCell>
                  <TableCell>{unit.guests}</TableCell>
                  <TableCell>{unit.currency}</TableCell>
                  <TableCell>${unit.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FilePen className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Policies */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Local Area Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Describe the neighborhood, nearby attractions, etc." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Payment Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="e.g., Full payment required at booking, 50% refundable" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldQuestion className="h-5 w-5 text-primary" />
              Cancellation Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="e.g., Free cancellation up to 48 hours before check-in" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Publish Schedule & Reminders
            </CardTitle>
            <CardDescription>Optionally set a start and end date for visibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Publish Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Publish End Date</Label>
                <Input type="date" />
              </div>
            </div>
            <Separator />
            <div>
              <Label>Custom Reminders</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Set a Publish End Date to enable and configure reminders.
              </p>
              <Button variant="outline" disabled>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
