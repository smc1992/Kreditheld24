import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

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
    
    const payload = await getPayload({ config })
    
    // Find verification record
    const verifications = await payload.find({
      collection: 'email-verifications' as any,
      where: {
        token: {
          equals: token,
        },
      },
      limit: 1,
    })
    
    if (verifications.docs.length === 0) {
      return NextResponse.json(
        { error: 'Ungültiger Token' },
        { status: 404 }
      )
    }
    
    const verification = verifications.docs[0] as any
    
    // Check if token is expired
    const now = new Date()
    const expiresAt = new Date(verification.expiresAt)
    
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Token ist abgelaufen' },
        { status: 410 }
      )
    }
    
    // Return verification status
    return NextResponse.json({
      verified: verification.verified,
      email: verification.email,
      expiresAt: verification.expiresAt,
    })
    
  } catch (error) {
    console.error('Error checking verification:', error)
    return NextResponse.json(
      { error: 'Fehler beim Prüfen der Bestätigung' },
      { status: 500 }
    )
  }
}