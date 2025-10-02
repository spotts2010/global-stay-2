// src/app/admin/listings/[id]/edit/units/[unitId]/occupancy-layout/page.tsx
import 'server-only';
import { fetchBedTypes } from '@/lib/firestore.server';
import type { BedType } from '@/lib/data';
import OccupancyLayoutClient from '@/components/OccupancyLayoutClient';

// This is now a SERVER component responsible for data fetching
export default async function OccupancyLayoutPage() {
  const bedTypes: BedType[] = await fetchBedTypes();

  // Sort bed types alphabetically by name before passing to the client
  const sortedBedTypes = bedTypes.sort((a, b) => a.name.localeCompare(b.name));

  return <OccupancyLayoutClient bedTypes={sortedBedTypes} />;
}
