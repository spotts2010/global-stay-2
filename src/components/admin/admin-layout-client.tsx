// src/components/admin/admin-layout-client.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AdminSidebar } from '@/components/AdminSidebar';
import MobileAdminSheet from '@/components/admin/mobile-admin-sheet';
import SidebarSkeleton from '@/components/admin/sidebar-skeleton';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isEditListingSection = pathname.includes('/admin/listings/') && pathname.includes('/edit');

  if (isEditListingSection) {
    return <>{children}</>;
  }

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
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          {hasMounted && <MobileAdminSheet />}
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
