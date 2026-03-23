import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappMessages } from '@/db';
import { eq } from 'drizzle-orm';
import { EVOLUTION_API_URL, EVOLUTION_API_KEY, INSTANCE_NAME } from '@/lib/evolution';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/whatsapp/media?messageId=XXX
 * 
 * Serves WhatsApp media. First checks the local DB cache (mediaUrl column),
 * then falls back to the Evolution API's getBase64FromMediaMessage.
 * If the Evolution API returns the media, it's also cached in the DB for future use.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messageId = request.nextUrl.searchParams.get('messageId');
    if (!messageId) {
      return NextResponse.json({ error: 'messageId is required' }, { status: 400 });
    }

    // 1. Check local DB cache first
    const cached = await db.select({ mediaUrl: whatsappMessages.mediaUrl, mediaMimeType: whatsappMessages.mediaMimeType })
      .from(whatsappMessages)
      .where(eq(whatsappMessages.messageId, messageId))
      .limit(1);

    if (cached.length > 0 && cached[0].mediaUrl?.startsWith('data:')) {
      // Serve from cache
      const dataUri = cached[0].mediaUrl;
      const mimeMatch = dataUri.match(/^data:([^;]+);base64,/);
      const mimetype = mimeMatch?.[1] || cached[0].mediaMimeType || 'application/octet-stream';
      const cleanBase64 = dataUri.split(',')[1];
      const buffer = Buffer.from(cleanBase64, 'base64');
      const uint8 = new Uint8Array(buffer);

      return new NextResponse(uint8, {
        headers: {
          'Content-Type': mimetype,
          'Content-Length': uint8.length.toString(),
          'Cache-Control': 'private, max-age=86400',
        },
      });
    }

    // 2. Fall back to Evolution API
    const response = await fetch(
      `${EVOLUTION_API_URL}/chat/getBase64FromMediaMessage/${INSTANCE_NAME}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          message: { key: { id: messageId } },
          convertToMp4: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Media Proxy] Evolution API error:', response.status, errorText);
      return NextResponse.json({ error: 'Media nicht mehr verfügbar. WhatsApp-Medien laufen nach einigen Stunden ab.' }, { status: 404 });
    }

    const data = await response.json();
    
    const base64 = data?.base64 || data?.mediaUrl || data?.media;
    const mimetype = data?.mimetype || data?.mediatype || 'application/octet-stream';

    if (!base64) {
      return NextResponse.json({ error: 'No media data returned' }, { status: 404 });
    }

    // Cache in DB for future access
    const dataUri = base64.startsWith('data:') ? base64 : `data:${mimetype};base64,${base64}`;
    db.update(whatsappMessages)
      .set({ mediaUrl: dataUri })
      .where(eq(whatsappMessages.messageId, messageId))
      .catch((err: any) => console.error('[Media Proxy] Cache save error:', err));

    // Serve the media
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const buffer = Buffer.from(cleanBase64, 'base64');
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      headers: {
        'Content-Type': mimetype,
        'Content-Length': uint8.length.toString(),
        'Cache-Control': 'private, max-age=86400',
      },
    });
  } catch (error) {
    console.error('[Media Proxy] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
