'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Placeholder for host's properties
const hostProperties = [
  {
    id: '1',
    name: 'The Oceanfront Pearl',
    location: 'Malibu, California',
    status: 'Published',
    price: 850,
    image: 'https://placehold.co/100x100.png',
    imageHint: 'beachfront villa',
  },
  {
    id: '2',
    name: 'Metropolitan Loft',
    location: 'SoHo, New York',
    status: 'Draft',
    price: 450,
    image: 'https://placehold.co/100x100.png',
    imageHint: 'city loft',
  },
];

export default function HostDashboardPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Host Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your properties and bookings.</p>
        </div>
        <Button asChild>
          <Link href="#">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Properties</CardTitle>
          <CardDescription>A list of all your listings on Global Stay 2.0.</CardDescription>
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
                    <Badge variant={property.status === 'Published' ? 'default' : 'secondary'}>
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
    </div>
  );
}
