'use client';

import Link from 'next/link';
import { ArrowLeft } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import React from 'react';

export default function NewListingPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Create New Listing</h1>
          <p className="text-sm text-muted-foreground">
            Fill out the form to add a new accommodation to your listings.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/listings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>Enter the main details for your new property listing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow-[3]">
                <Label htmlFor="name">Listing Name</Label>
                <Input id="name" placeholder="e.g., 'The Oceanfront Pearl'" />
              </div>
              <div className="flex-grow-[2] flex gap-4">
                <div className="w-[60%]">
                  <Label htmlFor="type">Property Type</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Hostel">Hostel</SelectItem>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Loft">Loft</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[40%]">
                  <Label htmlFor="star-rating">Star Rating</Label>
                  <Select>
                    <SelectTrigger id="star-rating">
                      <SelectValue placeholder="N/A" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g., Malibu, California" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Overall Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of the property..."
                rows={6}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center p-6 border-t pt-6">
          <Button>Create Listing</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
