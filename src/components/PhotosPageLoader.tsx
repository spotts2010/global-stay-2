'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { Accommodation } from '@/lib/data';

const PhotosPageClient = dynamic(() => import('@/components/PhotosPageClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

export default function PhotosPageLoader({ listing }: { listing: Accommodation }) {
  return <PhotosPageClient listing={listing} />;
}
