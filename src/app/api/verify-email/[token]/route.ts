import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

// Temporärer In-Memory Store für Demo-Zwecke
// In Produktion sollte eine echte Datenbank verwendet werden
const verificationStore = new Map<string, {
  email: string
  formData: any
  createdAt: Date
  verified: boolean
}>()

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
    const verificationData = verificationStore.get(token)
    
    if (!verificationData) {
      return redirect('/kreditanfrage?error=token-not-found')
    }

    // Token-Ablauf prüfen (24 Stunden)
    const tokenAge = Date.now() - verificationData.createdAt.getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 Stunden in Millisekunden
    
    if (tokenAge > maxAge) {
      verificationStore.delete(token)
      return redirect('/kreditanfrage?error=token-expired')
    }

    // Bereits verifiziert?
    if (verificationData.verified) {
      return redirect('/kreditanfrage?success=already-verified')
    }

    // E-Mail als verifiziert markieren
    verificationData.verified = true
    verificationStore.set(token, verificationData)

    // Erfolgreiche Verifizierung
    return redirect('/kreditanfrage?success=email-verified')
    
  } catch (error) {
    console.error('Fehler bei E-Mail-Verifizierung:', error)
    return redirect('/kreditanfrage?error=verification-failed')
  }
}

// Hilfsfunktion für andere API-Routen
export function storeVerificationToken(
  token: string, 
  email: string, 
  formData: any
) {
  verificationStore.set(token, {
    email,
    formData,
    createdAt: new Date(),
    verified: false
  })
}

export function getVerificationData(token: string) {
  return verificationStore.get(token)
}

export function isTokenVerified(token: string): boolean {
  const data = verificationStore.get(token)
  return data?.verified || false
}