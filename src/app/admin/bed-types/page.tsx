// src/app/admin/bed-types/page.tsx
import { fetchBedTypes } from '@/lib/firestore.server'; // Use server-specific fetch
import BedTypesClient from '@/components/BedTypesClient';
import type { BedType } from '@/lib/data';

// This is now a SERVER component responsible for data fetching
export default async function BedTypesPage() {
  const initialBedTypes: BedType[] = await fetchBedTypes();

  return (
    <div className="flex-1 space-y-6">
      <BedTypesClient initialBedTypes={initialBedTypes} />
    </div>
  );
}
