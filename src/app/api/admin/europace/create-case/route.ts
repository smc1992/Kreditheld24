import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, crmCustomers } from '@/db'
import { eq } from 'drizzle-orm'
import { createPrivatkreditCase, type EuropaceCustomerData } from '../../../../../../lib/europace'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { customerId } = body

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    // Fetch customer data
    const customers = await db
      .select()
      .from(crmCustomers)
      .where(eq(crmCustomers.id, customerId))
      .limit(1)

    if (customers.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const customer = customers[0]

    if (!customer.email) {
      return NextResponse.json({ error: 'Kunde hat keine E-Mail-Adresse. Diese ist für Europace erforderlich.' }, { status: 400 })
    }

    // Map to EuropaceCustomerData
    const customerData: EuropaceCustomerData = {
      salutation: customer.salutation || undefined,
      title: customer.title || undefined,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone || undefined,
      address: customer.address || undefined,
      birthDate: customer.birthDate ? new Date(customer.birthDate) : undefined,
      birthPlace: customer.birthPlace || undefined,
      maritalStatus: customer.maritalStatus || undefined,
      childrenCount: customer.childrenCount || 0,
      nationality: customer.nationality || undefined,
      source: 'privatkredit'
    }

    // Create case in Europace
    // Determine environment: Default to TEST_MODUS unless explicitly set to ECHT_GESCHAEFT
    // The user requested live environment support. 
    // We check for a flag in the body 'live' or process.env.EUROPACE_ENV
    const isLive = body.live === true || process.env.EUROPACE_ENV === 'PRODUCTION';
    const datenKontext = isLive ? 'ECHT_GESCHAEFT' : 'TEST_MODUS';

    console.log(`Creating Europace case for customer ${customerId} in ${datenKontext} mode...`);

    const vorgangsNummer = await createPrivatkreditCase(customerData, datenKontext)

    // Store the vorgangsNummer in the customer record
    // Always update if we got a new number, or logic as preferred.
    // User requirement: "die api gibt die response der vorgangs id die müssten wir auch in unserem system speichern"
    await db
      .update(crmCustomers)
      .set({ europaceId: vorgangsNummer })
      .where(eq(crmCustomers.id, customerId))

    return NextResponse.json({ success: true, vorgangsNummer })
  } catch (error) {
    console.error('Error creating Europace case:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
