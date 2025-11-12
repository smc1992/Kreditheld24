import { NextRequest, NextResponse } from 'next/server'
import { getVerificationData } from '../../../../lib/verification'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: any
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
    const verificationData = await getVerificationData(token)
    
    if (!verificationData) {
      return NextResponse.json(
        { verified: false, error: 'Token nicht gefunden' },
        { status: 404 }
      )
    }

    // Token-Ablauf prüfen (konfigurierbar; Standard 7 Tage)
    const tokenAge = Date.now() - verificationData.createdAt.getTime()
    const maxAge = (parseInt(process.env.VERIFICATION_TTL_SECONDS || '', 10) || (7 * 24 * 60 * 60)) * 1000
    
    if (tokenAge > maxAge) {
      return NextResponse.json(
        { verified: false, error: 'Token abgelaufen' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      verified: verificationData.verified,
      email: verificationData.email,
      formData: verificationData.formData
    })
    
  } catch (error) {
    console.error('Fehler beim Prüfen der E-Mail-Verifizierung:', error)
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    )
  }
}