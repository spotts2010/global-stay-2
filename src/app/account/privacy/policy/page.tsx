// src/app/account/privacy/policy/page.tsx

import { fetchLegalPage } from '@/lib/firestore.server';
import { LegalPage } from '@/lib/data';
import LegalPageClient from '@/components/LegalPagesClient';

export default async function PrivacyPolicyPage() {
  const pageData = (await fetchLegalPage('privacy-policy')) as LegalPage | null;

  return (
    <LegalPageClient pageType="privacy-policy" title="Privacy Policy" initialPageData={pageData} />
  );
}
