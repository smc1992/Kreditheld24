import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getInstanceStatus, getQRCode, getInstanceInfo, logoutInstance } from '@/lib/evolution';
import { db, whatsappConversations, whatsappMessages, whatsappAutomationLogs } from '@/db';
import { sql } from 'drizzle-orm';

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

// POST /api/admin/whatsapp/status - Disconnect WhatsApp
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[WhatsApp] Disconnecting instance...');
    await logoutInstance();

    return NextResponse.json({ success: true, message: 'WhatsApp wurde getrennt' });
  } catch (error) {
    console.error('[WhatsApp Status] Disconnect error:', error);
    return NextResponse.json({ success: false, error: 'Fehler beim Trennen' }, { status: 500 });
  }
}

// DELETE /api/admin/whatsapp/status - Clear all WhatsApp data
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clearLogs = searchParams.get('clearLogs') === 'true';

    console.log('[WhatsApp] Clearing all conversation data...');

    // Delete in correct order (messages first, then conversations)
    const deletedMessages = await db.delete(whatsappMessages).returning({ id: whatsappMessages.id });
    const deletedConversations = await db.delete(whatsappConversations).returning({ id: whatsappConversations.id });

    let deletedLogs = 0;
    if (clearLogs) {
      const logsResult = await db.delete(whatsappAutomationLogs).returning({ id: whatsappAutomationLogs.id });
      deletedLogs = logsResult.length;
    }

    console.log(`[WhatsApp] Cleared ${deletedMessages.length} messages, ${deletedConversations.length} conversations, ${deletedLogs} logs`);

    return NextResponse.json({
      success: true,
      deleted: {
        messages: deletedMessages.length,
        conversations: deletedConversations.length,
        logs: deletedLogs,
      },
    });
  } catch (error) {
    console.error('[WhatsApp Status] Clear data error:', error);
    return NextResponse.json({ success: false, error: 'Fehler beim Löschen der Daten' }, { status: 500 });
  }
}
