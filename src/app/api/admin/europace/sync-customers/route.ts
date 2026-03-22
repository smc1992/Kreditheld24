import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, crmCustomers } from '@/db'
import { eq } from 'drizzle-orm'
import {
  fetchBaufinanzierungProcesses,
  fetchBaufinanzierungProcessDetails,
  extractCustomerFromProcess,
  type EuropaceCustomerData,
} from '@/lib/europace'

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

    // Fetch ECHT_GESCHAEFT processes
    let processes: any[] = []
    try {
      processes = await fetchBaufinanzierungProcesses('ECHT_GESCHAEFT', 200)
    } catch (error) {
      console.error('[Admin Sync] Error fetching processes:', error)
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Fehler beim Abrufen der Vorgänge'
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
        console.error(`[Admin Sync] Error for ${processMeta.vorgangsNummer}:`, err)
        results.errors++
      }
    }

    results.total = customerDataList.length

    // Upsert each customer
    for (const c of customerDataList) {
      try {
        if (!c.firstName && !c.lastName) {
          results.skipped++
          continue
        }

        // Find existing by email or europaceId
        let existing = null

        if (c.email) {
          const [found] = await db
            .select()
            .from(crmCustomers)
            .where(eq(crmCustomers.email, c.email))
            .limit(1)
          existing = found || null
        }

        if (!existing && c.vorgangsNummer) {
          const [found] = await db
            .select()
            .from(crmCustomers)
            .where(eq(crmCustomers.europaceId, c.vorgangsNummer))
            .limit(1)
          existing = found || null
        }

        const updateData: Record<string, any> = {
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

        // Remove undefined
        const cleanData = Object.fromEntries(
          Object.entries(updateData).filter(([, v]) => v !== undefined)
        )

        if (existing) {
          // Update: only fill empty fields
          const mergedData: Record<string, any> = {}
          for (const [key, value] of Object.entries(cleanData)) {
            const existingValue = (existing as any)[key]
            if (!existingValue || existingValue === '' || key === 'europaceId' || key === 'updatedAt') {
              mergedData[key] = value
            }
          }

          if (Object.keys(mergedData).length > 0) {
            await db.update(crmCustomers).set(mergedData).where(eq(crmCustomers.id, existing.id))
          }

          results.updated++
          results.customers.push({
            action: 'updated',
            name: `${c.firstName} ${c.lastName}`,
            email: c.email || '-',
            vorgang: c.vorgangsNummer,
          })
        } else {
          // Create new
          await db.insert(crmCustomers).values({
            ...(cleanData as any),
            firstName: c.firstName || '',
            lastName: c.lastName || '',
            isActiveUser: false,
            emailVerified: false,
          })

          results.created++
          results.customers.push({
            action: 'created',
            name: `${c.firstName} ${c.lastName}`,
            email: c.email || '-',
            vorgang: c.vorgangsNummer,
          })
        }
      } catch (error) {
        console.error('[Admin Sync] Error:', c.firstName, c.lastName, error)
        results.errors++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync: ${results.created} neu, ${results.updated} aktualisiert, ${results.skipped} übersprungen, ${results.errors} Fehler`,
      results,
    })
  } catch (error) {
    console.error('[Admin Sync] Fatal:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Sync fehlgeschlagen' },
      { status: 500 }
    )
  }
}
