// src/app/admin/listings/page.tsx
import { fetchAccommodations } from '@/lib/firestore';
import type { Accommodation } from '@/lib/data';
import ListingsClient from '@/components/ListingsClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Helper to check if a value is a Firestore-like Timestamp
function isTimestamp(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  );
}

// This is now a SERVER component responsible for data fetching
export default async function AdminListingsPage() {
  const properties: Accommodation[] = await fetchAccommodations();

  // Create a serializable version of the properties to pass to the client
  const serializableProperties = properties.map((p) => ({
    ...p,
    lastModified: isTimestamp(p.lastModified)
      ? p.lastModified.toDate().toISOString()
      : new Date().toISOString(), // Fallback to current date if invalid
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Listings</CardTitle>
        <CardDescription>View, edit, or change status of accommodation listings.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Pass the fetched & serialized data to the client component */}
        <ListingsClient initialProperties={serializableProperties as unknown as Accommodation[]} />
      </CardContent>
    </Card>
  );
}
