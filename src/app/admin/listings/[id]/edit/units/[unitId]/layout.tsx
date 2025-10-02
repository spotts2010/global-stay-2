'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { EditUnitSidebar } from '@/components/EditUnitSidebar';
// import MobileEditUnitSheet from '@/components/MobileEditUnitSheet'; // To be created

export default function EditUnitLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string; unitId: string };
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const resolvedParams = React.use(params);

  const unitName =
    resolvedParams.unitId === 'new' ? 'New Unit' : `Edit Unit ${resolvedParams.unitId}`;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <EditUnitSidebar
        listingId={resolvedParams.id}
        unitName={unitName}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />
      <div
        className={cn(
          'flex flex-col flex-1 transition-all duration-300',
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          {/* <MobileEditUnitSheet params={params} /> */}
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-4 md:gap-8">{children}</main>
      </div>
    </div>
  );
}
