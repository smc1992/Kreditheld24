import { NextResponse } from 'next/server'
import { db, crmCustomers } from '@/db'
import { eq } from 'drizzle-orm'
import {
  fetchBaufinanzierungProcesses,
  fetchPrivatkreditProcesses,
  extractCustomerFromProcess,
  type EuropaceCustomerData,
} from '../../../../../lib/europace'
import bcrypt from 'bcryptjs'

// This route will be called by Vercel Cron
// Add to vercel.json: { "crons": [{ "path": "/api/cron/europace-sync", "schedule": "0 * * * *" }] }
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Cron] Starting Europace customer sync...')

    const results = {
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      timestamp: new Date().toISOString(),
    }

    // Fetch processes from both APIs
    let baufiProcesses: any[] = []
    let privatkreditProcesses: any[] = []

    try {
      baufiProcesses = await fetchBaufinanzierungProcesses()
      console.log(`[Cron] Fetched ${baufiProcesses.length} Baufinanzierung processes`)
    } catch (error) {
      console.error('[Cron] Error fetching Baufinanzierung processes:', error)
    }

    // Privatkredit sync temporarily disabled - GraphQL schema doesn't support listing all vorgaenge
    /*
    try {
      privatkreditProcesses = await fetchPrivatkreditProcesses()
      console.log(`[Cron] Fetched ${privatkreditProcesses.length} Privatkredit processes`)
    } catch (error) {
      console.error('[Cron] Error fetching Privatkredit processes:', error)
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
    console.log(`[Cron] Extracted ${results.total} customers from processes`)

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
          await db
            .update(crmCustomers)
            .set({
              firstName: customerData.firstName || existingCustomer[0].firstName,
              lastName: customerData.lastName || existingCustomer[0].lastName,
              phone: customerData.phone || existingCustomer[0].phone,
              address: customerData.address || existingCustomer[0].address,
              europaceId: customerData.vorgangsNummer || existingCustomer[0].europaceId,
            })
            .where(eq(crmCustomers.id, existingCustomer[0].id))

          results.updated++
        } else {
          // Create new customer
          const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10)

          await db
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

          results.created++
        }
      } catch (error) {
        console.error('[Cron] Error processing customer:', customerData.email, error)
        results.errors++
      }
    }

    console.log('[Cron] Sync completed:', results)

    return NextResponse.json({
      success: true,
      message: `Cron sync completed: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped, ${results.errors} errors`,
      results,
    })
  } catch (error) {
    console.error('[Cron] Europace sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Cron sync failed',
      },
      { status: 500 }
    )
  }
}
