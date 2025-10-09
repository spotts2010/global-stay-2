// src/components/AccessibilityFeaturesManagementClient.tsx
'use client';

import React, { useState, useTransition, useEffect, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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

import {
  PlusCircle,
  Trash2,
  Loader2,
  Save,
  Accessibility,
  FilePen,
  Check,
  X,
  Search,
  ArrowDown,
  ArrowUp,
} from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { updateAccessibilityFeaturesAction } from '@/app/actions';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import type { AmenityOrInclusion } from '@/lib/data';

type MasterItem = {
  id: string; // systemTag
  label: string;
  category: string;
  isShared: boolean;
  isPrivate: boolean;
  isNew?: boolean;
};

type SortKey = 'label' | 'category' | 'isShared' | 'isPrivate';
type SortDirection = 'asc' | 'desc';

const generateSystemTag = (label: string) => {
  let tag = label
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');

  if (!tag) {
    tag = `item_${Date.now()}`;
  }
  return tag;
};

export default function AccessibilityFeaturesManagementClient({
  initialFeatures,
}: {
  initialFeatures: AmenityOrInclusion[];
}) {
  const [allItems, setAllItems] = useState<MasterItem[]>([]);
  const [initialState, setInitialState] = useState<MasterItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [tempRowData, setTempRowData] = useState<Partial<MasterItem> | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'label',
    direction: 'asc',
  });

  useEffect(() => {
    const processedList = initialFeatures.map((item) => ({
      id: item.systemTag,
      label: item.label,
      category: item.category,
      isShared: item.isShared ?? false,
      isPrivate: item.isPrivate ?? true, // Default private to true if undefined
    }));

    processedList.sort((a, b) => a.label.localeCompare(b.label));

    setAllItems(processedList);
    setInitialState(JSON.parse(JSON.stringify(processedList))); // Deep copy

    if (processedList.length > 0) {
      const allCats = new Set(processedList.map((i) => i.category));
      setCategories(Array.from(allCats).sort());
    }
  }, [initialFeatures]);

  useEffect(() => {
    setIsDirty(JSON.stringify(allItems) !== JSON.stringify(initialState));
  }, [allItems, initialState]);

  const handleAddNewCategory = (newCategory: string) => {
    if (
      newCategory &&
      !categories.some((c) => c.toLowerCase() === newCategory.toLowerCase()) &&
      !isPending
    ) {
      setCategories((prev) => [...prev, newCategory].sort());
      toast({ title: 'Category Added', description: `"${newCategory}" is now available.` });
      setNewCategoryName('');
      setIsAddCategoryOpen(false);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Category already exists.' });
    }
  };

  const handleAddItem = () => {
    const newId = `new_${Date.now()}`;
    const newItem: MasterItem = {
      id: newId,
      label: '',
      category: 'Unassigned',
      isShared: false,
      isPrivate: true,
      isNew: true,
    };
    setAllItems((prev) => [newItem, ...prev]);
    setEditingRowId(newId);
    setTempRowData(newItem);
  };

  const handleEdit = (item: MasterItem) => {
    setEditingRowId(item.id);
    setTempRowData({ ...item });
  };

  const handleCancel = (id: string) => {
    const item = allItems.find((i) => i.id === id);
    if (item?.isNew) {
      setAllItems((prev) => prev.filter((i) => i.id !== id));
    }
    setEditingRowId(null);
    setTempRowData(null);
  };

  const handleSaveRow = (id: string) => {
    if (!tempRowData?.label || !tempRowData?.category) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Label and Category are required.',
      });
      return;
    }

    const newSystemTag = generateSystemTag(tempRowData.label);
    if (allItems.some((item) => item.id === newSystemTag && item.id !== id)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An item with this label already exists.',
      });
      return;
    }

    setAllItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...tempRowData,
            id: item.isNew ? newSystemTag : item.id,
            systemTag: item.isNew ? newSystemTag : item.id,
            isNew: false,
          };
        }
        return item;
      })
    );

    setEditingRowId(null);
    setTempRowData(null);
  };

  const handleDelete = (id: string) => {
    setAllItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggle = (id: string, key: 'isShared' | 'isPrivate') => {
    setAllItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: !item[key] } : item))
    );
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      if (editingRowId) {
        toast({
          variant: 'destructive',
          title: 'Unsaved Changes',
          description: 'Please save or cancel the currently editing row first.',
        });
        return;
      }

      const featuresToSave = allItems.map(({ label, category, isShared, isPrivate }, index) => ({
        systemTag: allItems[index].id, // Use the correct ID from the state
        label,
        category,
        isShared,
        isPrivate,
      }));

      const result = await updateAccessibilityFeaturesAction(featuresToSave);

      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'The accessibility features list has been updated.',
        });
        setInitialState(JSON.parse(JSON.stringify(allItems))); // Deep copy
        setIsDirty(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-2 h-3 w-3" />
    );
  };

  const filteredAndSortedItems = useMemo(() => {
    return [...allItems]
      .filter((item) => {
        if (typeFilter === 'Shared') return item.isShared;
        if (typeFilter === 'Private') return item.isPrivate;
        return true;
      })
      .filter((item) => {
        if (categoryFilter === 'All') return true;
        return item.category === categoryFilter;
      })
      .filter((item) => {
        if (searchTerm === '') return true;
        return item.label.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        let comparison = 0;

        if (typeof valA === 'boolean' && typeof valB === 'boolean') {
          comparison = valA === valB ? 0 : valA ? -1 : 1;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
  }, [allItems, typeFilter, categoryFilter, searchTerm, sortConfig]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allItems.length };
    categories.forEach((cat) => {
      counts[cat] = allItems.filter((i) => i.category === cat).length;
    });
    return counts;
  }, [allItems, categories]);

  const typeCounts = useMemo(() => {
    return {
      All: allItems.length,
      Shared: allItems.filter((i) => i.isShared).length,
      Private: allItems.filter((i) => i.isPrivate).length,
    };
  }, [allItems]);

  const SortableHeader = ({
    sortKey,
    children,
    className,
  }: {
    sortKey: SortKey;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead className={className}>
      <Button variant="ghost" onClick={() => requestSort(sortKey)} className="pl-0 h-auto">
        {children}
        {getSortIcon(sortKey)}
      </Button>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-row items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-primary" />
                Accessibility Features
              </CardTitle>
              <CardDescription>
                Manage all available accessibility features for your properties and units.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddItem}
                variant="outline"
                disabled={isPending || !!editingRowId}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isPending || !!editingRowId || !isDirty}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save All Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by label..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">
                      <div className="flex justify-between w-full">
                        <span>All Categories</span>
                        <Badge variant="secondary" className="ml-2">
                          {categoryCounts['All'] || 0}
                        </Badge>
                      </div>
                    </SelectItem>
                    {Object.keys(categoryCounts)
                      .filter((cat) => cat !== 'All')
                      .sort()
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex justify-between w-full">
                            <span>{cat}</span>
                            <Badge variant="secondary" className="ml-2">
                              {categoryCounts[cat] || 0}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </div>
            </Dialog>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by applicability..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">
                  <div className="flex justify-between w-full">
                    <span>All Types</span>
                    <Badge variant="secondary" className="ml-2">
                      {typeCounts.All}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="Shared">
                  <div className="flex justify-between w-full">
                    <span>Shared</span>
                    <Badge variant="secondary" className="ml-2">
                      {typeCounts.Shared}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="Private">
                  <div className="flex justify-between w-full">
                    <span>Private</span>
                    <Badge variant="secondary" className="ml-2">
                      {typeCounts.Private}
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader sortKey="label">Label</SortableHeader>
                  <SortableHeader sortKey="category">Category</SortableHeader>
                  <SortableHeader sortKey="isShared" className="w-[10%] text-center">
                    Shared
                  </SortableHeader>
                  <SortableHeader sortKey="isPrivate" className="w-[10%] text-center">
                    Private
                  </SortableHeader>
                  <TableHead className="text-right font-bold w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedItems.map((item) => {
                  const isEditing = editingRowId === item.id;
                  const currentData = isEditing ? tempRowData : item;

                  return (
                    <TableRow key={item.id} className={cn(item.isNew && 'bg-blue-500/10', 'h-12')}>
                      <TableCell className="py-1">
                        {isEditing ? (
                          <Input
                            value={currentData?.label || ''}
                            onChange={(e) =>
                              setTempRowData((d) => ({ ...d, label: e.target.value }))
                            }
                            placeholder="Enter label"
                            className="h-8"
                          />
                        ) : (
                          item.label
                        )}
                      </TableCell>
                      <TableCell className="py-1">
                        {isEditing ? (
                          <Select
                            value={currentData?.category || ''}
                            onValueChange={(val) =>
                              setTempRowData((d) => ({ ...d, category: val }))
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          item.category
                        )}
                      </TableCell>
                      <TableCell className="text-center py-1">
                        <Checkbox
                          checked={currentData?.isShared}
                          onCheckedChange={() =>
                            isEditing
                              ? setTempRowData((d) => ({ ...d, isShared: !d?.isShared }))
                              : handleToggle(item.id, 'isShared')
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center py-1">
                        <Checkbox
                          checked={currentData?.isPrivate}
                          onCheckedChange={() =>
                            isEditing
                              ? setTempRowData((d) => ({ ...d, isPrivate: !d?.isPrivate }))
                              : handleToggle(item.id, 'isPrivate')
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right py-1">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600"
                              onClick={() => handleSaveRow(item.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleCancel(item.id)}
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
                              onClick={() => handleEdit(item)}
                              disabled={!!editingRowId}
                            >
                              <FilePen className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  disabled={!!editingRowId}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete "
                                    {item.label}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(item.id)}>
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
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your accessibility features.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-category-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 'Auditory Assistance'"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleAddNewCategory(newCategoryName)}
              disabled={!newCategoryName.trim()}
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
