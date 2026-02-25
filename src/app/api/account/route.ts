// src/app/api/account/favorites/route.ts
import { NextResponse } from 'next/server';
import { fetchAccommodationById } from '@/lib/firestore.server';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { ids?: string[] };
    const ids = Array.isArray(body?.ids) ? body.ids : [];

    const unique = [...new Set(ids)].filter(Boolean).slice(0, 50);

    const results = await Promise.all(unique.map((id) => fetchAccommodationById(id)));

    return NextResponse.json({
      accommodations: results.filter(Boolean),
    });
  } catch {
    return NextResponse.json({ accommodations: [] }, { status: 200 });
  }
}
