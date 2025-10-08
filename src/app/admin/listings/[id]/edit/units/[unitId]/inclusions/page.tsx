'use client';

import React, { useState, useTransition } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Save,
  Loader2,
  Search,
  ListChecks,
  AiOutlineDollarCircle,
  AiFillDollarCircle,
} from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { FormLabel } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type InclusionCategory =
  | 'All'
  | 'General'
  | 'Outdoor'
  | 'Bathroom'
  | 'Entertainment'
  | 'View'
  | 'Kitchen'
  | 'Security';

type Inclusion = {
  id: string;
  label: string;
  category: InclusionCategory;
};

// This would typically come from a central data source in Firestore
const privateInclusionsData: Inclusion[] = [
  { id: 'p1', label: 'Air Conditioning', category: 'General' },
  { id: 'p2', label: 'Private Balcony', category: 'Outdoor' },
  { id: 'p3', label: 'Bathtub', category: 'Bathroom' },
  { id: 'p4', label: 'Blackout Curtains', category: 'General' },
  { id: 'p5', label: 'BluRay Player', category: 'Entertainment' },
  { id: 'p6', label: 'City View', category: 'View' },
  { id: 'p7', label: 'Coffee Machine', category: 'Kitchen' },
  { id: 'p8', label: 'Work Desk', category: 'General' },
  { id: 'p9', label: 'DVD Player', category: 'Entertainment' },
  { id: 'p10', label: 'Ensuite Bathroom', category: 'Bathroom' },
  { id: 'p11', label: 'Fridge / Freezer', category: 'Kitchen' },
  { id: 'p12', label: 'Garden View', category: 'View' },
  { id: 'p13', label: 'Hair Dryer', category: 'Bathroom' },
  { id: 'p14', label: 'Heating', category: 'General' },
  { id: 'p15', label: 'Iron', category: 'General' },
  { id: 'p16', label: 'Kitchen', category: 'Kitchen' },
  { id: 'p17', label: 'Microwave', category: 'Kitchen' },
  { id: 'p18', label: 'Mini Fridge', category: 'Kitchen' },
  { id: 'p19', label: 'Mountain View', category: 'View' },
  { id: 'p20', label: 'Ocean View', category: 'View' },
  { id: 'p21', label: 'Safe Deposit Box', category: 'Security' },
  { id: 'p22', label: 'Toaster', category: 'Kitchen' },
  { id: 'p23', label: 'Complimentary Toiletries', category: 'Bathroom' },
  { id: 'p24', label: 'TV', category: 'Entertainment' },
].sort((a, b) => a.label.localeCompare(b.label));

const inclusionCategories: InclusionCategory[] = [
  'All',
  'General',
  'Outdoor',
  'Bathroom',
  'Entertainment',
  'View',
  'Kitchen',
  'Security',
];

type FormValues = {
  inclusions: string[];
  chargeableInclusions: string[];
};

const InclusionItem = ({ inclusion }: { inclusion: Inclusion }) => {
  const { watch, setValue, getValues } = useFormContext<FormValues>();
  const isIncluded = watch('inclusions')?.includes(inclusion.id);
  const isChargeable = watch('chargeableInclusions')?.includes(inclusion.id);

  const handleChargeableToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isIncluded) return;

    const currentChargeable = getValues('chargeableInclusions') || [];
    const newChargeable = isChargeable
      ? currentChargeable.filter((id) => id !== inclusion.id)
      : [...currentChargeable, inclusion.id];
    setValue('chargeableInclusions', newChargeable, { shouldDirty: true });
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2 rounded-md border transition-colors',
        isIncluded ? 'bg-accent border-primary/50' : 'bg-transparent border-border'
      )}
    >
      <Checkbox
        id={`inclusion-${inclusion.id}`}
        checked={isIncluded}
        onCheckedChange={(checked) => {
          const inclusions = getValues('inclusions') || [];
          const updatedInclusions = checked
            ? [...inclusions, inclusion.id]
            : inclusions.filter((value) => value !== inclusion.id);
          setValue('inclusions', updatedInclusions, { shouldDirty: true });

          if (!checked) {
            const currentChargeable = getValues('chargeableInclusions') || [];
            setValue(
              'chargeableInclusions',
              currentChargeable.filter((id) => id !== inclusion.id),
              { shouldDirty: true }
            );
          }
        }}
      />

      <FormLabel
        htmlFor={`inclusion-${inclusion.id}`}
        className="flex-1 text-sm font-normal truncate cursor-pointer"
      >
        {inclusion.label}
      </FormLabel>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn('h-5 w-5', isIncluded ? 'cursor-pointer' : 'cursor-not-allowed')}
              onClick={handleChargeableToggle}
              disabled={!isIncluded}
              aria-label="Toggle chargeable"
            >
              {!isIncluded ? (
                <AiOutlineDollarCircle className="h-5 w-5 text-muted-foreground/50" />
              ) : isChargeable ? (
                <AiFillDollarCircle className="h-5 w-5 text-primary" />
              ) : (
                <AiOutlineDollarCircle className="h-5 w-5 text-foreground" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle if fees apply</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default function InclusionsPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<InclusionCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const formMethods = useForm<FormValues>({
    defaultValues: {
      inclusions: [],
      chargeableInclusions: [],
    },
  });

  const selectedInclusions = formMethods.watch('inclusions') || [];

  const handleSave = (formData: FormValues) => {
    startTransition(async () => {
      // In a real app, this would save to the database.
      console.log('Saving Inclusions:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Changes Saved (Simulated)',
        description: 'The unit inclusions have been updated.',
      });
      formMethods.reset(formData);
    });
  };

  const InclusionGrid = ({ inclusions }: { inclusions: Inclusion[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
      {inclusions.map((inclusion) => (
        <InclusionItem key={inclusion.id} inclusion={inclusion} />
      ))}
    </div>
  );

  const filteredInclusions = privateInclusionsData.filter((inclusion) => {
    const matchesCategory = activeCategory === 'All' || inclusion.category === activeCategory;
    const matchesSearch =
      searchTerm === '' ||
      inclusion.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inclusion.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSave)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Inclusions
                </CardTitle>
                <CardDescription>
                  Select all features available inside this specific unit and specify if fees apply.
                </CardDescription>
              </div>
              <Button
                type="submit"
                disabled={isPending || !formMethods.formState.isDirty}
                className="mt-4 sm:mt-0 w-full sm:w-auto"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
              <AiFillDollarCircle className="h-5 w-5 text-primary" />
              <span>
                = When enabled, this icon indicates that additional fees may be applicable.
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Filter by keyword..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex w-full sm:w-auto items-center gap-2">
                <Label
                  htmlFor="inclusion-category-filter"
                  className="text-sm font-medium sr-only sm:not-sr-only"
                >
                  Category:
                </Label>
                <Select
                  value={activeCategory}
                  onValueChange={(value) => setActiveCategory(value as InclusionCategory)}
                >
                  <SelectTrigger id="inclusion-category-filter" className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Filter by category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {inclusionCategories.map((category) => {
                      const selectedInCategory = privateInclusionsData.filter(
                        (a) =>
                          selectedInclusions.includes(a.id) &&
                          (category === 'All' || a.category === category)
                      );
                      return (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center justify-between w-full">
                            <span>{category}</span>
                            <Badge variant="secondary" className="ml-4 px-1.5 py-0">
                              {selectedInCategory.length}
                            </Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <InclusionGrid inclusions={filteredInclusions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Inclusions</CardTitle>
            <CardDescription>
              If an inclusion is not in the master list, add it here. Custom inclusions require
              admin approval before they appear on the live site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="e.g., Japanese Tatami Mats, Smart Mirror" />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button variant="outline">Submit for Approval</Button>
            <p className="text-xs text-muted-foreground">
              These will be reviewed before being added to the main inclusions list.
            </p>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
