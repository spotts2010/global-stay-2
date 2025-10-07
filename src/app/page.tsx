// src/app/page.tsx
import 'server-only';
import { fetchAccommodations } from '@/lib/firestore.server';
import type { Accommodation } from '@/lib/data';
import HomeContent from '@/components/HomeContent';

// This is now a SERVER component responsible for data fetching.
export default async function Home() {
  // Data is already serialized by the fetching function
  const accommodations: Accommodation[] = await fetchAccommodations();

  return <HomeContent initialAccommodations={accommodations} />;
}
