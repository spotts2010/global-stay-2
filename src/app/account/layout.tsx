'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, Package2 } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AccountSidebar, { menuItems } from '@/components/AccountSidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

function MobileAccountSheet() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Global Stay</span>
          </Link>
          <Accordion type="multiple" className="w-full">
            {menuItems.map((item) => (
              <AccordionItem key={item.label} value={item.label} className="border-b-0">
                {item.children ? (
                  <>
                    <AccordionTrigger className="py-2 text-base font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
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
                      </div>
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
                    <span className="flex-1 text-left truncate">{item.label}</span>
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

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AccountSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />
      <div
        className={`flex flex-col sm:py-4 transition-all duration-300 ${isCollapsed ? 'sm:pl-20' : 'sm:pl-64'}`}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <MobileAccountSheet />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
