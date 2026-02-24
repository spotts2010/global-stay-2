// src/app/account/privacy/terms/page.tsx

import { fetchLegalPage } from '@/lib/firestore.server';
import { LegalPage } from '@/lib/data';
import LegalPageClient from '@/components/LegalPagesClient';

export default async function TermsPage() {
  const pageData = (await fetchLegalPage('terms-and-conditions')) as LegalPage | null;

  return (
    <LegalPageClient
      pageType="terms-and-conditions"
      title="Terms & Conditions"
      initialPageData={pageData}
    />
  );
}
