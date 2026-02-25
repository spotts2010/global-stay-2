// src/app/admin/settings/legal/page.tsx

'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { LegalPage } from '@/lib/data';

const LegalAdminClientLazy = dynamic(() => import('@/components/LegalAdminClient'), { ssr: false });

type LegalPayload = {
  termsData: LegalPage | null;
  privacyData: LegalPage | null;
};

export default function LegalSettingsPage() {
  const [data, setData] = useState<LegalPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch('/api/admin/legal', { cache: 'no-store' });
      const json = (await res.json()) as LegalPayload;

      if (!cancelled) {
        setData(json);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  return (
    <LegalAdminClientLazy initialTermsData={data.termsData} initialPrivacyData={data.privacyData} />
  );
}
