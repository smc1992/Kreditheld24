import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, crmCustomers } from '@/db'
import { eq } from 'drizzle-orm'
import {
  fetchBaufinanzierungProcesses,
  fetchPrivatkreditProcesses,
  extractCustomerFromProcess,
  type EuropaceCustomerData,
} from '../../../../../../lib/europace'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      customers: [] as any[],
    }

    // Fetch processes from both APIs and both modes (TEST_MODUS + ECHT_GESCHAEFT)
    let baufiProcesses: any[] = []
    let privatkreditProcesses: any[] = []

    try {
      // Fetch both TEST_MODUS and ECHT_GESCHAEFT
      const [testProcesses, echtProcesses] = await Promise.all([
        fetchBaufinanzierungProcesses('TEST_MODUS'),
        fetchBaufinanzierungProcesses('ECHT_GESCHAEFT')
      ])
      baufiProcesses = [...testProcesses, ...echtProcesses]
    } catch (error) {
      console.error('Error fetching Baufinanzierung processes:', error)
      // Continue even if Baufi fails
    }

    // Privatkredit sync temporarily disabled - GraphQL schema doesn't support listing all vorgaenge
    // Only individual vorgaenge can be fetched by vorgangsnummer
    // TODO: Enable when Europace provides a way to list all Privatkredit vorgaenge
    /*
    try {
      privatkreditProcesses = await fetchPrivatkreditProcesses()
    } catch (error) {
      console.error('Error fetching Privatkredit processes:', error)
      // Continue even if Privatkredit fails
    }
    */

    // Extract customer data from processes
    const customerDataList: EuropaceCustomerData[] = []

    for (const process of baufiProcesses) {
      const customerData = extractCustomerFromProcess(process, 'baufinanzierung')
      if (customerData) {
        customerDataList.push(customerData)
      }
    }

    for (const process of privatkreditProcesses) {
      const customerData = extractCustomerFromProcess(process, 'privatkredit')
      if (customerData) {
        customerDataList.push(customerData)
      }
    }

    results.total = customerDataList.length

    // Process each customer
    for (const customerData of customerDataList) {
      try {
        if (!customerData.email) {
          results.skipped++
          continue
        }

        // Check if customer already exists by email
        const existingCustomer = await db
          .select()
          .from(crmCustomers)
          .where(eq(crmCustomers.email, customerData.email))
          .limit(1)

        if (existingCustomer.length > 0) {
          // Update existing customer
          const updated = await db
            .update(crmCustomers)
            .set({
              firstName: customerData.firstName || existingCustomer[0].firstName,
              lastName: customerData.lastName || existingCustomer[0].lastName,
              phone: customerData.phone || existingCustomer[0].phone,
              address: customerData.address || existingCustomer[0].address,
              europaceId: customerData.vorgangsNummer || existingCustomer[0].europaceId,
            })
            .where(eq(crmCustomers.id, existingCustomer[0].id))
            .returning()

          results.updated++
          results.customers.push({
            action: 'updated',
            email: customerData.email,
            name: `${customerData.firstName} ${customerData.lastName}`,
            source: customerData.source,
          })
        } else {
          // Create new customer
          const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10)

          const newCustomer = await db
            .insert(crmCustomers)
            .values({
              email: customerData.email,
              passwordHash: hashedPassword,
              firstName: customerData.firstName || '',
              lastName: customerData.lastName || '',
              phone: customerData.phone || '',
              address: customerData.address || '',
              europaceId: customerData.vorgangsNummer,
              emailVerified: false,
            })
            .returning()

          results.created++
          results.customers.push({
            action: 'created',
            email: customerData.email,
            name: `${customerData.firstName} ${customerData.lastName}`,
            source: customerData.source,
          })
        }
      } catch (error) {
        console.error('Error processing customer:', customerData.email, error)
        results.errors++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synchronisation abgeschlossen: ${results.created} erstellt, ${results.updated} aktualisiert, ${results.skipped} übersprungen, ${results.errors} Fehler`,
      results,
    })
  } catch (error) {
    console.error('Europace sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Synchronisation fehlgeschlagen',
      },
      { status: 500 }
    )
  }
}
