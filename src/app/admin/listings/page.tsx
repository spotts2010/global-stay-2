// src/app/admin/(listings)/listings/page.tsx -> src/app/admin/listings/page.tsx
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
import {
  Copy,
  PlusCircle,
  Upload,
  ListFilter,
  FilePen,
  Trash2,
  Check,
  ArrowUp,
  Archive,
  RotateCcw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ListingStatus = 'Published' | 'Draft' | 'Archived';

// Placeholder for host's properties
const hostProperties: {
  id: string;
  name: string;
  location: string;
  status: ListingStatus;
  price: number;
  image: string;
  imageHint: string;
  units: number;
  host: string;
}[] = [
  {
    id: '1',
    name: 'The Oceanfront Pearl',
    location: 'Malibu, California',
    status: 'Published',
    price: 850,
    image: 'https://picsum.photos/100/100',
    imageHint: 'beachfront villa',
    units: 1,
    host: 'Sam Potts',
  },
  {
    id: '2',
    name: 'Metropolitan Loft',
    location: 'SoHo, New York',
    status: 'Draft',
    price: 450,
    image: 'https://picsum.photos/100/100',
    imageHint: 'city loft',
    units: 1,
    host: 'Sam Potts',
  },
  {
    id: '3',
    name: 'Alpine Chalet',
    location: 'Aspen, Colorado',
    status: 'Published',
    price: 620,
    image: 'https://picsum.photos/100/100',
    imageHint: 'ski chalet',
    units: 4,
    host: 'Julia Nolte',
  },
  {
    id: '4',
    name: 'London Mews House',
    location: 'Kensington, London',
    status: 'Archived',
    price: 350,
    image: 'https://picsum.photos/100/100',
    imageHint: 'mews house',
    units: 1,
    host: 'Sam Potts',
  },
];

const StatusBadge = ({ status }: { status: ListingStatus }) => {
  const statusStyles: Record<ListingStatus, string> = {
    Published: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    Draft: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    Archived: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  };

  return <Badge className={cn('capitalize', statusStyles[status])}>{status}</Badge>;
};

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
            <Link href="/admin/listings/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New</span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Manage Listings</CardTitle>
            <CardDescription>
              View, edit, or change status of accommodation listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Name <ArrowUp className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Units</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Host</TableHead>
                  <TableHead className="hidden md:table-cell">Starts From</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
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
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{property.units}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {property.location}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {property.host}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      ${property.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={property.status} />
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                <Link href={`/admin/listings/${property.id}`}>
                                  <FilePen className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Listing</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Duplicate Listing</p>
                            </TooltipContent>
                          </Tooltip>

                          {property.status === 'Published' || property.status === 'Archived' ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-amber-600"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Return to Draft</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Publish Listing</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {property.status === 'Draft' ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Listing</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                >
                                  <Archive className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Archive Listing</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TooltipProvider>
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
