import { NextResponse } from 'next/server';
import { db, adminUsers } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test database connection
    const result = await db.select().from(adminUsers).limit(1);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      adminUsersCount: result.length,
      databaseUrl: process.env.DATABASE_URL ? 'Set (DATABASE_URL)' : 'Not set',
      databaseUri: process.env.DATABASE_URI ? 'Set (DATABASE_URI)' : 'Not set',
      connectionString: (process.env.DATABASE_URL || process.env.DATABASE_URI || 'None')
        .replace(/:[^:@]+@/, ':****@'), // Hide password
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'Set (DATABASE_URL)' : 'Not set',
      databaseUri: process.env.DATABASE_URI ? 'Set (DATABASE_URI)' : 'Not set',
      connectionString: (process.env.DATABASE_URL || process.env.DATABASE_URI || 'None')
        .replace(/:[^:@]+@/, ':****@'),
    }, { status: 500 });
  }
}
