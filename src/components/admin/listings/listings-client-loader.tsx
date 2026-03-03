// src/components/admin/listings/listings-client-loader.tsx
'use client';

import dynamic from 'next/dynamic';
import { BiLoaderAlt } from 'react-icons/bi';

const LoadingSpinner = () => (
  <div className="flex h-64 items-center justify-center">
    <BiLoaderAlt className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ListingsPageClient = dynamic(() => import('@/components/ListingsPageClient'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function ListingsClientLoader({ initialProperties }: { initialProperties: any[] }) {
  return <ListingsPageClient initialProperties={initialProperties} />;
}
