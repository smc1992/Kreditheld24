import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { getVerificationData, markTokenAsVerified } from '@/lib/verification'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    
    if (!token) {
      return redirect('/kreditanfrage?error=invalid-token')
    }

    // Token in Store suchen
    const verificationData = getVerificationData(token)
    
    if (!verificationData) {
      return redirect('/kreditanfrage?error=token-not-found')
    }

    // Token-Ablauf prüfen (24 Stunden)
    const tokenAge = Date.now() - verificationData.createdAt.getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 Stunden in Millisekunden
    
    if (tokenAge > maxAge) {
      return redirect('/kreditanfrage?error=token-expired')
    }

    // Bereits verifiziert?
    if (verificationData.verified) {
      return redirect('/kreditanfrage?success=already-verified')
    }

    // E-Mail als verifiziert markieren
    markTokenAsVerified(token)

    // Erfolgreiche Verifizierung
    return redirect('/kreditanfrage?success=email-verified')
    
  } catch (error) {
    console.error('Fehler bei E-Mail-Verifizierung:', error)
    return redirect('/kreditanfrage?error=verification-failed')
  }
}