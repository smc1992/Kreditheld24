import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappAutomationLogs } from '@/db';
import { sql, eq, and, gte, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - Fetch automation stats and recent logs
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '7d'; // '24h', '7d', '30d'
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Calculate date range
    const now = new Date();
    let sinceDate: Date;
    switch (period) {
      case '24h':
        sinceDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '30d':
        sinceDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        sinceDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Aggregate stats
    const statsResult = await db.execute(sql`
      SELECT 
        type,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE success = true) as success_count,
        COUNT(*) FILTER (WHERE success = false) as failure_count
      FROM whatsapp_automation_logs
      WHERE created_at >= ${sinceDate}
      GROUP BY type
    `);

    const statsRows = statsResult as unknown as Array<{
      type: string;
      total: string;
      success_count: string;
      failure_count: string;
    }>;

    const stats = {
      ki_replies: { total: 0, success: 0, failed: 0 },
      credit_detections: { total: 0, success: 0, failed: 0 },
      doc_forwards: { total: 0, success: 0, failed: 0 },
      errors: { total: 0, success: 0, failed: 0 },
    };

    for (const row of statsRows) {
      const entry = {
        total: parseInt(row.total),
        success: parseInt(row.success_count),
        failed: parseInt(row.failure_count),
      };
      switch (row.type) {
        case 'ki_reply': stats.ki_replies = entry; break;
        case 'credit_detection': stats.credit_detections = entry; break;
        case 'doc_forward': stats.doc_forwards = entry; break;
        case 'error': stats.errors = entry; break;
      }
    }

    // Daily stats for chart (last 7 days or 30 days)
    const dailyResult = await db.execute(sql`
      SELECT 
        DATE(created_at) as date,
        type,
        COUNT(*) as count
      FROM whatsapp_automation_logs
      WHERE created_at >= ${sinceDate}
      GROUP BY DATE(created_at), type
      ORDER BY date ASC
    `);

    const dailyStats = dailyResult as unknown as Array<{
      date: string;
      type: string;
      count: string;
    }>;

    // Recent logs
    const offset = (page - 1) * limit;
    const logs = await db
      .select()
      .from(whatsappAutomationLogs)
      .orderBy(desc(whatsappAutomationLogs.createdAt))
      .limit(limit)
      .offset(offset);

    // Total count for pagination
    const countResult = await db.execute(sql`SELECT COUNT(*) as total FROM whatsapp_automation_logs`);
    const totalLogs = parseInt((countResult as any)[0]?.total || '0');

    return NextResponse.json({
      success: true,
      stats,
      dailyStats,
      logs,
      pagination: {
        page,
        limit,
        total: totalLogs,
        totalPages: Math.ceil(totalLogs / limit),
      },
    });
  } catch (error) {
    console.error('[WhatsApp Stats] Error:', error);
    return NextResponse.json({
      success: true,
      stats: {
        ki_replies: { total: 0, success: 0, failed: 0 },
        credit_detections: { total: 0, success: 0, failed: 0 },
        doc_forwards: { total: 0, success: 0, failed: 0 },
        errors: { total: 0, success: 0, failed: 0 },
      },
      dailyStats: [],
      logs: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
  }
}
