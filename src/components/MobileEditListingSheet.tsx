// src/components/MobileEditListingSheet.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { PanelLeft, Package2, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { fetchAccommodationById } from '@/lib/firestore';
import { menuItems } from '@/components/EditListingSidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function MobileEditListingSheet({ params }: { params: { id: string } }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { id: listingId } = use(params);
  const [isOpen, setIsOpen] = useState(false);
  const [_listingName, setListingName] = useState('Edit Listing');
  const [activeAccordion, setActiveAccordion] = useState<string[]>([]);

  useEffect(() => {
    async function getListingName() {
      const listing = await fetchAccommodationById(listingId);
      if (listing) {
        setListingName(listing.name);
      }
    }
    getListingName();
  }, [listingId]);

  useEffect(() => {
    const activeParent = menuItems.find(
      (item) =>
        item.children && item.children.some((child) => pathname.endsWith(child.href || '---'))
    );
    if (activeParent) {
      setActiveAccordion([activeParent.label]);
    }
  }, [pathname]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const backLink = `/admin/listings?${searchParams.toString()}`;

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

          <Link
            href={backLink}
            className="flex items-center gap-4 py-2 text-base font-semibold text-muted-foreground hover:text-foreground"
            onClick={handleLinkClick}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Listings</span>
          </Link>

          <Accordion
            type="multiple"
            value={activeAccordion}
            onValueChange={setActiveAccordion}
            className="w-full space-y-2"
          >
            {menuItems.map((item) =>
              item.children ? (
                <AccordionItem key={item.label} value={item.label} className="border-b-0">
                  <AccordionTrigger
                    className={cn(
                      'flex w-full items-center justify-between py-2 text-base font-semibold text-muted-foreground hover:text-foreground hover:no-underline [&>svg]:ml-auto'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-8">
                    <div className="flex flex-col gap-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={`/admin/listings/${listingId}${child.href}?${searchParams.toString()}`}
                          className={cn(
                            'flex items-center gap-4 py-2 text-sm text-muted-foreground hover:text-foreground',
                            pathname.endsWith(child.href || '---') &&
                              'text-foreground font-semibold'
                          )}
                          onClick={handleLinkClick}
                        >
                          {child.icon && <child.icon className="h-4 w-4" />}
                          <span className="truncate">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <Link
                  key={item.label}
                  href={`/admin/listings/${listingId}${item.href}?${searchParams.toString()}`}
                  className={cn(
                    'flex items-center gap-4 py-2 text-base font-semibold text-muted-foreground hover:text-foreground',
                    pathname.endsWith(item.href || '---') && 'text-foreground'
                  )}
                  onClick={handleLinkClick}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span className="flex-1 text-left truncate">{item.label}</span>
                </Link>
              )
            )}
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
