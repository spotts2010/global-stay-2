'use client';

import React, { useState, useTransition } from 'react';
import { useForm, FormProvider, useWatch, useFormContext } from 'react-hook-form';
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
  Accessibility,
  AiFillDollarCircle,
  AiOutlineDollarCircle,
} from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { FormLabel } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
import { useParams } from 'next/navigation';
import { updateUnitAction } from '@/app/actions';
import type { BookableUnit } from '@/components/UnitsPageClient';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { Accommodation } from '@/lib/data';

type AccessibilityCategory = 'All' | 'Getting Around' | 'In-Unit Comforts' | 'Bathroom' | 'Parking';

type AccessibilityFeature = {
  id: string;
  label: string;
  category: AccessibilityCategory;
};

// This would typically come from a central data source in Firestore
const accessibilityFeaturesData: AccessibilityFeature[] = [
  { id: 'step_free_access', label: 'Step-free access to unit', category: 'Getting Around' },
  { id: 'wide_doorways', label: 'Wide doorways (over 32 inches)', category: 'Getting Around' },
  { id: 'elevator_access', label: 'Elevator access', category: 'Getting Around' },
  { id: 'flat_paths', label: 'Flat, well-lit path to entrance', category: 'Getting Around' },
  { id: 'accessible_parking', label: 'Accessible parking spot', category: 'Parking' },
  { id: 'roll_in_shower', label: 'Roll-in shower', category: 'Bathroom' },
  { id: 'grab_rails_shower', label: 'Grab rails in shower', category: 'Bathroom' },
  { id: 'grab_rails_toilet', label: 'Grab rails by toilet', category: 'Bathroom' },
  { id: 'shower_chair', label: 'Shower chair available', category: 'Bathroom' },
  { id: 'adjustable_bed', label: 'Adjustable height bed', category: 'In-Unit Comforts' },
  { id: 'visual_alarms', label: 'Visual (strobe) fire/smoke alarms', category: 'In-Unit Comforts' },
  { id: 'lowered_counters', label: 'Lowered kitchen counters', category: 'In-Unit Comforts' },
].sort((a, b) => a.label.localeCompare(b.label));

const featureCategories: AccessibilityCategory[] = [
  'All',
  'Getting Around',
  'In-Unit Comforts',
  'Bathroom',
  'Parking',
];

type FormValues = {
  accessibilityFeatures: string[];
};

const FeatureItem = ({
  feature,
  isChargeable,
  onToggleChargeable,
}: {
  feature: AccessibilityFeature;
  isChargeable: boolean;
  onToggleChargeable: (e: React.MouseEvent, id: string) => void;
}) => {
  const { control, getValues, setValue } = useFormContext<FormValues>();
  const selectedFeatures = useWatch({ control, name: 'accessibilityFeatures' }) || [];
  const isSelected = selectedFeatures.includes(feature.id);

  const onCheckedChange = (checked: boolean) => {
    const currentFeatures = getValues('accessibilityFeatures') || [];
    const updatedFeatures = checked
      ? [...currentFeatures, feature.id]
      : currentFeatures.filter((value) => value !== feature.id);
    setValue('accessibilityFeatures', updatedFeatures, { shouldDirty: true });
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-2 rounded-md border transition-colors',
        isSelected ? 'bg-accent border-primary/50' : 'bg-transparent border-border'
      )}
    >
      <Checkbox
        id={`feature-${feature.id}`}
        checked={isSelected}
        onCheckedChange={onCheckedChange}
        className="mt-1"
      />
      <div className="flex-1">
        <FormLabel
          htmlFor={`feature-${feature.id}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {feature.label}
        </FormLabel>
        <p className="text-xs text-muted-foreground">{feature.category}</p>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={(e) => onToggleChargeable(e, feature.id)}
              disabled={!isSelected}
              className={cn('h-5 w-5 mt-0.5', isSelected ? 'cursor-pointer' : 'cursor-not-allowed')}
              aria-label="Toggle chargeable"
            >
              {!isSelected ? (
                <AiOutlineDollarCircle className="h-5 w-5 text-muted-foreground/30" />
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

const FeatureGrid = ({
  features,
  chargeableFeatures,
  setChargeableFeatures,
}: {
  features: AccessibilityFeature[];
  chargeableFeatures: string[];
  setChargeableFeatures: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { control } = useFormContext<FormValues>();
  const selectedFeatures = useWatch({ control, name: 'accessibilityFeatures' }) || [];

  const handleToggleChargeable = (e: React.MouseEvent, featureId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isSelected = selectedFeatures.includes(featureId);
    if (!isSelected) return;

    setChargeableFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
      {features.map((feature) => (
        <FeatureItem
          key={feature.id}
          feature={feature}
          isChargeable={chargeableFeatures.includes(feature.id)}
          onToggleChargeable={handleToggleChargeable}
        />
      ))}
    </div>
  );
};

export default function AccessibilityPageClient({
  listing: _listing,
  unit,
}: {
  listing: Accommodation;
  unit?: BookableUnit;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<AccessibilityCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const params = useParams();
  const listingId = params.id as string;
  const unitId = params.unitId as string;
  const [chargeableFeatures, setChargeableFeatures] = useState<string[]>(
    unit?.chargeableAccessibilityFeatures || []
  );

  const formMethods = useForm<FormValues>({
    defaultValues: {
      accessibilityFeatures: unit?.accessibilityFeatures || [],
    },
  });

  const { handleSubmit, reset } = formMethods;

  const handleSave = (formData: FormValues) => {
    startTransition(async () => {
      const result = await updateUnitAction(listingId, unitId, {
        accessibilityFeatures: formData.accessibilityFeatures,
        chargeableAccessibilityFeatures: chargeableFeatures,
      });

      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'The accessibility features have been updated.',
        });
        reset(formData); // Reset dirty state
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const filteredFeatures = accessibilityFeaturesData.filter((feature) => {
    const matchesCategory = activeCategory === 'All' || feature.category === activeCategory;
    const matchesSearch =
      searchTerm === '' ||
      feature.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!unit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Not Found</CardTitle>
          <CardDescription>
            The selected unit could not be found. Please go back and select a valid unit.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const selectedFeaturesCount = formMethods.watch('accessibilityFeatures')?.length || 0;
  const categoryCounts = accessibilityFeaturesData.reduce(
    (acc, feature) => {
      if (formMethods.watch('accessibilityFeatures')?.includes(feature.id)) {
        acc[feature.category] = (acc[feature.category] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5 mb-4 sm:mb-0">
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="h-6 w-6 text-primary" />
                    Accessibility
                  </CardTitle>
                  <CardDescription>
                    Select all accessibility features available for this unit.
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                    <AiFillDollarCircle className="h-5 w-5 text-primary" />
                    <span>
                      = When enabled, this icon indicates that additional fees may be applicable.
                    </span>
                  </div>
                </div>
                <Button type="submit" disabled={isPending || !formMethods.formState.isDirty}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
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
                    htmlFor="feature-category-filter"
                    className="text-sm font-medium sr-only sm:not-sr-only"
                  >
                    Category:
                  </Label>
                  <Select
                    value={activeCategory}
                    onValueChange={(value) => setActiveCategory(value as AccessibilityCategory)}
                  >
                    <SelectTrigger id="feature-category-filter" className="w-full sm:w-[280px]">
                      <SelectValue placeholder="Filter by category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">
                        <div className="flex items-center justify-between w-full">
                          <span>All Categories</span>
                          <Badge variant="secondary" className="ml-4 px-1.5 py-0">
                            {selectedFeaturesCount}
                          </Badge>
                        </div>
                      </SelectItem>
                      {featureCategories
                        .filter((c) => c !== 'All')
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center justify-between w-full">
                              <span>{category}</span>
                              <Badge variant="secondary" className="ml-4 px-1.5 py-0">
                                {categoryCounts[category] || 0}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <FeatureGrid
                features={filteredFeatures}
                chargeableFeatures={chargeableFeatures}
                setChargeableFeatures={setChargeableFeatures}
              />
            </CardContent>
          </Card>
        </form>
      </FormProvider>

      <Card>
        <CardHeader>
          <CardTitle>Custom Accessibility</CardTitle>
          <CardDescription>
            If a feature is not in the list, add it here. Custom features require admin approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="This feature is coming soon. Custom additions will require admin approval before appearing on the live site."
            disabled
          />
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button variant="outline" disabled>
            Submit for Approval
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
