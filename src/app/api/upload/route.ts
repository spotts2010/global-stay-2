import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided.' }, { status: 400 });
    }

    const publicPath = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(publicPath, { recursive: true });

    const requestHeaders = headers();
    const host = requestHeaders.get('host') || 'localhost:3000';
    // Force HTTP for localhost environments to ensure correct URL construction
    const protocol =
      host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';

    const urls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // Sanitize filename to prevent path traversal issues
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      await fs.writeFile(path.join(publicPath, filename), buffer);
      // Construct the full, absolute URL for the uploaded file
      urls.push(`${protocol}://${host}/uploads/${filename}`);
    }

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error('Error uploading images:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { success: false, error: `Failed to upload images: ${errorMessage}` },
      { status: 500 }
    );
  }
}
