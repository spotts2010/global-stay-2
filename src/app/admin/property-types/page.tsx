// src/app/admin/property-types/page.tsx
import 'server-only';
import { fetchPropertyTypes } from '@/lib/firestore.server';
import PropertyTypesClient from '@/components/PropertyTypesClient';
import type { PropertyType } from '@/lib/data';

// This is now a SERVER component responsible for data fetching
export default async function PropertyTypesPage() {
  const initialPropertyTypes: PropertyType[] = await fetchPropertyTypes();

  return (
    <div className="flex-1 space-y-6">
      <PropertyTypesClient initialPropertyTypes={initialPropertyTypes} />
    </div>
  );
}
