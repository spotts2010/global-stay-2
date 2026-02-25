// src/components/admin/sidebar-skeleton.tsx

'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function SidebarSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
  return (
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
}
