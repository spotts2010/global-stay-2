// src/app/admin/settings/legal/page.tsx
import 'server-only';
import { fetchLegalPage } from '@/lib/firestore.server';
import LegalAdminClient from '@/components/LegalAdminClient';

export default async function LegalSettingsPage() {
  const termsData = await fetchLegalPage('terms-and-conditions');
  const privacyData = await fetchLegalPage('privacy-policy');

  return <LegalAdminClient initialTermsData={termsData} initialPrivacyData={privacyData} />;
}
