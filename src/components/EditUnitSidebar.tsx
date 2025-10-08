'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Bed,
  ListChecks,
  ImageIcon,
  Shield,
  SquarePen,
  Users,
  DollarSign,
  Accessibility,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';

const menuItems = [
  { label: 'Basic Info', href: '/basic-info', icon: SquarePen },
  { label: 'Occupancy & Layout', href: '/occupancy-layout', icon: Users },
  { label: 'Pricing', href: '/pricing', icon: DollarSign },
  { label: 'Inclusions', href: '/inclusions', icon: ListChecks },
  { label: 'Photos', href: '/photos', icon: ImageIcon },
  { label: 'Accessibility', href: '/accessibility-features', icon: Accessibility },
  { label: 'Unit Policies', href: '/unit-policies', icon: Shield },
];

export function EditUnitSidebar({
  listingId,
  unitName,
  isCollapsed,
  toggleSidebar,
}: {
  listingId: string;
  unitName: string;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const unitId = params.unitId as string;

  const backLink = `/admin/listings/${listingId}/edit/units?${searchParams.toString()}`;

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 sm:flex',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link href="#" className="flex items-center gap-2 font-semibold">
          <Bed className="h-6 w-6 text-primary" />
          {!isCollapsed && <span className="font-bold text-sm truncate">{unitName}</span>}
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
                {!isCollapsed && <span>Back to Units</span>}
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Back to Units</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {menuItems.map((item) => (
          <TooltipProvider delayDuration={0} key={item.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/admin/listings/${listingId}/edit/units/${unitId}${item.href}?${searchParams.toString()}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm',
                    pathname.endsWith(item.href) && 'bg-accent text-primary font-semibold',
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
        ))}
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
