// src/components/admin/listings/units/occupancy-layout-client-loader.tsx
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

function OccupancyLayoutSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

const OccupancyLayoutClient = dynamic(() => import('@/components/OccupancyLayoutClient'), {
  ssr: false,
  loading: () => <OccupancyLayoutSkeleton />,
});

export default function OccupancyLayoutClientLoader({
  listingId,
  unit,
  bedTypes,
}: {
  listingId: string;
  unit: any;
  bedTypes: any[];
}) {
  return <OccupancyLayoutClient listingId={listingId} unit={unit} bedTypes={bedTypes} />;
}
