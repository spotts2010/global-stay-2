import { NextRequest, NextResponse } from 'next/server';
import { getAdminStorage } from '@/lib/firebaseAdmin';
import { logger } from '@/lib/logger';

// Disable the default body parser, as we're using formData
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id: listingId } = params;
  if (!listingId) {
    return NextResponse.json({ success: false, error: 'Listing ID is missing.' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const unitId = formData.get('unitId') as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files to upload.' }, { status: 400 });
    }

    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const urls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');

      // Construct path based on whether it's a site, listing, or unit image
      let basePath = `listings/${listingId}`;
      if (listingId === 'site') {
        basePath = 'site';
      } else if (unitId) {
        basePath = `listings/${listingId}/units/${unitId}`;
      }

      const destination = `${basePath}/${Date.now()}-${originalFilename}`;

      const fileUpload = bucket.file(destination);
      await fileUpload.save(buffer, {
        public: true,
        contentType: file.type,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });

      const publicUrl = fileUpload.publicUrl();
      urls.push(publicUrl);
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
