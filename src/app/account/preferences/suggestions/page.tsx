'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { FilePen, PlusCircle, Trash2, Wand, MapPin, Users } from '@/lib/icons';
import { Badge } from '@/components/ui/badge';

type Suggestion = {
  id: string;
  title: string;
  description: string;
  locations?: string[];
  people?: number;
};

// Placeholder data
const initialSuggestions: Suggestion[] = [
  {
    id: 's1',
    title: 'Relaxing Beach Getaway',
    description:
      'Looking for a quiet, all-inclusive beach resort. Preferably with a private pool, white sand beaches, and good snorkeling opportunities. Not a party destination.',
    locations: ['Maldives'],
    people: 2,
  },
  {
    id: 's2',
    title: 'European City Exploration',
    description:
      'A centrally located apartment in a historic European city. Must have good access to public transport, museums, and local restaurants.',
    locations: ['Rome, Italy', 'Prague, Czechia', 'Lisbon, Portugal'],
  },
  {
    id: 's3',
    title: 'Family Ski Trip',
    description: 'A cozy, ski-in/ski-out chalet suitable for a family of four. Hot tub is a must!',
    locations: ['Aspen, Colorado'],
    people: 4,
  },
];

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // In a real app, these would be API calls
  const handleDelete = (id: string) => {
    setSuggestions(suggestions.filter((s) => s.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Wand className="h-6 w-6 text-primary" />
            Smart Suggestions
          </CardTitle>
          <CardDescription>
            Save your holiday preferences to get tailored AI-powered recommendations.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Suggestion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add a new Suggestion</DialogTitle>
              <DialogDescription>
                Describe your ideal trip so we can find the perfect stay for you.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title*
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Family Ski Trip"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description*
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your preferences..."
                  className="col-span-3"
                  rows={5}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Locations
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Paris, France (Optional)"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="people" className="text-right">
                  People
                </Label>
                <Input
                  id="people"
                  type="number"
                  placeholder="e.g., 2 (Optional)"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                Save Suggestion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {suggestions.length > 0 ? (
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-[25%]">Title</TableHead>
                  <TableHead className="font-bold">Details</TableHead>
                  <TableHead className="text-right font-bold w-[15%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((suggestion) => (
                  <TableRow key={suggestion.id} className="align-top">
                    <TableCell className="font-medium">{suggestion.title}</TableCell>
                    <TableCell>
                      <p className="text-muted-foreground text-sm">{suggestion.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                        {suggestion.locations &&
                          suggestion.locations.map((location, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="flex items-center gap-1.5"
                            >
                              <MapPin className="h-3 w-3" />
                              {location}
                            </Badge>
                          ))}
                        {suggestion.people && (
                          <Badge variant="outline" className="flex items-center gap-1.5">
                            <Users className="h-3 w-3" />
                            {suggestion.people} {suggestion.people === 1 ? 'person' : 'people'}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FilePen className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(suggestion.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
            <p>You haven't saved any suggestions yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
