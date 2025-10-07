'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, Package2 } from '@/lib/icons';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { AdminSidebar } from '@/components/AdminSidebar';
import { menuItems } from '@/components/AdminSidebar';
import { Skeleton } from '@/components/ui/skeleton';

function MobileAdminSheet() {
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

const SidebarSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <aside
    className={cn(
      'fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex',
      isCollapsed ? 'w-20' : 'w-64'
    )}
  >
    <div className="flex h-16 items-center border-b px-6">
      <Skeleton className="h-8 w-8 rounded-full" />
      {!isCollapsed && <Skeleton className="ml-2 h-6 w-24" />}
    </div>
    <div className="flex flex-col gap-2 p-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </aside>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Check for the "Edit Listing" section and its sub-pages (e.g., rooms)
  const isEditListingSection = pathname.includes('/admin/listings/') && pathname.includes('/edit');

  if (isEditListingSection) {
    return <>{children}</>;
  }

  // This is the key change: we avoid rendering the interactive sidebar on the server.
  // We show a skeleton during server render and initial client render, then the
  // real sidebar once `hasMounted` is true. This prevents hydration mismatch.
  const SidebarComponent = hasMounted ? (
    <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
  ) : (
    <SidebarSkeleton isCollapsed={isCollapsed} />
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {SidebarComponent}
      <div
        className={cn(
          'flex flex-col sm:py-4 transition-all duration-300',
          isCollapsed ? 'sm:pl-20' : 'sm:pl-64'
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          {hasMounted && <MobileAdminSheet />}
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
