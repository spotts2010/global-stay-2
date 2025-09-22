import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided.' }, { status: 400 });
    }

    const publicPath = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(publicPath, { recursive: true });

    const urls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      await fs.writeFile(path.join(publicPath, filename), buffer);
      urls.push(`/uploads/${filename}`);
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
