// src/app/admin/settings/site/page.tsx
import { fetchSiteSettings } from '@/lib/firestore.server';
import SiteSettingsClient from '@/components/SiteSettingsClient';
import type { HeroImage } from '@/lib/data';

export default async function SiteSettingsPage() {
  const settings = await fetchSiteSettings();

  // settings?.heroImages is coming back as unknown/loosely typed (from serializeFirestoreData),
  // so we must narrow before assigning to HeroImage[].
  const initialImages: HeroImage[] = Array.isArray((settings as any)?.heroImages)
    ? ((settings as any).heroImages as HeroImage[])
    : [];

  return <SiteSettingsClient initialImages={initialImages} />;
}
