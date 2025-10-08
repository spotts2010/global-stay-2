'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { PanelLeft, ArrowLeft, Bed } from '@/lib/icons';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { menuItems } from '@/components/EditUnitSidebar';

export default function MobileEditUnitSheet({
  params,
}: {
  params: { id: string; unitId: string };
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { id: listingId, unitId } = params;
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const backLink = `/admin/listings/${listingId}/edit/units?${searchParams.toString()}`;
  const unitName = unitId === 'new' ? 'New Unit' : 'Edit Unit';

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
          <div className="flex items-center gap-2 font-semibold">
            <Bed className="h-6 w-6 text-primary" />
            <span className="font-bold text-base truncate">{unitName}</span>
          </div>

          <Link
            href={backLink}
            className="flex items-center gap-4 py-2 text-base font-semibold text-muted-foreground hover:text-foreground"
            onClick={handleLinkClick}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Units</span>
          </Link>

          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={`/admin/listings/${listingId}/edit/units/${unitId}${item.href}?${searchParams.toString()}`}
                className={cn(
                  'flex items-center gap-4 py-2 text-base font-semibold text-muted-foreground hover:text-foreground',
                  pathname.endsWith(item.href) && 'text-foreground'
                )}
                onClick={handleLinkClick}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span className="flex-1 text-left truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
