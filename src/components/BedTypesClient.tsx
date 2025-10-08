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
import { Trash2, PlusCircle, Loader2, Bed, Users } from '@/lib/icons';
import React, { useState, useTransition } from 'react';
import type { BedType } from '@/lib/data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addBedTypeAction, deleteBedTypeAction } from '@/app/actions';
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

const bedTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Bed type name is required')
    .refine((val) => /^[a-zA-Z0-9\s\-/]+$/.test(val), {
      message: 'Name can only contain letters, numbers, spaces, hyphens, and slashes.',
    }),
  sleeps: z.union([z.coerce.number().int().min(1, 'Value must be 1 or greater.'), z.literal('')]),
});

type BedTypeFormValues = z.infer<typeof bedTypeSchema>;

export default function BedTypesClient({ initialBedTypes }: { initialBedTypes: BedType[] }) {
  const [bedTypes, setBedTypes] = useState<BedType[]>(
    initialBedTypes.sort((a, b) => a.name.localeCompare(b.name))
  );
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<BedTypeFormValues>({
    resolver: zodResolver(bedTypeSchema),
    defaultValues: { name: '', sleeps: '' },
  });

  const createSystemId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '_').replace(/[-/]/g, '_');
  };

  const onSubmit = (data: BedTypeFormValues) => {
    const newBedType = {
      name: data.name,
      sleeps: data.sleeps === '' ? null : data.sleeps,
      systemId: createSystemId(data.name),
    };

    startTransition(async () => {
      const result = await addBedTypeAction(newBedType);
      if (result.success && result.id) {
        setBedTypes((prev) =>
          [...prev, { ...newBedType, id: result.id! }].sort((a, b) => a.name.localeCompare(b.name))
        );
        toast({ title: 'Bed Type Added', description: `"${data.name}" has been created.` });
        form.reset({ name: '', sleeps: '' });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to add bed type.',
        });
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    startTransition(async () => {
      const result = await deleteBedTypeAction(id);
      if (result.success) {
        setBedTypes((prev) => prev.filter((bt) => bt.id !== id));
        toast({ title: 'Bed Type Deleted', description: `"${name}" has been removed.` });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to delete bed type.',
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
              <Bed className="h-6 w-6 text-primary" />
              Manage Bed Types
            </CardTitle>
            <CardDescription>
              Add, edit, or delete the types of beds available for room configurations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bedTypes.length === 0 && initialBedTypes.length > 0 ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>System ID</TableHead>
                    <TableHead>Sleeps</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bedTypes.map((bedType) => (
                    <TableRow key={bedType.id}>
                      <TableCell className="font-medium">{bedType.name}</TableCell>
                      <TableCell className="font-mono text-xs">{bedType.systemId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {bedType.sleeps || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              disabled={isPending}
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
                                {bedType.name}" bed type.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(bedType.id, bedType.name)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Add New Bed Type</CardTitle>
                <CardDescription>Add a new type of bed to the system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Bed Type Name</Label>
                      <FormControl>
                        <Input id="name" placeholder="e.g. Sofa Bed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sleeps"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="sleeps">Sleeps</Label>
                      <FormControl>
                        <Input
                          id="sleeps"
                          type="number"
                          min="1"
                          placeholder="e.g. 2 (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  Add Bed Type
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
