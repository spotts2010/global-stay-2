// src/app/admin/listings/[id]/edit/units/[unitId]/layout.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { EditUnitSidebar } from '@/components/EditUnitSidebar';
import MobileEditUnitSheet from '@/components/MobileEditUnitSheet';
import { useParams } from 'next/navigation';

export default function EditUnitLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // In a Client Component layout, useParams is the correct way to read dynamic segments.
  // Do NOT type props.params here (Next 15 expects Promise params for server layouts/pages).
  const params = useParams<{ id: string; unitId: string }>();

  const unitName = params.unitId === 'new' ? 'New Unit' : `Edit Unit`;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <EditUnitSidebar
        listingId={params.id}
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
          <MobileEditUnitSheet params={params} />
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-4 md:gap-8">{children}</main>
      </div>
    </div>
  );
}
