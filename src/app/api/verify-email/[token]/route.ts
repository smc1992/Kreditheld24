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
      return NextResponse.redirect(new URL('/kreditanfrage?error=invalid-token', request.url))
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
      return NextResponse.redirect(new URL('/kreditanfrage?error=token-not-found', request.url))
    }
    
    const verification = verifications.docs[0] as any
    
    // Check if token is expired
    const now = new Date()
    const expiresAt = new Date(verification.expiresAt)
    
    if (now > expiresAt) {
      return NextResponse.redirect(new URL('/kreditanfrage?error=token-expired', request.url))
    }
    
    // Check if already verified
    if (verification.verified) {
      return NextResponse.redirect(new URL('/kreditanfrage?success=already-verified', request.url))
    }
    
    // Mark as verified
    await payload.update({
      collection: 'email-verifications' as any,
      id: verification.id,
      data: {
        verified: true,
      },
    })
    
    console.log(`Email verified for ${verification.email} with token ${token}`)
    
    // Redirect to success page
    return NextResponse.redirect(new URL('/kreditanfrage?success=email-verified', request.url))
    
  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.redirect(new URL('/kreditanfrage?error=verification-failed', request.url))
  }
}