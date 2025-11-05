import { NextRequest, NextResponse } from 'next/server'
import { getVerificationData, markTokenAsVerified } from '../../../../lib/verification'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const { token } = params
    
    if (!token) {
      return NextResponse.redirect(new URL('/kreditanfrage?error=invalid-token', request.url))
    }

    // Token in Store suchen
    const verificationData = await getVerificationData(token)
    
    if (!verificationData) {
      return NextResponse.redirect(new URL('/kreditanfrage?error=token-not-found', request.url))
    }

    // Token-Ablauf prüfen (24 Stunden)
    const tokenAge = Date.now() - verificationData.createdAt.getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 Stunden in Millisekunden
    
    if (tokenAge > maxAge) {
      return NextResponse.redirect(new URL('/kreditanfrage?error=token-expired', request.url))
    }

    // Bereits verifiziert?
    if (verificationData.verified) {
      return NextResponse.redirect(new URL('/kreditanfrage?success=already-verified', request.url))
    }

    // E-Mail als verifiziert markieren
    await markTokenAsVerified(token)

    // Erfolgreiche Verifizierung
    return NextResponse.redirect(new URL('/kreditanfrage?success=email-verified', request.url))
    
  } catch (error) {
    console.error('Fehler bei E-Mail-Verifizierung:', error)
    return NextResponse.redirect(new URL('/kreditanfrage?error=verification-failed', request.url))
  }
}