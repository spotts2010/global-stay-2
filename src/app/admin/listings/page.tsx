// src/app/admin/listings/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Building,
  PlusCircle,
  Search,
  MoreHorizontal,
  FilePen,
  Trash2,
  ArrowUpRightFromSquare,
  Archive,
  SendToBack,
} from 'lucide-react';

type Listing = {
  id: string;
  name: string;
  location: string;
  type: 'Hotel' | 'Villa' | 'Apartment';
  status: 'Published' | 'Draft' | 'Archived';
  bookings: number;
};

// Mock data for demonstration purposes
const listingsData: Listing[] = [
  {
    id: '1',
    name: '1849 Backpackers',
    location: 'Albany, WA',
    type: 'Hotel',
    status: 'Published',
    bookings: 23,
  },
  {
    id: '2',
    name: 'The Villa',
    location: 'Margaret River, WA',
    type: 'Villa',
    status: 'Published',
    bookings: 12,
  },
  {
    id: '3',
    name: 'Modern City Loft',
    location: 'Melbourne, VIC',
    type: 'Apartment',
    status: 'Draft',
    bookings: 0,
  },
  {
    id: '4',
    name: 'Beachside Bungalow',
    location: 'Noosa, QLD',
    type: 'Villa',
    status: 'Archived',
    bookings: 102,
  },
];

export default function AdminListingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredListings = listingsData.filter(
    (listing) =>
      listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Manage Listings
            </CardTitle>
            <CardDescription>View, edit, and manage all your property listings.</CardDescription>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or location..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link href="/admin/listings/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Listing
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {listing.location}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{listing.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        listing.status === 'Published'
                          ? 'default'
                          : listing.status === 'Draft'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className="capitalize"
                    >
                      {listing.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/listings/${listing.id}`}>
                            <FilePen className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowUpRightFromSquare className="mr-2 h-4 w-4" />
                          {listing.status === 'Published' ? 'Return to Draft' : 'Publish'}
                        </DropdownMenuItem>
                        {listing.status !== 'Draft' ? (
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <SendToBack className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          disabled={listing.status !== 'Draft' || listing.bookings > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
