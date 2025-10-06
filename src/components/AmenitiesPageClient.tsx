'use client';

import React, { useState, useTransition, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Trash2,
  PlusCircle,
  Loader2,
  ListChecks,
  FilePen,
  Check,
  X,
  Search,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
} from 'lucide-react';
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
import { updatePrivateInclusionsAction, updateSharedAmenitiesAction } from '@/app/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

type Item = {
  id: string;
  label: string;
  systemTag: string;
  category: string;
};

type UnifiedAmenity = {
  id: string; // Will use systemTag
  label: string;
  systemTag: string;
  category: string;
  isPrivate: boolean;
  isShared: boolean;
};

type SortKey = 'label' | 'category' | 'systemTag';
type SortDirection = 'asc' | 'desc';
type TypeFilter = 'All' | 'Private' | 'Shared';

function combineAndNormalize(
  shared: Item[],
  privateItems: Item[]
): { amenities: UnifiedAmenity[]; categories: string[] } {
  const map = new Map<string, UnifiedAmenity>();

  const processItems = (items: Item[], type: 'Shared' | 'Private') => {
    items.forEach((item) => {
      const existing = map.get(item.systemTag);
      if (existing) {
        if (type === 'Shared') existing.isShared = true;
        if (type === 'Private') existing.isPrivate = true;
      } else {
        map.set(item.systemTag, {
          id: item.systemTag,
          label: item.label,
          systemTag: item.systemTag,
          category: item.category,
          isPrivate: type === 'Private',
          isShared: type === 'Shared',
        });
      }
    });
  };

  processItems(shared, 'Shared');
  processItems(privateItems, 'Private');

  const amenities = Array.from(map.values());
  const categories = Array.from(new Set(amenities.map((a) => a.category))).sort();

  return { amenities, categories };
}

function CategoryCombobox({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal bg-white"
        >
          {value ? categories.find((cat) => cat === value) || value : 'Select or create...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Search or add category..."
            onValueChange={(currentValue) => onChange(currentValue)}
          />
          <CommandList>
            <CommandEmpty>
              {value && !categories.includes(value) ? (
                <div className="p-2 text-sm text-center">
                  Create new category:
                  <p className="font-bold">"{value}"</p>
                </div>
              ) : (
                'No category found.'
              )}
            </CommandEmpty>
            <CommandGroup>
              {categories.map((cat) => (
                <CommandItem
                  key={cat}
                  value={cat}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : cat);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === cat ? 'opacity-100' : 'opacity-0')}
                  />
                  {cat}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function AmenitiesManagementClient({
  initialSharedAmenities,
  initialPrivateInclusions,
}: {
  initialSharedAmenities: Item[];
  initialPrivateInclusions: Item[];
}) {
  const { amenities: initialAmenities, categories: initialCategories } = combineAndNormalize(
    initialSharedAmenities,
    initialPrivateInclusions
  );

  const [amenities, setAmenities] = useState<UnifiedAmenity[]>(initialAmenities);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<UnifiedAmenity>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'label',
    direction: 'asc',
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleEditStart = (amenity: UnifiedAmenity) => {
    setEditingRowId(amenity.id);
    setTempData(amenity);
  };

  const handleEditCancel = () => {
    // If it was a new, unsaved row, remove it from the state
    if (editingRowId?.startsWith('new_')) {
      setAmenities((prev) => prev.filter((a) => a.id !== editingRowId));
    }
    setEditingRowId(null);
    setTempData({});
  };

  const createSystemTag = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '_');
  };

  const handleSaveEdit = () => {
    if (!tempData.label?.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Label cannot be empty.' });
      return;
    }
    if (!tempData.isPrivate && !tempData.isShared) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Amenity must be Private, Shared, or both.',
      });
      return;
    }

    const isDuplicate = amenities.some(
      (a) =>
        a.id !== editingRowId &&
        a.label.trim().toLowerCase() === tempData.label!.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast({
        variant: 'destructive',
        title: 'Duplicate Item',
        description: 'Amenity or Inclusions already exists, please try again.',
      });
      return;
    }

    const isNewItem = editingRowId?.startsWith('new_');
    if (isNewItem) {
      const newSystemTag = createSystemTag(tempData.label!);
      const newAmenity: UnifiedAmenity = {
        id: newSystemTag,
        systemTag: newSystemTag,
        label: tempData.label!,
        category: tempData.category || 'Unassigned',
        isPrivate: !!tempData.isPrivate,
        isShared: !!tempData.isShared,
      };
      setAmenities((prev) => [...prev.filter((a) => a.id !== editingRowId), newAmenity]);
    } else {
      setAmenities((prev) =>
        prev.map((a) => (a.id === editingRowId ? ({ ...a, ...tempData } as UnifiedAmenity) : a))
      );
    }

    // Add new category if it doesn't exist
    if (tempData.category && !categories.includes(tempData.category)) {
      setCategories((prev) => [...prev, tempData.category!].sort());
    }
    handleEditCancel();
  };

  const handleAddNew = () => {
    const newId = `new_${Date.now()}`;
    const newAmenity: UnifiedAmenity = {
      id: newId,
      label: '',
      systemTag: '(auto-generated)',
      category: categories[0] || 'General',
      isPrivate: false,
      isShared: false,
    };
    setAmenities((prev) => [newAmenity, ...prev]);
    handleEditStart(newAmenity);
  };

  const handleDelete = (id: string) => {
    setAmenities((prev) => prev.filter((a) => a.id !== id));
    toast({ title: 'Item Removed', description: 'The item will be deleted upon saving.' });
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const finalAmenities = amenities
        .filter((a) => a.label) // Filter out any empty-label new items
        .map((a) => {
          if (a.id.startsWith('new_')) {
            const systemTag = a.label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
            return { ...a, id: systemTag, systemTag };
          }
          return a;
        });

      const sharedToSave = finalAmenities
        .filter((a) => a.isShared)
        .map(({ id, label, systemTag, category }) => ({ id, label, systemTag, category }));
      const privateToSave = finalAmenities
        .filter((a) => a.isPrivate)
        .map(({ id, label, systemTag, category }) => ({ id, label, systemTag, category }));

      const [sharedResult, privateResult] = await Promise.all([
        updateSharedAmenitiesAction(sharedToSave),
        updatePrivateInclusionsAction(privateToSave),
      ]);

      if (sharedResult.success && privateResult.success) {
        toast({ title: 'Success', description: 'All amenities have been updated.' });
        setAmenities(finalAmenities);
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: sharedResult.error || privateResult.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const filteredAndSortedAmenities = useMemo(() => {
    const result = [...amenities].filter((a) => {
      // Always include the item being edited
      if (a.id === editingRowId) return true;

      // Filter by type
      if (typeFilter !== 'All') {
        const isCorrectType = typeFilter === 'Shared' ? a.isShared : a.isPrivate;
        if (!isCorrectType) return false;
      }
      // Filter by category
      if (categoryFilter !== 'All') {
        if (a.category !== categoryFilter) return false;
      }
      // Filter by search term
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const matches =
          a.label.toLowerCase().includes(lowerSearch) ||
          a.category.toLowerCase().includes(lowerSearch);
        if (!matches) return false;
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [amenities, typeFilter, categoryFilter, searchTerm, sortConfig, editingRowId]);

  const SortableHeader = ({
    sortKey,
    children,
  }: {
    sortKey: SortKey;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() =>
          setSortConfig((prev) => ({
            key: sortKey,
            direction: prev.key === sortKey && prev.direction === 'asc' ? 'desc' : 'asc',
          }))
        }
        className="px-2"
      >
        {children}
        {sortConfig.key === sortKey &&
          (sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ListChecks className="h-6 w-6 text-primary" />
              Amenities & Inclusions
            </CardTitle>
            <CardDescription className="mt-1">
              Manage the master lists for property-wide and unit-specific features.
            </CardDescription>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <Button variant="outline" onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New
            </Button>
            <Button onClick={handleSaveChanges} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save All Changes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 mt-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-auto md:flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <div className="w-full md:w-auto">
            <Label htmlFor="category-filter" className="sr-only">
              Category
            </Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category-filter" className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Label htmlFor="type-filter" className="sr-only">
              Type
            </Label>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
              <SelectTrigger id="type-filter" className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Shared">Shared Only</SelectItem>
                <SelectItem value="Private">Private Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader sortKey="label">Name / Label</SortableHeader>
                <SortableHeader sortKey="systemTag">System Tag</SortableHeader>
                <SortableHeader sortKey="category">Category</SortableHeader>
                <TableHead className="text-center">Private</TableHead>
                <TableHead className="text-center">Shared</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedAmenities.map((amenity) => {
                const isEditing = editingRowId === amenity.id;
                return (
                  <TableRow key={amenity.id} className={cn(isEditing && 'bg-accent')}>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={tempData.label ?? ''}
                          onChange={(e) => setTempData({ ...tempData, label: e.target.value })}
                        />
                      ) : (
                        <span className="font-medium">{amenity.label}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {amenity.systemTag}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <CategoryCombobox
                          value={tempData.category || ''}
                          onChange={(val) => setTempData({ ...tempData, category: val })}
                          categories={categories}
                        />
                      ) : (
                        amenity.category
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={isEditing ? tempData.isPrivate : amenity.isPrivate}
                        onCheckedChange={(checked) =>
                          isEditing
                            ? setTempData({ ...tempData, isPrivate: !!checked })
                            : setAmenities((prev) =>
                                prev.map((a) =>
                                  a.id === amenity.id ? { ...a, isPrivate: !!checked } : a
                                )
                              )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={isEditing ? tempData.isShared : amenity.isShared}
                        onCheckedChange={(checked) =>
                          isEditing
                            ? setTempData({ ...tempData, isShared: !!checked })
                            : setAmenities((prev) =>
                                prev.map((a) =>
                                  a.id === amenity.id ? { ...a, isShared: !!checked } : a
                                )
                              )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex gap-2 justify-end">
                          <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={handleEditCancel}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditStart(amenity)}
                          >
                            <FilePen className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove "{amenity.label}" from the list. This is not
                                  permanent until you save changes.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(amenity.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
