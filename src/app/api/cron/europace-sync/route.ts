import { NextResponse } from 'next/server'
import { db, crmCustomers } from '@/db'
import { eq, or } from 'drizzle-orm'
import {
  fetchBaufinanzierungProcesses,
  fetchBaufinanzierungProcessDetails,
  extractCustomerFromProcess,
  type EuropaceCustomerData,
} from '@/lib/europace'

// Cron-triggered Europace sync
// Schedule: hourly or on-demand from admin dashboard
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Europace Sync] Starting customer sync...')

    const results = {
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      customers: [] as string[],
      timestamp: new Date().toISOString(),
    }

    // Fetch ECHT_GESCHAEFT processes
    let processes: any[] = []
    try {
      processes = await fetchBaufinanzierungProcesses('ECHT_GESCHAEFT', 200)
      console.log(`[Europace Sync] Fetched ${processes.length} processes`)
    } catch (error) {
      console.error('[Europace Sync] Error fetching processes:', error)
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch processes'
      }, { status: 500 })
    }

    // Extract customer data from each process
    const customerDataList: EuropaceCustomerData[] = []

    for (const processMeta of processes) {
      if (!processMeta.vorgangsNummer) continue

      try {
        const fullProcess = await fetchBaufinanzierungProcessDetails(processMeta.vorgangsNummer)
        const customers = extractCustomerFromProcess(fullProcess, 'baufinanzierung')
        customerDataList.push(...customers)
      } catch (err) {
        console.error(`[Europace Sync] Error for ${processMeta.vorgangsNummer}:`, err)
        results.errors++
      }
    }

    results.total = customerDataList.length
    console.log(`[Europace Sync] Extracted ${results.total} customers from ${processes.length} processes`)

    // Upsert each customer into CRM
    for (const c of customerDataList) {
      try {
        // Skip customers without name
        if (!c.firstName && !c.lastName) {
          results.skipped++
          continue
        }

        // Find existing customer by email or europaceId+name
        let existing = null

        if (c.email) {
          const [found] = await db
            .select()
            .from(crmCustomers)
            .where(eq(crmCustomers.email, c.email))
            .limit(1)
          existing = found || null
        }

        // Also try to match by europaceId
        if (!existing && c.vorgangsNummer) {
          const [found] = await db
            .select()
            .from(crmCustomers)
            .where(eq(crmCustomers.europaceId, c.vorgangsNummer))
            .limit(1)
          existing = found || null
        }

        const updateData = {
          firstName: c.firstName || undefined,
          lastName: c.lastName || undefined,
          email: c.email || undefined,
          phone: c.phone || undefined,
          salutation: c.salutation || undefined,
          address: c.address || undefined,
          street: c.street || undefined,
          city: c.city || undefined,
          zipCode: c.zipCode || undefined,
          birthDate: c.birthDate ? new Date(c.birthDate) : undefined,
          maritalStatus: c.maritalStatus || undefined,
          nationality: c.nationality || undefined,
          occupation: c.occupation || undefined,
          monthlyIncome: c.monthlyIncome?.toString() || undefined,
          europaceId: c.vorgangsNummer,
          updatedAt: new Date(),
        }

        // Remove undefined values
        const cleanData = Object.fromEntries(
          Object.entries(updateData).filter(([, v]) => v !== undefined)
        )

        if (existing) {
          // Update existing - only fill empty fields, don't overwrite existing data
          const mergedData: Record<string, any> = {}
          for (const [key, value] of Object.entries(cleanData)) {
            const existingValue = (existing as any)[key]
            // Only update if the existing field is empty/null
            if (!existingValue || existingValue === '' || key === 'europaceId' || key === 'updatedAt') {
              mergedData[key] = value
            }
          }

          if (Object.keys(mergedData).length > 0) {
            await db
              .update(crmCustomers)
              .set(mergedData)
              .where(eq(crmCustomers.id, existing.id))
          }

          results.updated++
          results.customers.push(`✏️ ${c.firstName} ${c.lastName} (${c.vorgangsNummer})`)
        } else {
          // Create new customer
          await db
            .insert(crmCustomers)
            .values({
              ...(cleanData as any),
              firstName: c.firstName || '',
              lastName: c.lastName || '',
              isActiveUser: false,
              emailVerified: false,
            })

          results.created++
          results.customers.push(`✅ ${c.firstName} ${c.lastName} (${c.vorgangsNummer})`)
        }
      } catch (error) {
        console.error('[Europace Sync] Error processing customer:', c.firstName, c.lastName, error)
        results.errors++
      }
    }

    console.log('[Europace Sync] Completed:', results)

    return NextResponse.json({
      success: true,
      message: `Sync: ${results.created} neu, ${results.updated} aktualisiert, ${results.skipped} übersprungen, ${results.errors} Fehler`,
      results,
    })
  } catch (error) {
    console.error('[Europace Sync] Fatal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    )
  }
}
