import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCustomers, whatsappConversations } from '@/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/whatsapp/create-customer
 * 
 * Creates a new CRM customer from WhatsApp chat and links them to the conversation.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, conversationId } = body;

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ error: 'Vorname und Nachname sind erforderlich' }, { status: 400 });
    }

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId ist erforderlich' }, { status: 400 });
    }

    // Format phone number with + prefix
    const formattedPhone = phone ? (phone.startsWith('+') ? phone : `+${phone}`) : undefined;

    // Create the customer
    const [newCustomer] = await db.insert(crmCustomers).values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email?.trim() || undefined,
      phone: formattedPhone,
    }).returning({ id: crmCustomers.id });

    // Link the conversation to the new customer
    await db.update(whatsappConversations)
      .set({
        customerId: newCustomer.id,
        updatedAt: new Date(),
      })
      .where(eq(whatsappConversations.id, conversationId));

    console.log(`[WhatsApp] Created customer ${firstName} ${lastName} (${newCustomer.id}) and linked to conversation ${conversationId}`);

    return NextResponse.json({
      success: true,
      customerId: newCustomer.id,
    });
  } catch (error) {
    console.error('[WhatsApp] Error creating customer:', error);
    return NextResponse.json({ error: 'Fehler beim Anlegen des Kunden' }, { status: 500 });
  }
}
