'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Upload, ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Placeholder for host's properties
const hostProperties = [
  {
    id: '1',
    name: 'The Oceanfront Pearl',
    location: 'Malibu, California',
    status: 'Published',
    price: 850,
    image: 'https://picsum.photos/100/100',
    imageHint: 'beachfront villa',
  },
  {
    id: '2',
    name: 'Metropolitan Loft',
    location: 'SoHo, New York',
    status: 'Draft',
    price: 450,
    image: 'https://picsum.photos/100/100',
    imageHint: 'city loft',
  },
  {
    id: '3',
    name: 'Alpine Chalet',
    location: 'Aspen, Colorado',
    status: 'Published',
    price: 620,
    image: 'https://picsum.photos/100/100',
    imageHint: 'ski chalet',
  },
  {
    id: '4',
    name: 'London Mews House',
    location: 'Kensington, London',
    status: 'Archived',
    price: 350,
    image: 'https://picsum.photos/100/100',
    imageHint: 'mews house',
  },
];

export default function AdminListingsPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Published</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Upload className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Import</span>
          </Button>
          <Button asChild size="sm" className="h-8 gap-1">
            <Link href="#">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New</span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Listings</CardTitle>
            <CardDescription>
              View, edit, or change status of accommodation listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={property.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={property.image}
                        width="64"
                        data-ai-hint={property.imageHint}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          property.status === 'Published'
                            ? 'default'
                            : property.status === 'Draft'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">${property.price}/night</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
