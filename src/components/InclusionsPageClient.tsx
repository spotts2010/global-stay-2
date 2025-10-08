'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  Save,
  Search,
  ListChecks,
  AiOutlineDollarCircle,
  AiFillDollarCircle,
} from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { updateUnitInclusionsAction } from '@/app/actions';
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

type InclusionItem = {
  id: string; // systemTag
  label: string;
  category: string;
};

export default function InclusionsPageClient({
  listingId,
  unit,
  allPrivateInclusions,
}: {
  listingId: string;
  unit?: BookableUnit;
  allPrivateInclusions: InclusionItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedInclusions, setSelectedInclusions] = useState<string[]>(unit?.inclusions || []);
  const [chargeableInclusions, setChargeableInclusions] = useState<string[]>(
    unit?.chargeableInclusions || []
  );

  const inclusionCategories = [
    'All',
    ...Array.from(new Set(allPrivateInclusions.map((a) => a.category))).sort(),
  ];
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredInclusions = allPrivateInclusions.filter(
    (inclusion) =>
      (categoryFilter === 'All' || inclusion.category === categoryFilter) &&
      inclusion.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: selectedInclusions.length };
    allPrivateInclusions.forEach((inclusion) => {
      if (selectedInclusions.includes(inclusion.id)) {
        counts[inclusion.category] = (counts[inclusion.category] || 0) + 1;
      }
    });
    return counts;
  }, [selectedInclusions, allPrivateInclusions]);

  const handleSave = () => {
    if (!unit) return;
    startTransition(async () => {
      const result = await updateUnitInclusionsAction(
        listingId,
        unit.id,
        selectedInclusions,
        chargeableInclusions
      );
      if (result.success) {
        toast({
          title: 'Changes Saved',
          description: 'The unit inclusions have been updated.',
        });
        if (unit) {
          unit.inclusions = selectedInclusions;
          unit.chargeableInclusions = chargeableInclusions;
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

  const handleToggleInclusion = (inclusionId: string, checked: boolean) => {
    setSelectedInclusions((prev) =>
      checked ? [...prev, inclusionId] : prev.filter((id) => id !== inclusionId)
    );
    if (!checked) {
      setChargeableInclusions((prev) => prev.filter((id) => id !== inclusionId));
    }
  };

  const handleToggleChargeable = (e: React.MouseEvent, inclusionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isSelected = selectedInclusions.includes(inclusionId);
    if (!isSelected) return;

    setChargeableInclusions((prev) =>
      prev.includes(inclusionId) ? prev.filter((id) => id !== inclusionId) : [...prev, inclusionId]
    );
  };

  if (!unit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The specified unit could not be found for this listing.</p>
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
              <ListChecks className="h-5 w-5 text-primary" />
              Private Inclusions
            </CardTitle>
            <CardDescription>
              Select all features available inside this specific unit and specify if fees apply.
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
                {inclusionCategories.map((cat) => (
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
          {filteredInclusions.map((inclusion) => {
            const isSelected = selectedInclusions.includes(inclusion.id);
            const isChargeable = chargeableInclusions.includes(inclusion.id);
            return (
              <div
                key={inclusion.id}
                className={cn(
                  'flex items-start gap-3 p-2 rounded-md border transition-colors',
                  isSelected ? 'bg-accent border-primary/50' : 'bg-transparent border-border'
                )}
              >
                <Checkbox
                  id={inclusion.id}
                  checked={isSelected}
                  onCheckedChange={(checked) => handleToggleInclusion(inclusion.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={inclusion.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {inclusion.label}
                  </label>
                  <p className="text-xs text-muted-foreground">{inclusion.category}</p>
                </div>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => handleToggleChargeable(e, inclusion.id)}
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
