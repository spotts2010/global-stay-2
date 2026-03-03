// src/components/admin/listings/units/pricing-client-loader.tsx
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

function PricingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

const PricingPageClient = dynamic(() => import('@/components/PricingPageClient'), {
  ssr: false,
  loading: () => <PricingSkeleton />,
});

export default function PricingClientLoader({ listing, unit }: { listing: any; unit: any }) {
  return <PricingPageClient listing={listing} unit={unit} />;
}
