// This is a new file, renamed from /src/app/admin/amenities/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FilePen, Trash2, PlusCircle, Search, Home, Building } from 'lucide-react';
import { useState, useMemo } from 'react';

type Amenity = {
  id: string;
  label: string;
  systemTag: string;
  category:
    | 'Food & Drink'
    | 'Activities'
    | 'Outdoor'
    | 'General'
    | 'Safety'
    | 'Services'
    | 'Bathroom'
    | 'Entertainment'
    | 'View'
    | 'Kitchen'
    | 'Security';
};

const sharedAmenitiesData: Amenity[] = [
  { id: '9', label: '24/7 Check-in', systemTag: 'checkin_247', category: 'General' },
  { id: '1', label: 'Bar', systemTag: 'bar', category: 'Food & Drink' },
  { id: '2', label: 'Basketball Courts', systemTag: 'basketball', category: 'Activities' },
  { id: '3', label: 'BBQ', systemTag: 'bbq', category: 'Outdoor' },
  { id: '4', label: 'Beach Volleyball', systemTag: 'beach_volleyball', category: 'Activities' },
  { id: '5', label: 'Bike Hire', systemTag: 'bike_hire', category: 'Activities' },
  { id: '6', label: 'Boat Hire', systemTag: 'boat_hire', category: 'Activities' },
  { id: '7', label: 'Book Exchange', systemTag: 'books', category: 'General' },
  { id: '10', label: 'Carbon Monoxide Detector', systemTag: 'co_detector', category: 'Safety' },
  { id: '8', label: 'Casino', systemTag: 'casino', category: 'Activities' },
  { id: '11', label: 'Concierge Service', systemTag: 'concierge', category: 'Services' },
  { id: '12', label: 'EV Charging Station', systemTag: 'ev_charger', category: 'General' },
  { id: '13', label: 'Fire Extinguisher', systemTag: 'fire_extinguisher', category: 'Safety' },
  { id: '14', label: 'Games Room', systemTag: 'games_room', category: 'Activities' },
  { id: '15', label: 'Garden', systemTag: 'garden', category: 'Outdoor' },
  { id: '16', label: 'Golf Course', systemTag: 'golf_course', category: 'Activities' },
  { id: '17', label: 'Gym / Fitness Center', systemTag: 'gym', category: 'Activities' },
  { id: '18', label: 'Hot Tub / Jacuzzi', systemTag: 'jacuzzi', category: 'Outdoor' },
  { id: '19', label: 'Kayaks', systemTag: 'kayaks', category: 'Activities' },
  { id: '20', label: 'Laundry Facilities', systemTag: 'laundry', category: 'Services' },
  { id: '21', label: 'Lifts', systemTag: 'lifts', category: 'General' },
  { id: '22', label: 'Lounge', systemTag: 'lounge', category: 'General' },
  { id: '23', label: 'Luggage Storage', systemTag: 'luggage_storage', category: 'Services' },
  { id: '24', label: 'Free Parking', systemTag: 'parking', category: 'General' },
  { id: '25', label: 'Pet Friendly', systemTag: 'pet_friendly', category: 'General' },
  { id: '26', label: 'Pool', systemTag: 'pool', category: 'Outdoor' },
  { id: '27', label: 'Restaurant', systemTag: 'restaurant', category: 'Food & Drink' },
  { id: '28', label: 'Shared Kitchen', systemTag: 'kitchen', category: 'Food & Drink' },
  { id: '29', label: 'Smoke Detector', systemTag: 'smoke_detector', category: 'Safety' },
  { id: '30', label: 'Spa Treatments', systemTag: 'spa_treatments', category: 'Services' },
  { id: '31', label: 'Tennis', systemTag: 'tennis', category: 'Activities' },
  { id: '32', label: 'Volleyball', systemTag: 'volleyball', category: 'Activities' },
  { id: '33', label: 'Wheelchair Access', systemTag: 'wheelchair_access', category: 'General' },
  { id: '34', label: 'Wi-Fi', systemTag: 'wifi', category: 'General' },
].sort((a, b) => a.label.localeCompare(b.label));

const privateInclusionsData: Amenity[] = [
  { id: 'p1', label: 'Air Conditioning', systemTag: 'air_conditioning', category: 'General' },
  { id: 'p2', label: 'Private Balcony', systemTag: 'balcony', category: 'Outdoor' },
  { id: 'p3', label: 'Bathtub', systemTag: 'bathtub', category: 'Bathroom' },
  { id: 'p4', label: 'Blackout Curtains', systemTag: 'blackout_curtains', category: 'General' },
  { id: 'p5', label: 'BluRay Player', systemTag: 'bluray_player', category: 'Entertainment' },
  { id: 'p6', label: 'City View', systemTag: 'city_view', category: 'View' },
  { id: 'p7', label: 'Coffee Machine', systemTag: 'coffee_machine', category: 'Kitchen' },
  { id: 'p8', label: 'Work Desk', systemTag: 'desk', category: 'General' },
  { id: 'p9', label: 'DVD Player', systemTag: 'dvd_player', category: 'Entertainment' },
  { id: 'p10', label: 'Ensuite Bathroom', systemTag: 'ensuite', category: 'Bathroom' },
  { id: 'p11', label: 'Fridge / Freezer', systemTag: 'fridge_freezer', category: 'Kitchen' },
  { id: 'p12', label: 'Garden View', systemTag: 'garden_view', category: 'View' },
  { id: 'p13', label: 'Hair Dryer', systemTag: 'hair_dryer', category: 'Bathroom' },
  { id: 'p14', label: 'Heating', systemTag: 'heating', category: 'General' },
  { id: 'p15', label: 'Iron', systemTag: 'iron', category: 'General' },
  { id: 'p16', label: 'Kitchen', systemTag: 'kitchen', category: 'Kitchen' },
  { id: 'p17', label: 'Microwave', systemTag: 'microwave', category: 'Kitchen' },
  { id: 'p18', label: 'Mini Fridge', systemTag: 'mini_fridge', category: 'Kitchen' },
  { id: 'p19', label: 'Mountain View', systemTag: 'mountain_view', category: 'View' },
  { id: 'p20', label: 'Ocean View', systemTag: 'ocean_view', category: 'View' },
  { id: 'p21', label: 'Safe Deposit Box', systemTag: 'safe', category: 'Security' },
  { id: 'p22', label: 'Toaster', systemTag: 'toaster', category: 'Kitchen' },
  {
    id: 'p23',
    label: 'Complimentary Toiletries',
    systemTag: 'toiletries',
    category: 'Bathroom',
  },
  { id: 'p24', label: 'TV', systemTag: 'tv', category: 'Entertainment' },
].sort((a, b) => a.label.localeCompare(b.label));

const AmenitiesTable = ({ data }: { data: Amenity[] }) => (
  <Card>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-2">Label</TableHead>
            <TableHead className="py-2">System Tag</TableHead>
            <TableHead className="py-2">Category</TableHead>
            <TableHead className="text-right py-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((amenity) => (
            <TableRow key={amenity.id}>
              <TableCell className="font-medium py-2">{amenity.label}</TableCell>
              <TableCell className="font-mono text-xs py-2">{amenity.systemTag}</TableCell>
              <TableCell className="py-2">
                <Badge variant="secondary">{amenity.category}</Badge>
              </TableCell>
              <TableCell className="text-right py-2">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FilePen className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function AmenitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const allCategories = useMemo(() => {
    const categories = new Set<string>(['All']);
    sharedAmenitiesData.forEach((a) => categories.add(a.category));
    privateInclusionsData.forEach((a) => categories.add(a.category));
    return Array.from(categories).sort();
  }, []);

  const filterData = (data: Amenity[]) => {
    return data.filter((item) => {
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesSearch =
        !searchTerm ||
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.systemTag.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const filteredSharedAmenities = filterData(sharedAmenitiesData);
  const filteredPrivateInclusions = filterData(privateInclusionsData);

  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Amenities &amp; Inclusions</CardTitle>
          <CardDescription>
            Add, edit, or delete features for both shared listings and private units.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex w-full flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by label or system tag..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <Tabs defaultValue="shared">
            <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
              <TabsTrigger value="shared">
                <Home className="mr-2 h-4 w-4" />
                Shared Amenities ({filteredSharedAmenities.length})
              </TabsTrigger>
              <TabsTrigger value="private">
                <Building className="mr-2 h-4 w-4" />
                Private Inclusions ({filteredPrivateInclusions.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="shared" className="mt-4">
              <AmenitiesTable data={filteredSharedAmenities} />
            </TabsContent>
            <TabsContent value="private" className="mt-4">
              <AmenitiesTable data={filteredPrivateInclusions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
