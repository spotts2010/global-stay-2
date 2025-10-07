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
import { Save, Loader2, Search, Accessibility } from '@/lib/icons';
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

const FeatureItem = ({ feature }: { feature: AccessibilityFeature }) => {
  const { watch, setValue, getValues } = useFormContext<FormValues>();
  const isSelected = watch('accessibilityFeatures')?.includes(feature.id);

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2 rounded-md border transition-colors',
        isSelected ? 'bg-accent border-primary/50' : 'bg-transparent border-border'
      )}
    >
      <Checkbox
        id={`feature-${feature.id}`}
        checked={isSelected}
        onCheckedChange={(checked) => {
          const currentFeatures = getValues('accessibilityFeatures') || [];
          const updatedFeatures = checked
            ? [...currentFeatures, feature.id]
            : currentFeatures.filter((value) => value !== feature.id);
          setValue('accessibilityFeatures', updatedFeatures, { shouldDirty: true });
        }}
      />
      <FormLabel
        htmlFor={`feature-${feature.id}`}
        className="flex-1 text-sm font-normal truncate cursor-pointer"
      >
        {feature.label}
      </FormLabel>
    </div>
  );
};

export default function AccessibilityFeaturesPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<AccessibilityCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const formMethods = useForm<FormValues>({
    defaultValues: {
      accessibilityFeatures: [],
    },
  });

  const selectedFeatures = formMethods.watch('accessibilityFeatures') || [];

  const handleSave = (formData: FormValues) => {
    startTransition(async () => {
      // In a real app, this would save to the database.
      console.log('Saving Accessibility Features:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Changes Saved (Simulated)',
        description: 'The accessibility features have been updated.',
      });
      formMethods.reset(formData);
    });
  };

  const FeatureGrid = ({ features }: { features: AccessibilityFeature[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
      {features.map((feature) => (
        <FeatureItem key={feature.id} feature={feature} />
      ))}
    </div>
  );

  const filteredFeatures = accessibilityFeaturesData.filter((feature) => {
    const matchesCategory = activeCategory === 'All' || feature.category === activeCategory;
    const matchesSearch =
      searchTerm === '' ||
      feature.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSave)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5 mb-4 sm:mb-0">
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="h-6 w-6 text-primary" />
                  Accessibility & Features
                </CardTitle>
                <CardDescription>
                  Select all accessibility features available for this unit.
                </CardDescription>
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
            <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
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
                    {featureCategories.map((category) => {
                      const selectedInCategory = accessibilityFeaturesData.filter(
                        (a) =>
                          selectedFeatures.includes(a.id) &&
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
            <FeatureGrid features={filteredFeatures} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Accessibility & Features</CardTitle>
            <CardDescription>
              If a feature is not in the list, add it here (one per line).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="e.g., Braille signage for room numbers" />
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Custom features will be reviewed before appearing on the live site.
            </p>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
