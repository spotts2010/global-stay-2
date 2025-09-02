'use client';

import { useSearchParams } from 'next/navigation';

export default function TestSearchParams() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'none';

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      Current query param: <strong>{query}</strong>
    </div>
  );
}
