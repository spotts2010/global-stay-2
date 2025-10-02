'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { EditListingSidebar } from '@/components/EditListingSidebar';
import MobileEditListingSheet from '@/components/MobileEditListingSheet';
import { Skeleton } from '@/components/ui/skeleton';

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
    </div>
  </aside>
);

export default function EditListingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Check for the "Edit Unit" section and its sub-pages
  const isEditUnitSection = pathname.includes('/edit/units/');

  // If we are in the unit editing section, the layout is handled by its own component
  if (isEditUnitSection) {
    return <>{children}</>;
  }

  const SidebarComponent = hasMounted ? (
    <EditListingSidebar
      params={params}
      currentPath={pathname}
      isCollapsed={isCollapsed}
      toggleSidebar={() => setIsCollapsed(!isCollapsed)}
    />
  ) : (
    <SidebarSkeleton isCollapsed={isCollapsed} />
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {SidebarComponent}
      <div
        className={cn(
          'flex flex-col flex-1 transition-all duration-300',
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          {hasMounted && <MobileEditListingSheet params={params} />}
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-4 md:gap-8">{children}</main>
      </div>
    </div>
  );
}
