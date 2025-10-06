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
import { Trash2, PlusCircle, Loader2, Home, FilePen, Check, X } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import type { PropertyType } from '@/lib/data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  addPropertyTypeAction,
  deletePropertyTypeAction,
  updatePropertyTypeAction,
} from '@/app/actions';
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

const propertyTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Property type name is required')
    .refine((val) => /^[a-zA-Z0-9\s]+$/.test(val), {
      message: 'Name can only contain letters, numbers, and spaces.',
    }),
});

type PropertyTypeFormValues = z.infer<typeof propertyTypeSchema>;

export default function PropertyTypesClient({
  initialPropertyTypes,
}: {
  initialPropertyTypes: PropertyType[];
}) {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(
    initialPropertyTypes.sort((a, b) => a.name.localeCompare(b.name))
  );
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<PropertyTypeFormValues>({
    resolver: zodResolver(propertyTypeSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = (data: PropertyTypeFormValues) => {
    startTransition(async () => {
      const result = await addPropertyTypeAction(data.name);
      if (result.success && result.id) {
        setPropertyTypes((prev) =>
          [...prev, { id: result.id!, name: data.name }].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
        toast({ title: 'Property Type Added', description: `"${data.name}" has been created.` });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to add property type.',
        });
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    startTransition(async () => {
      const result = await deletePropertyTypeAction(id);
      if (result.success) {
        setPropertyTypes((prev) => prev.filter((pt) => pt.id !== id));
        toast({ title: 'Property Type Deleted', description: `"${name}" has been removed.` });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to delete property type.',
        });
      }
    });
  };

  const handleEditClick = (propertyType: PropertyType) => {
    setEditingRowId(propertyType.id);
    setEditingValue(propertyType.name);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingValue('');
  };

  const handleSaveEdit = () => {
    if (!editingRowId) return;

    if (editingValue.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Property type name is required.',
      });
      return;
    }

    if (
      propertyTypes.some(
        (pt) => pt.name.toLowerCase() === editingValue.toLowerCase() && pt.id !== editingRowId
      )
    ) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'This property type already exists.',
      });
      return;
    }

    startTransition(async () => {
      const oldName = propertyTypes.find((pt) => pt.id === editingRowId)?.name;
      const result = await updatePropertyTypeAction(editingRowId, editingValue);

      if (result.success) {
        setPropertyTypes((prev) =>
          prev
            .map((pt) => (pt.id === editingRowId ? { ...pt, name: editingValue } : pt))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
        toast({
          title: 'Property Type Updated',
          description: `"${oldName}" renamed to "${editingValue}".`,
        });
        handleCancelEdit();
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Home className="h-6 w-6 text-primary" />
              Manage Property Types
            </CardTitle>
            <CardDescription>
              Add, edit, or delete the available types of properties (e.g., Hotel, Villa).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Type Name</TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertyTypes.map((pt) => (
                  <TableRow key={pt.id}>
                    <TableCell>
                      {editingRowId === pt.id ? (
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="h-8"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{pt.name}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingRowId === pt.id ? (
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
                            onClick={() => handleEditClick(pt)}
                            disabled={isPending || !!editingRowId}
                          >
                            <FilePen className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                disabled={isPending || !!editingRowId}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the "
                                  {pt.name}" property type.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(pt.id, pt.name)}>
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
                <CardTitle>Add New Type</CardTitle>
                <CardDescription>Add a new property type to the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Type Name</Label>
                      <FormControl>
                        <Input id="name" placeholder="e.g. Townhouse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending || !!editingRowId}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  Add Type
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
