// src/app/page.tsx
import 'server-only';
import { fetchAccommodations, fetchSiteSettings } from '@/lib/firestore.server';
import type { Accommodation, HeroImage } from '@/lib/data';
import HomeContent from '@/components/HomeContent';

// This is now a SERVER component responsible for data fetching.
export default async function Home() {
  // Data is already serialized by the fetching function
  const accommodations: Accommodation[] = await fetchAccommodations();
  const siteSettings = await fetchSiteSettings();
  const heroImages: HeroImage[] = siteSettings?.heroImages || [];

  return <HomeContent initialAccommodations={accommodations} heroImages={heroImages} />;
}
