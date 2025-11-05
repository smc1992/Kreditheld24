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
      // Basis-URL robust ermitteln (ENV > Forwarded-Header > Fallback)
      const envBaseUrl = process.env.VERIFICATION_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
      const xfProto = request.headers.get('x-forwarded-proto') || undefined
      const xfHost = request.headers.get('x-forwarded-host') || undefined
      const host = xfHost || request.headers.get('host') || undefined
      const proto = xfProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : undefined) || undefined
      const originFromHeaders = host && (proto ? `${proto}://${host}` : `https://${host}`)
      const fallbackProd = 'https://kreditheld24.de'
      const fallbackDev = 'http://localhost:3000'
      const baseUrl = envBaseUrl || originFromHeaders || request.nextUrl?.origin || (process.env.NODE_ENV === 'production' ? fallbackProd : fallbackDev)

      return NextResponse.redirect(new URL('/kreditanfrage?error=invalid-token', baseUrl))
    }

    // Token in Store suchen
    const verificationData = await getVerificationData(token)
    
    if (!verificationData) {
      const envBaseUrl = process.env.VERIFICATION_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
      const xfProto = request.headers.get('x-forwarded-proto') || undefined
      const xfHost = request.headers.get('x-forwarded-host') || undefined
      const host = xfHost || request.headers.get('host') || undefined
      const proto = xfProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : undefined) || undefined
      const originFromHeaders = host && (proto ? `${proto}://${host}` : `https://${host}`)
      const fallbackProd = 'https://kreditheld24.de'
      const fallbackDev = 'http://localhost:3000'
      const baseUrl = envBaseUrl || originFromHeaders || request.nextUrl?.origin || (process.env.NODE_ENV === 'production' ? fallbackProd : fallbackDev)

      return NextResponse.redirect(new URL('/kreditanfrage?error=token-not-found', baseUrl))
    }

    // Token-Ablauf prüfen (24 Stunden)
    const tokenAge = Date.now() - verificationData.createdAt.getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 Stunden in Millisekunden
    
    if (tokenAge > maxAge) {
      const envBaseUrl = process.env.VERIFICATION_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
      const xfProto = request.headers.get('x-forwarded-proto') || undefined
      const xfHost = request.headers.get('x-forwarded-host') || undefined
      const host = xfHost || request.headers.get('host') || undefined
      const proto = xfProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : undefined) || undefined
      const originFromHeaders = host && (proto ? `${proto}://${host}` : `https://${host}`)
      const fallbackProd = 'https://kreditheld24.de'
      const fallbackDev = 'http://localhost:3000'
      const baseUrl = envBaseUrl || originFromHeaders || request.nextUrl?.origin || (process.env.NODE_ENV === 'production' ? fallbackProd : fallbackDev)

      return NextResponse.redirect(new URL('/kreditanfrage?error=token-expired', baseUrl))
    }

    // Bereits verifiziert?
    if (verificationData.verified) {
      const envBaseUrl = process.env.VERIFICATION_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
      const xfProto = request.headers.get('x-forwarded-proto') || undefined
      const xfHost = request.headers.get('x-forwarded-host') || undefined
      const host = xfHost || request.headers.get('host') || undefined
      const proto = xfProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : undefined) || undefined
      const originFromHeaders = host && (proto ? `${proto}://${host}` : `https://${host}`)
      const fallbackProd = 'https://kreditheld24.de'
      const fallbackDev = 'http://localhost:3000'
      const baseUrl = envBaseUrl || originFromHeaders || request.nextUrl?.origin || (process.env.NODE_ENV === 'production' ? fallbackProd : fallbackDev)

      return NextResponse.redirect(new URL('/kreditanfrage?success=already-verified', baseUrl))
    }

    // E-Mail als verifiziert markieren
    await markTokenAsVerified(token)

    // Erfolgreiche Verifizierung
    const envBaseUrl = process.env.VERIFICATION_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
    const xfProto = request.headers.get('x-forwarded-proto') || undefined
    const xfHost = request.headers.get('x-forwarded-host') || undefined
    const host = xfHost || request.headers.get('host') || undefined
    const proto = xfProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : undefined) || undefined
    const originFromHeaders = host && (proto ? `${proto}://${host}` : `https://${host}`)
    const fallbackProd = 'https://kreditheld24.de'
    const fallbackDev = 'http://localhost:3000'
    const baseUrl = envBaseUrl || originFromHeaders || request.nextUrl?.origin || (process.env.NODE_ENV === 'production' ? fallbackProd : fallbackDev)

    return NextResponse.redirect(new URL('/kreditanfrage?success=email-verified', baseUrl))
    
  } catch (error) {
    console.error('Fehler bei E-Mail-Verifizierung:', error)
    const envBaseUrl = process.env.VERIFICATION_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
    const xfProto = request.headers.get('x-forwarded-proto') || undefined
    const xfHost = request.headers.get('x-forwarded-host') || undefined
    const host = xfHost || request.headers.get('host') || undefined
    const proto = xfProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : undefined) || undefined
    const originFromHeaders = host && (proto ? `${proto}://${host}` : `https://${host}`)
    const fallbackProd = 'https://kreditheld24.de'
    const fallbackDev = 'http://localhost:3000'
    const baseUrl = envBaseUrl || originFromHeaders || request.nextUrl?.origin || (process.env.NODE_ENV === 'production' ? fallbackProd : fallbackDev)

    return NextResponse.redirect(new URL('/kreditanfrage?error=verification-failed', baseUrl))
  }
}