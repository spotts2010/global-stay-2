'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Bed,
  Building2,
  Calendar,
  Home,
  ImageIcon,
  Map,
  Package2,
  PanelLeft,
  PanelRight,
  ShieldQuestion,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useState, useEffect, use } from 'react';
import { fetchAccommodationById } from '@/lib/firestore';

export const menuItems = [
  { label: 'About the Property', href: '/edit/about', icon: Home },
  { label: 'Photo Gallery', href: '/edit/photos', icon: ImageIcon },
  { label: 'Shared Amenities', href: '/edit/amenities', icon: Building2 },
  { label: 'Room Configuration', href: '/edit/rooms', icon: Bed },
  { label: 'Points of Interest', href: '/edit/pois', icon: Map },
  { label: 'Policies & Terms', href: '/edit/policies', icon: ShieldQuestion },
  { label: 'User Access', href: '/edit/users', icon: Users },
  { label: 'Publish Schedule', href: '/edit/schedule', icon: Calendar },
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
  const [listingName, setListingName] = useState('Edit Listing');

  useEffect(() => {
    async function getListingName() {
      const listing = await fetchAccommodationById(listingId);
      if (listing) {
        setListingName(listing.name);
      }
    }
    getListingName();
  }, [listingId]);

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
                href="/admin/listings"
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

        {menuItems.map((item) => (
          <TooltipProvider delayDuration={0} key={item.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/admin/listings/${listingId}${item.href}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm',
                    currentPath.endsWith(item.href) && 'bg-accent text-primary font-semibold',
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
          {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          {!isCollapsed && <span className="text-sm">Collapse</span>}
        </div>
      </div>
    </aside>
  );
}
