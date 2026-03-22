import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getInstanceStatus, getQRCode, getInstanceInfo } from '@/lib/evolution';

export const dynamic = 'force-dynamic';

// GET /api/admin/whatsapp/status - Get WhatsApp connection status & QR code
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let connectionStatus = 'unknown';
    let qrCode = null;
    let instanceInfo = null;

    try {
      const status = await getInstanceStatus();
      connectionStatus = status?.instance?.state || status?.state || 'unknown';
    } catch (err) {
      console.error('[WhatsApp Status] Error getting status:', err);
    }

    // If not connected, get QR code
    if (connectionStatus !== 'open') {
      try {
        const qr = await getQRCode();
        qrCode = qr?.base64 || qr?.code || null;
      } catch (err) {
        console.error('[WhatsApp Status] Error getting QR code:', err);
      }
    }

    try {
      const info = await getInstanceInfo();
      instanceInfo = Array.isArray(info) ? info[0] : info;
    } catch (err) {
      // ignore
    }

    return NextResponse.json({
      success: true,
      connectionStatus,
      qrCode,
      instanceInfo: instanceInfo ? {
        name: instanceInfo.name,
        ownerJid: instanceInfo.ownerJid,
        profileName: instanceInfo.profileName,
        profilePicUrl: instanceInfo.profilePicUrl,
        number: instanceInfo.number,
      } : null,
    });
  } catch (error) {
    console.error('[WhatsApp Status] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get status' }, { status: 500 });
  }
}
