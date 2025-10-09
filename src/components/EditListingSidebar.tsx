// src/components/EditListingSidebar.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ListChecks,
  CalendarDays,
  ImageIcon,
  Package2,
  MdOutlinePrivacyTip,
  Users,
  Hotel,
  SquarePen,
  BedDouble,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
  HiOutlineLocationMarker,
  Accessibility,
} from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useState, useEffect, use } from 'react';
import { fetchAccommodationById } from '@/lib/firestore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const menuItems = [
  {
    label: 'Property Setup',
    icon: Hotel,
    children: [
      { label: 'About the Property', href: '/edit/about', icon: SquarePen },
      { label: 'Photo Gallery', href: '/edit/photos', icon: ImageIcon },
      { label: 'Shared Amenities', href: '/edit/amenities', icon: ListChecks },
      { label: 'Accessibility', href: '/edit/accessibility-features', icon: Accessibility },
      { label: 'Points of Interest', href: '/edit/pois', icon: HiOutlineLocationMarker },
      { label: 'Property Policies', href: '/edit/property-policies', icon: MdOutlinePrivacyTip },
    ],
  },
  { label: 'Unit Setup', href: '/edit/units', icon: BedDouble },
  { label: 'User Access', href: '/edit/users', icon: Users },
  { label: 'Publish Schedule', href: '/edit/schedule', icon: CalendarDays },
];

export function EditListingSidebar({
  params,
  currentPath,
  isCollapsed,
  toggleSidebar,
}: {
  params: { id: string };
  currentPath: string;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  const { id: listingId } = use(params);
  const searchParams = useSearchParams();
  const [listingName, setListingName] = useState('Edit Listing');

  useEffect(() => {
    async function getListingName() {
      if (listingId) {
        const listing = await fetchAccommodationById(listingId);
        if (listing) {
          setListingName(listing.name);
        }
      }
    }
    getListingName();
  }, [listingId]);

  const activeParent = menuItems.find(
    (item) =>
      item.children && item.children.some((child) => currentPath.endsWith(child.href || '---'))
  );
  const defaultActiveAccordion = activeParent ? [activeParent.label] : [];

  const backLink = `/admin/listings?${searchParams.toString()}`;

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 sm:flex',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6 text-primary" />
          {!isCollapsed && <span className="font-bold text-sm truncate">{listingName}</span>}
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={backLink}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm',
                  isCollapsed && 'justify-center'
                )}
              >
                <ArrowLeft className="h-5 w-5" />
                {!isCollapsed && <span>Back to Listings</span>}
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Back to Listings</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <Accordion type="multiple" defaultValue={defaultActiveAccordion} className="space-y-2">
          {menuItems.map((item) =>
            item.children ? (
              <AccordionItem key={item.label} value={item.label} className="border-b-0">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AccordionTrigger
                        className={cn(
                          'flex w-full items-center rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm relative hover:no-underline [&>svg]:ml-auto',
                          isCollapsed && 'justify-center [&>svg]:hidden',
                          item.children.some((child) => currentPath.endsWith(child.href)) &&
                            'bg-accent text-primary'
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <span className="ml-3 flex-1 text-left truncate">{item.label}</span>
                        )}
                      </AccordionTrigger>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {!isCollapsed && (
                  <AccordionContent className="ml-4 mt-2 flex flex-col gap-1 border-l pl-4 pb-0">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={`/admin/listings/${listingId}${child.href}?${searchParams.toString()}`}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-xs',
                          currentPath.endsWith(child.href || '---') &&
                            'bg-accent text-primary font-semibold'
                        )}
                      >
                        {child.icon && <child.icon className="h-4 w-4" />}
                        <span className="truncate">{child.label}</span>
                      </Link>
                    ))}
                  </AccordionContent>
                )}
              </AccordionItem>
            ) : (
              <TooltipProvider delayDuration={0} key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/admin/listings/${listingId}${item.href}?${searchParams.toString()}`}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm',
                        currentPath.endsWith(item.href || '---') &&
                          'bg-accent text-primary font-semibold',
                        isCollapsed && 'justify-center'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )
          )}
        </Accordion>
      </nav>
      <div className="mt-auto p-4">
        <div
          onClick={toggleSidebar}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
        >
          {isCollapsed ? (
            <TbLayoutSidebarRightCollapse className="h-5 w-5" />
          ) : (
            <TbLayoutSidebarLeftCollapse className="h-5 w-5" />
          )}
          {!isCollapsed && <span className="text-sm">Collapse</span>}
        </div>
      </div>
    </aside>
  );
}
