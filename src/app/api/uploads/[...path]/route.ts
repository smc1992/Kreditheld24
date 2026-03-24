import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join, resolve, extname } from 'path';

export const runtime = 'nodejs';

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathParts } = await params;
    const relativePath = pathParts.join('/');

    // Security: block path traversal
    if (relativePath.includes('..') || relativePath.includes('~')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const absolutePath = resolve(process.cwd(), 'public', 'uploads', relativePath);

    // Ensure the resolved path is still within uploads directory
    const uploadsBase = resolve(process.cwd(), 'public', 'uploads');
    if (!absolutePath.startsWith(uploadsBase)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // Check file exists
    try {
      await stat(absolutePath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await readFile(absolutePath);
    const ext = extname(absolutePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[Uploads API] Error serving file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
