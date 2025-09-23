'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, Loader2, MapPin, FilePen, Check, X } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { PoiCategory } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

const initialCategories: PoiCategory[] = [
  'Dining',
  'Food & Drink',
  'Nature & Outdoors',
  'Attractions & Entertainment',
  'Medical & Emergency',
  'Shopping & Retail',
  'Transport',
  'Activities & Tours',
  'Business & Services',
  'Beauty & Wellbeing',
  'Unassigned',
];

const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .refine((val) => /^[a-zA-Z0-9\s&]+$/.test(val), {
      message: 'Name can only contain letters, numbers, spaces, and ampersands.',
    }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const categoryMappings: Record<string, string[]> = {
  Dining: ['restaurant', 'cafe', 'bar', 'bakery', 'meal_takeaway'],
  'Food & Drink': ['supermarket', 'grocery_or_supermarket', 'liquor_store'],
  'Nature & Outdoors': ['park', 'natural_feature'],
  'Attractions & Entertainment': [
    'tourist_attraction',
    'museum',
    'amusement_park',
    'aquarium',
    'zoo',
    'movie_theater',
    'stadium',
    'night_club',
    'art_gallery',
    'bowling_alley',
    'casino',
  ],
  'Medical & Emergency': [
    'hospital',
    'doctor',
    'pharmacy',
    'drugstore',
    'dentist',
    'physiotherapist',
    'police',
  ],
  'Shopping & Retail': [
    'shopping_mall',
    'department_store',
    'clothing_store',
    'shoe_store',
    'book_store',
    'electronics_store',
    'hardware_store',
    'furniture_store',
    'home_goods_store',
    'store',
  ],
  Transport: [
    'train_station',
    'subway_station',
    'light_rail_station',
    'bus_station',
    'airport',
    'taxi_stand',
    'car_rental',
    'gas_station',
  ],
  'Activities & Tours': ['travel_agency'],
  'Business & Services': [
    'bank',
    'atm',
    'post_office',
    'library',
    'car_wash',
    'car_repair',
    'laundry',
  ],
  'Beauty & Wellbeing': ['beauty_salon', 'hair_care', 'nail_salon', 'spa', 'gym'],
  Unassigned: ['Any un-mapped type'],
};

export default function PoiCategoriesPage() {
  const [categories, setCategories] = useState<PoiCategory[]>(() => {
    const unassigned = initialCategories.filter((cat) => cat === 'Unassigned');
    const others = initialCategories.filter((cat) => cat !== 'Unassigned').sort();
    return [...others, ...unassigned];
  });

  const [editingCategory, setEditingCategory] = useState<PoiCategory | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  const onSubmit = (data: CategoryFormValues) => {
    startTransition(() => {
      // In a real app, this would be an API call to add the category.
      const newCategory = data.name as PoiCategory;
      if (categories.some((cat) => cat.toLowerCase() === newCategory.toLowerCase())) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'This category already exists.',
        });
        return;
      }
      setCategories((prev) => {
        const unassigned = prev.filter((cat) => cat === 'Unassigned');
        const others = [...prev.filter((cat) => cat !== 'Unassigned'), newCategory].sort();
        return [...others, ...unassigned];
      });
      toast({ title: 'Category Added', description: `"${data.name}" has been created.` });
      form.reset();
    });
  };

  const handleDelete = (categoryToDelete: PoiCategory) => {
    startTransition(() => {
      // In a real app, this would be an API call to delete the category.
      if (categoryToDelete === 'Unassigned') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'The "Unassigned" category cannot be deleted.',
        });
        return;
      }
      setCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));
      toast({ title: 'Category Deleted', description: `"${categoryToDelete}" has been removed.` });
    });
  };

  const handleEditClick = (category: PoiCategory) => {
    setEditingCategory(category);
    setEditingValue(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingValue('');
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;
    if (editingValue.trim() === '') {
      toast({ variant: 'destructive', title: 'Error', description: 'Category name is required.' });
      return;
    }
    if (
      categories.some(
        (cat) =>
          cat.toLowerCase() === editingValue.toLowerCase() &&
          cat.toLowerCase() !== editingCategory.toLowerCase()
      )
    ) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'This category already exists.',
      });
      return;
    }

    startTransition(() => {
      // In a real app, this would be an API call to update the category.
      const oldCategoryName = editingCategory;
      const newCategoryName = editingValue as PoiCategory;

      setCategories((prev) => {
        const updated = prev.map((cat) => (cat === oldCategoryName ? newCategoryName : cat));
        const unassigned = updated.filter((cat) => cat === 'Unassigned');
        const others = updated.filter((cat) => cat !== 'Unassigned').sort();
        return [...others, ...unassigned];
      });

      // Also update the mapping key
      if (categoryMappings[oldCategoryName]) {
        categoryMappings[newCategoryName] = categoryMappings[oldCategoryName];
        if (oldCategoryName !== newCategoryName) {
          delete categoryMappings[oldCategoryName];
        }
      }

      toast({
        title: 'Category Updated',
        description: `"${oldCategoryName}" renamed to "${newCategoryName}".`,
      });
      handleCancelEdit();
    });
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="h-6 w-6 text-primary" />
                Manage POI Categories
              </CardTitle>
              <CardDescription>
                Add, edit, or delete the categories used for points of interest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Mapping References</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category}>
                      <TableCell className="w-1/4">
                        {editingCategory === category ? (
                          <Input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          <span className="font-medium">{category}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(
                            categoryMappings[
                              editingCategory === category ? editingCategory : category
                            ] || []
                          ).map((type) => (
                            <Badge key={type} variant="secondary" className="font-mono">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right w-[120px]">
                        {editingCategory === category ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600"
                              onClick={handleSaveEdit}
                              disabled={isPending}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditClick(category)}
                              disabled={isPending || !!editingCategory || category === 'Unassigned'}
                            >
                              <FilePen className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  disabled={
                                    isPending || !!editingCategory || category === 'Unassigned'
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the "
                                    {category}" category.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(category)}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Add New Category</CardTitle>
                  <CardDescription>Add a new category to the system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <fieldset disabled={!!editingCategory}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="name">Category Name</Label>
                          <FormControl>
                            <Input id="name" placeholder="e.g. Landmarks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </fieldset>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isPending || !!editingCategory}>
                    {isPending && !editingCategory ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    )}
                    Add Category
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
