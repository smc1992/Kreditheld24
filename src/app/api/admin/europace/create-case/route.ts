import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, crmCustomers } from '@/db'
import { eq } from 'drizzle-orm'
import { createKundenangabenCase } from '@/lib/europace'

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
    const [customer] = await db
      .select()
      .from(crmCustomers)
      .where(eq(crmCustomers.id, customerId))
      .limit(1)

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Determine environment
    const isLive = body.live === true || process.env.EUROPACE_ENV === 'PRODUCTION'
    const datenKontext = isLive ? 'ECHT_GESCHAEFT' : 'TEST_MODUS'

    console.log(`Creating Europace case for ${customer.firstName} ${customer.lastName} in ${datenKontext}...`)

    const result = await createKundenangabenCase({
      vorname: customer.firstName,
      nachname: customer.lastName,
      email: customer.email || undefined,
      telefon: customer.phone || undefined,
      strasse: customer.street || undefined,
      plz: customer.zipCode || undefined,
      ort: customer.city || undefined,
      geburtsdatum: customer.birthDate ? new Date(customer.birthDate).toISOString().split('T')[0] : undefined,
      datenkontext: datenKontext as 'TEST_MODUS' | 'ECHT_GESCHAEFT',
    })

    // Store the vorgangsNummer
    await db
      .update(crmCustomers)
      .set({ europaceId: result.vorgangsNummer, updatedAt: new Date() })
      .where(eq(crmCustomers.id, customerId))

    return NextResponse.json({
      success: true,
      vorgangsNummer: result.vorgangsNummer,
      openUrl: result.openUrl,
    })
  } catch (error) {
    console.error('Error creating Europace case:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Fehler bei Europace-Erstellung' },
      { status: 500 }
    )
  }
}
