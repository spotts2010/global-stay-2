// src/components/admin/listings/units/basic-info-client-loader.tsx
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

function BasicInfoSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

const BasicInfoClient = dynamic(() => import('@/components/BasicInfoClient'), {
  ssr: false,
  loading: () => <BasicInfoSkeleton />,
});

export default function BasicInfoClientLoader({ listing, unit }: { listing: any; unit: any }) {
  return <BasicInfoClient listing={listing} unit={unit} />;
}
