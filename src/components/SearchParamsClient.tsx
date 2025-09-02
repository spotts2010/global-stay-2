'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchParamsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'none';

  return (
    <div className="p-4 bg-muted rounded-md text-sm">
      Current query param: <strong>{query}</strong>
    </div>
  );
}
