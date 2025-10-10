// src/components/AccessibilityPageClient.tsx
'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  Save,
  Search,
  AiOutlineDollarCircle,
  AiFillDollarCircle,
  Accessibility,
} from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { Accommodation } from '@/lib/data';
import {
  updateListingAccessibilityFeaturesAction,
  updateUnitAccessibilityFeaturesAction,
} from '@/app/actions';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { BookableUnit } from './UnitsPageClient';
import { useRouter, useParams } from 'next/navigation';

type AccessibilityFeatureItem = {
  id: string; // systemTag
  label: string;
  category: string;
};

export default function AccessibilityPageClient({
  listing,
  unit,
  allAccessibilityFeatures,
}: {
  listing: Accommodation;
  unit?: BookableUnit;
  allAccessibilityFeatures: AccessibilityFeatureItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const unitId = params.unitId as string;
  const [searchTerm, setSearchTerm] = useState('');
  const isUnitPage = !!unit || unitId === 'new';

  const initialSelected = isUnitPage
    ? unit?.accessibilityFeatures || []
    : listing.accessibilityFeatures || [];
  const initialChargeable = isUnitPage
    ? unit?.chargeableAccessibilityFeatures || []
    : listing.chargeableAccessibilityFeatures || [];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialSelected);
  const [chargeableFeatures, setChargeableFeatures] = useState<string[]>(initialChargeable);

  const featureCategories = [
    'All',
    ...Array.from(new Set(allAccessibilityFeatures.map((a) => a.category))).sort(),
  ];
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredFeatures = allAccessibilityFeatures.filter(
    (feature) =>
      (categoryFilter === 'All' || feature.category === categoryFilter) &&
      feature.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: selectedFeatures.length };
    allAccessibilityFeatures.forEach((feature) => {
      if (selectedFeatures.includes(feature.id)) {
        counts[feature.category] = (counts[feature.category] || 0) + 1;
      }
    });
    return counts;
  }, [selectedFeatures, allAccessibilityFeatures]);

  const handleSave = () => {
    startTransition(async () => {
      let result;
      if (isUnitPage && unit) {
        result = await updateUnitAccessibilityFeaturesAction(
          listing.id,
          unit.id,
          selectedFeatures,
          chargeableFeatures
        );
      } else {
        result = await updateListingAccessibilityFeaturesAction(
          listing.id,
          selectedFeatures,
          chargeableFeatures
        );
      }

      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: `The accessibility features for the ${isUnitPage ? 'unit' : 'property'} have been updated.`,
        });
        // Update local state to match saved state
        if (isUnitPage && unit) {
          unit.accessibilityFeatures = selectedFeatures;
          unit.chargeableAccessibilityFeatures = chargeableFeatures;
        } else {
          listing.accessibilityFeatures = selectedFeatures;
          listing.chargeableAccessibilityFeatures = chargeableFeatures;
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const handleToggleFeature = (featureId: string, checked: boolean) => {
    setSelectedFeatures((prev) =>
      checked ? [...prev, featureId] : prev.filter((id) => id !== featureId)
    );
    if (!checked) {
      setChargeableFeatures((prev) => prev.filter((id) => id !== featureId));
    }
  };

  const handleToggleChargeable = (e: React.MouseEvent, featureId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isSelected = selectedFeatures.includes(featureId);
    if (!isSelected) return;

    setChargeableFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  if (isUnitPage && !unit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Save Required</CardTitle>
          <CardDescription>
            You must first save the unit's basic info before you can configure its accessibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/admin/listings/${listing.id}/edit/units/${unitId}/basic-info`)
            }
          >
            Go to Basic Info
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5 mb-4 sm:mb-0">
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" />
              {isUnitPage ? 'Accessibility Features (Private)' : 'Accessibility Features (Shared)'}
            </CardTitle>
            <CardDescription>
              {isUnitPage
                ? 'Select all accessibility features for this specific unit (e.g., in-room features).'
                : 'Select all accessibility features for the entire property (e.g., lobby, pool area).'}
            </CardDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <AiFillDollarCircle className="h-5 w-5 text-primary" />
              <span>
                = When enabled, this icon indicates that additional fees may be applicable.
              </span>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isPending}>
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
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-auto md:flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full bg-white"
            />
          </div>
          <div className="w-full md:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {featureCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center justify-between w-full">
                      <span>{cat}</span>
                      <Badge variant="secondary" className="ml-4 px-1.5 py-0">
                        {categoryCounts[cat] || 0}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredFeatures.map((feature) => {
            const isSelected = selectedFeatures.includes(feature.id);
            const isChargeable = chargeableFeatures.includes(feature.id);
            return (
              <div
                key={feature.id}
                className={cn(
                  'flex items-start gap-3 p-2 rounded-md border transition-colors',
                  isSelected ? 'bg-accent border-primary/50' : 'bg-transparent border-border'
                )}
              >
                <Checkbox
                  id={feature.id}
                  checked={isSelected}
                  onCheckedChange={(checked) => handleToggleFeature(feature.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={feature.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {feature.label}
                  </label>
                  <p className="text-xs text-muted-foreground">{feature.category}</p>
                </div>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => handleToggleChargeable(e, feature.id)}
                        disabled={!isSelected}
                        className={cn(
                          'h-5 w-5 mt-0.5',
                          isSelected ? 'cursor-pointer' : 'cursor-not-allowed'
                        )}
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
          })}
        </div>
      </CardContent>
    </Card>
  );
}
