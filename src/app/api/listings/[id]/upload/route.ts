// src/app/api/listings/[id]/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAdminStorage } from '@/lib/firebaseAdmin';
import { logger } from '@/lib/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: listingId } = await params;

  if (!listingId) {
    return NextResponse.json({ success: false, error: 'Listing ID is missing.' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files').filter((f): f is File => f instanceof File);
    const unitId = formData.get('unitId');
    const unitIdString = typeof unitId === 'string' && unitId.length > 0 ? unitId : null;

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files to upload.' }, { status: 400 });
    }

    const storage = getAdminStorage();
    if (!storage) {
      return NextResponse.json(
        { success: false, error: 'Storage is not initialised.' },
        { status: 500 }
      );
    }

    const bucket = storage.bucket();
    const urls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');

      // Construct path based on whether it's a site, listing, or unit image
      let basePath = `listings/${listingId}`;
      if (listingId === 'site') {
        basePath = 'site';
      } else if (unitIdString) {
        basePath = `listings/${listingId}/units/${unitIdString}`;
      }

      const destination = `${basePath}/${Date.now()}-${originalFilename}`;

      const fileUpload = bucket.file(destination);
      await fileUpload.save(buffer, {
        public: true,
        contentType: file.type || 'application/octet-stream',
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });

      urls.push(fileUpload.publicUrl());
    }

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    logger.error('Error uploading to Firebase Storage:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown server error occurred.';
    return NextResponse.json(
      { success: false, error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
