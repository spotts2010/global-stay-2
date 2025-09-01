'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Properties</h1>
          <p className="text-muted-foreground">Manage your listings on Global Stay 2.0.</p>
        </div>
        <Button asChild>
          <Link href="#">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
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
