// src/components/MobileEditListingSheet.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, Package2, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { fetchAccommodationById } from '@/lib/firestore';
import { menuItems } from '@/components/EditListingSidebar';

export default function MobileEditListingSheet({ params }: { params: { id: string } }) {
  const pathname = usePathname();
  const { id: listingId } = use(params);
  const [isOpen, setIsOpen] = useState(false);
  const [_listingName, setListingName] = useState('Edit Listing');

  useEffect(() => {
    async function getListingName() {
      const listing = await fetchAccommodationById(listingId);
      if (listing) {
        setListingName(listing.name);
      }
    }
    getListingName();
  }, [listingId]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            onClick={handleLinkClick}
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Global Stay</span>
          </Link>
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/listings"
              className="flex items-center gap-4 py-2 text-base font-semibold text-muted-foreground hover:text-foreground"
              onClick={handleLinkClick}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Listings</span>
            </Link>
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={`/admin/listings/${listingId}${item.href}`}
                className={cn(
                  'flex items-center gap-4 py-2 text-base font-semibold text-muted-foreground hover:text-foreground',
                  pathname.endsWith(item.href || '---') && 'text-foreground'
                )}
                onClick={handleLinkClick}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
