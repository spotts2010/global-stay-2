// src/app/admin/settings/site/page.tsx
import { fetchSiteSettings } from '@/lib/firestore.server';
import SiteSettingsClient from '@/components/SiteSettingsClient';
import type { HeroImage } from '@/lib/data';

export default async function SiteSettingsPage() {
  const settings = await fetchSiteSettings();
  const initialImages: HeroImage[] = settings?.heroImages || [];

  return <SiteSettingsClient initialImages={initialImages} />;
}
