import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { EVOLUTION_API_URL, EVOLUTION_API_KEY, INSTANCE_NAME } from '@/lib/evolution';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/whatsapp/media?messageId=XXX
 * 
 * Proxies media download from Evolution API (getBase64FromMediaMessage).
 * WhatsApp media URLs are encrypted and expire quickly, so we need to
 * request the media through the Evolution API which decrypts it for us.
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

    // Call Evolution API to get base64 media
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
      return NextResponse.json({ error: 'Media not available' }, { status: 404 });
    }

    const data = await response.json();
    
    // Response format: { base64: "data:mimetype;base64,...", mimetype: "..." }
    const base64 = data?.base64 || data?.mediaUrl || data?.media;
    const mimetype = data?.mimetype || data?.mediatype || 'application/octet-stream';

    if (!base64) {
      return NextResponse.json({ error: 'No media data returned' }, { status: 404 });
    }

    // If base64 includes data URI prefix, strip it
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const buffer = Buffer.from(cleanBase64, 'base64');
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      headers: {
        'Content-Type': mimetype,
        'Content-Length': uint8.length.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[Media Proxy] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
