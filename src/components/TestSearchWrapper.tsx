'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import TestSearchParams client component
const TestSearchParams = dynamic(
  () => import('@/components/TestSearchParams'),
  { ssr: false } // safe because this is a client component
);

export default function TestSearchWrapper() {
  return (
    <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
      <TestSearchParams />
    </Suspense>
  );
}
