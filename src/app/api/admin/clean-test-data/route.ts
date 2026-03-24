import { NextResponse } from 'next/server';
import { db } from '@/db';
import { crmCustomers, creditApplications, emailVerifications } from '@/db/schema';
import { ilike, or } from 'drizzle-orm';

export async function GET() {
  try {
    const emails = ['%vbstephan%', '%info@evolution-bots%'];
    const emailConditions = or(...emails.map(e => ilike(crmCustomers.email, e)));
    
    // Delete from crmCustomers (Cascades to cases, documents, activities, etc)
    const deletedCustomers = await db.delete(crmCustomers)
      .where(emailConditions)
      .returning();

    // Delete from creditApplications
    const deletedApps = await db.delete(creditApplications)
      .where(or(...emails.map(e => ilike(creditApplications.email, e))))
      .returning();

    // Delete from emailVerifications
    const deletedVerifications = await db.delete(emailVerifications)
      .where(or(...emails.map(e => ilike(emailVerifications.email, e))))
      .returning();

    return NextResponse.json({
      success: true,
      deletedCustomers: deletedCustomers.length,
      deletedApps: deletedApps.length,
      deletedVerifications: deletedVerifications.length,
      emails: [...new Set(deletedCustomers.map(c => c.email))]
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code,
      detail: error.detail,
      table: error.table,
      constraint: error.constraint
    }, { status: 500 });
  }
}
