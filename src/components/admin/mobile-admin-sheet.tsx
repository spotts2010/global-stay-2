// src/components/admin/mobile-admin-sheet.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { PanelLeft, Package2 } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { menuItems } from '@/components/AdminSidebar';

export default function MobileAdminSheet() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => setIsOpen(false);

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
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
          </Link>

          <Accordion type="multiple" className="w-full">
            {menuItems.map((item) => (
              <AccordionItem key={item.label} value={item.label} className="border-b-0">
                {item.children ? (
                  <>
                    <AccordionTrigger className="py-2 text-base font-semibold">
                      <div className="flex items-center gap-4">
                        {item.icon && <item.icon className="h-5 w-5" />}
                        <span className="truncate">{item.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href || '#'}
                          className={cn(
                            'flex items-center gap-4 py-2 text-sm text-muted-foreground hover:text-foreground',
                            pathname === child.href && 'text-foreground font-semibold'
                          )}
                          onClick={handleLinkClick}
                        >
                          {child.icon && <child.icon className="h-4 w-4" />}
                          <span className="truncate">{child.label}</span>
                        </Link>
                      ))}
                    </AccordionContent>
                  </>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className={cn(
                      'flex items-center gap-4 py-2 text-base font-semibold text-muted-foreground hover:text-foreground',
                      pathname === item.href && 'text-foreground'
                    )}
                    onClick={handleLinkClick}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
