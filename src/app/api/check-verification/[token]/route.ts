import { NextRequest, NextResponse } from 'next/server'
import { getVerificationData } from '@/lib/verification'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token ist erforderlich' },
        { status: 400 }
      )
    }

    // Verifizierungsdaten abrufen
    const verificationData = getVerificationData(token)
    
    if (!verificationData) {
      return NextResponse.json(
        { verified: false, error: 'Token nicht gefunden' },
        { status: 404 }
      )
    }

    // Token-Ablauf prüfen (24 Stunden)
    const tokenAge = Date.now() - verificationData.createdAt.getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 Stunden in Millisekunden
    
    if (tokenAge > maxAge) {
      return NextResponse.json(
        { verified: false, error: 'Token abgelaufen' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      verified: verificationData.verified,
      email: verificationData.email
    })
    
  } catch (error) {
    console.error('Fehler beim Prüfen der E-Mail-Verifizierung:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    )
  }
}