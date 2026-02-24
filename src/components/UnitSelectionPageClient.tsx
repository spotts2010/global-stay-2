// src/components/UnitSelectionPageClient.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { differenceInDays, parseISO } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';
import { Accessibility, Check, Users, ChevronDown, ChevronUp } from '@/lib/icons';
import type { Accommodation, Currency } from '@/lib/data';
import { BookableUnit } from './UnitsPageClient';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import PhotoGallery from './PhotoGallery';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Collapsible, CollapsibleContent } from './ui/collapsible';

const calculateMaxOccupancy = (unit: BookableUnit): number => {
  if (!unit.bedConfigs || unit.bedConfigs.length === 0) {
    return unit.maxOccupancy || 0;
  }
  return unit.bedConfigs.reduce((total, config) => total + config.sleeps * config.count, 0);
};

// ========================
// UnitRow Component
// ========================
interface UnitRowProps {
  unit: BookableUnit;
  nights: number;
  inclusions: string[];
  accessibilityItems: string[];
  currency: Currency;
  onOpenGallery: (images: string[]) => void;
}

const UnitRow: React.FC<UnitRowProps> = React.memo(
  ({ unit, nights, inclusions, accessibilityItems, currency, onOpenGallery }) => {
    const { preferences } = useUserPreferences();
    const [isOpen, setIsOpen] = useState(false);

    const convertedPrice = convertCurrency(unit.price || 0, currency, preferences.currency);
    const formattedPrice = formatCurrency(convertedPrice, preferences.currency);
    const totalPrice = nights > 0 ? convertedPrice * nights : convertedPrice;
    const formattedTotalPrice = formatCurrency(totalPrice, preferences.currency);

    const unitImages =
      unit.images && unit.images.length > 0
        ? unit.images
        : ['https://placehold.co/600x400/f1f5f9/f1f5f9?text=%20'];

    return (
      <React.Fragment key={unit.id}>
        <TableRow onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer border-b">
          <TableCell className="w-[120px]">
            <div
              className="relative aspect-video w-full rounded-md overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                onOpenGallery(unitImages);
              }}
              onKeyDown={(e) => e.key === 'Enter' && onOpenGallery(unitImages)}
              role="button"
              tabIndex={0}
              aria-label={`View photos for ${unit.name}`}
            >
              <Image
                src={unitImages[0]}
                alt={unit.name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
          </TableCell>
          <TableCell>
            <p className="font-medium text-foreground">{unit.name}</p>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{unit.description}</p>
            <div className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2">
              {isOpen ? 'Hide Details' : 'View Details'}
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
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
        <Collapsible asChild open={isOpen}>
          <TableRow>
            <CollapsibleContent asChild>
              <TableCell colSpan={5} className="p-0 bg-accent">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {inclusions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">What's Included</h4>
                      <ul className="grid grid-cols-2 gap-2 text-sm">
                        {inclusions.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {accessibilityItems.length > 0 && (
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
              </TableCell>
            </CollapsibleContent>
          </TableRow>
        </Collapsible>
      </React.Fragment>
    );
  }
);
UnitRow.displayName = 'UnitRow';

// ========================
// Main Page Component
// ========================
interface UnitSelectionPageClientProps {
  accommodation: Accommodation;
  units: BookableUnit[];
  allInclusions: { id: string; label: string; category: string }[];
  allAccessibilityFeatures: { id: string; label: string; category: string }[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function UnitSelectionPageClient({
  accommodation,
  units,
  allInclusions,
  allAccessibilityFeatures,
  searchParams,
}: UnitSelectionPageClientProps) {
  const publishedUnits = units.filter((unit) => unit.status === 'Published');
  const from = searchParams?.from as string;
  const to = searchParams?.to as string;

  const nights = useMemo(() => {
    if (from && to) return differenceInDays(parseISO(to), parseISO(from));
    return 0;
  }, [from, to]);

  const inclusionMap = useMemo(
    () => new Map(allInclusions.map((inc) => [inc.id, inc])),
    [allInclusions]
  );

  const accessibilityMap = useMemo(
    () => new Map(allAccessibilityFeatures.map((feat) => [feat.id, feat])),
    [allAccessibilityFeatures]
  );

  // Precompute labels for units
  const unitData = useMemo(
    () =>
      publishedUnits.map((unit) => ({
        unit,
        inclusions: unit.inclusions?.map((id) => inclusionMap.get(id)?.label).filter(Boolean) || [],
        accessibility:
          unit.accessibilityFeatures
            ?.map((id) => accessibilityMap.get(id)?.label)
            .filter(Boolean) || [],
      })),
    [publishedUnits, inclusionMap, accessibilityMap]
  );

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null);
  const openGallery = (images: string[]) => setGalleryImages(images);
  const closeGallery = () => setGalleryImages(null);

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 pb-16">
      {/* Breadcrumb */}
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

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{accommodation.name}</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Select from the available rooms, beds, or units below to proceed with your booking.
        </p>
      </div>

      {/* Units Table */}
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
          <TableBody>
            {unitData.length > 0 ? (
              unitData.map(({ unit, inclusions, accessibility }) => (
                <UnitRow
                  key={unit.id}
                  unit={unit}
                  nights={nights}
                  inclusions={(inclusions ?? []).filter((v): v is string => typeof v === 'string')}
                  accessibilityItems={(accessibility ?? []).filter(
                    (v): v is string => typeof v === 'string'
                  )}
                  currency={accommodation.currency}
                  onOpenGallery={openGallery}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No rooms are available for this property at the moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Gallery Modal */}
      {galleryImages && <PhotoGallery images={galleryImages} onClose={closeGallery} />}
    </div>
  );
}
