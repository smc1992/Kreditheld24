import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { testConnection } from '@/lib/europace'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await testConnection()

    return NextResponse.json({
      success: true,
      message: 'API-Verbindung erfolgreich',
      data: {
        connected: result.success,
        scopes: result.scopes,
        vorgaengeCount: result.vorgaengeCount,
      }
    })
  } catch (error) {
    console.error('Europace connection test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Verbindungstest fehlgeschlagen',
      },
      { status: 500 }
    )
  }
}
