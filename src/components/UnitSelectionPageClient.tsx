// src/components/UnitSelectionPageClient.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from './ui/button';
import { BookableUnit } from './UnitsPageClient';
import type { Accommodation, Currency } from '@/lib/data';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { Accessibility, Check, Users } from '@/lib/icons';
import Link from 'next/link';
import Image from 'next/image';
import { differenceInDays, parseISO } from 'date-fns';
import { useState, useMemo } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

const calculateMaxOccupancy = (unit: BookableUnit): number => {
  if (!unit.bedConfigs || unit.bedConfigs.length === 0) {
    return unit.maxOccupancy || 0;
  }
  return unit.bedConfigs.reduce((total, config) => total + config.sleeps * config.count, 0);
};

const UnitRow = ({
  unit,
  currency,
  nights,
  allInclusions,
  allAccessibilityFeatures,
}: {
  unit: BookableUnit;
  currency: Currency;
  nights: number;
  allInclusions: Map<string, { label: string; category: string }>;
  allAccessibilityFeatures: Map<string, { label: string; category: string }>;
}) => {
  const { preferences } = useUserPreferences();
  const [isOpen, setIsOpen] = useState(false);

  const convertedPrice = convertCurrency(unit.price || 0, currency, preferences.currency);
  const formattedPrice = formatCurrency(convertedPrice, preferences.currency);
  const totalPrice = nights > 0 ? convertedPrice * nights : convertedPrice;
  const formattedTotalPrice = formatCurrency(totalPrice, preferences.currency);

  const inclusions = unit.inclusions?.map((id) => allInclusions.get(id)?.label).filter(Boolean);
  const accessibilityItems = unit.accessibilityFeatures
    ?.map((id) => allAccessibilityFeatures.get(id)?.label)
    .filter(Boolean);

  return (
    <Collapsible asChild key={unit.id} open={isOpen} onOpenChange={setIsOpen}>
      <TableBody>
        <TableRow className={cn(isOpen && 'bg-accent')}>
          <TableCell className="w-[120px]">
            <div className="relative aspect-video w-full rounded-md overflow-hidden">
              <Image
                src={unit.images?.[0] || 'https://placehold.co/600x400/f1f5f9/f1f5f9?text=%20'}
                alt={unit.name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
          </TableCell>
          <TableCell>
            <CollapsibleTrigger asChild>
              <button className="font-medium text-primary hover:underline text-left">
                {unit.name}
              </button>
            </CollapsibleTrigger>
            <p className="text-sm text-muted-foreground line-clamp-2">{unit.description}</p>
          </TableCell>
          <TableCell className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{calculateMaxOccupancy(unit)}</span>
            </div>
          </TableCell>
          <TableCell>
            {nights > 0 ? (
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg">{formattedTotalPrice}</span>
                <span className="text-xs text-muted-foreground">{formattedPrice}/night</span>
              </div>
            ) : (
              <span className="font-semibold">{formattedPrice}/night</span>
            )}
          </TableCell>
          <TableCell>
            <Button className="w-full">Book Now</Button>
          </TableCell>
        </TableRow>
        <CollapsibleContent asChild>
          <tr className="bg-accent">
            <td colSpan={5} className="p-0">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {inclusions && inclusions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">What's Included</h4>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {inclusions.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {accessibilityItems && accessibilityItems.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Accessibility className="h-4 w-4" />
                      Accessibility
                    </h4>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {accessibilityItems.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Separator />
            </td>
          </tr>
        </CollapsibleContent>
      </TableBody>
    </Collapsible>
  );
};

export default function UnitSelectionPageClient({
  accommodation,
  units,
  allInclusions,
  allAccessibilityFeatures,
  searchParams,
}: {
  accommodation: Accommodation;
  units: BookableUnit[];
  allInclusions: { id: string; label: string; category: string }[];
  allAccessibilityFeatures: { id: string; label: string; category: string }[];
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const publishedUnits = units.filter((unit) => unit.status === 'Published');
  const from = searchParams?.from as string;
  const to = searchParams?.to as string;

  const nights = useMemo(() => {
    if (from && to) {
      return differenceInDays(parseISO(to), parseISO(from));
    }
    return 0;
  }, [from, to]);

  const inclusionMap = new Map(allInclusions.map((inc) => [inc.id, inc]));
  const accessibilityMap = new Map(allAccessibilityFeatures.map((feat) => [feat.id, feat]));

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 pb-16">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/accommodation/${accommodation.id}`}>{accommodation.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Available Units</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{accommodation.name}</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Select from the available rooms, beds, or units below to proceed with your booking.
        </p>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Image</TableHead>
              <TableHead>Unit / Room</TableHead>
              <TableHead className="text-center w-[100px]">Guests</TableHead>
              <TableHead className="w-[180px]">Price</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <>
            {publishedUnits.length > 0 ? (
              publishedUnits.map((unit) => (
                <UnitRow
                  key={unit.id}
                  unit={unit}
                  currency={accommodation.currency}
                  nights={nights}
                  allInclusions={inclusionMap}
                  allAccessibilityFeatures={accessibilityMap}
                />
              ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No rooms are available for this property at the moment.
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </>
        </Table>
      </div>
    </div>
  );
}
