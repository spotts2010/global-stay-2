// src/app/api/admin/legal/route.ts
import { NextResponse } from 'next/server';
import { fetchLegalPage } from '@/lib/firestore.server';

export const runtime = 'nodejs';

export async function GET() {
  const termsData = await fetchLegalPage('terms-and-conditions');
  const privacyData = await fetchLegalPage('privacy-policy');

  return NextResponse.json({ termsData, privacyData });
}
