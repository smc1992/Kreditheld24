import { NextRequest, NextResponse } from 'next/server'
import { getVerificationData, markTokenAsVerified } from '../../../../lib/verification'
import { db, crmCases, crmCustomers } from '@/db'
import { eq } from 'drizzle-orm'

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

    // Token-Ablauf prüfen (konfigurierbar; Standard 7 Tage)
    const tokenAge = Date.now() - verificationData.createdAt.getTime()
    const maxAge = (parseInt(process.env.VERIFICATION_TTL_SECONDS || '', 10) || (7 * 24 * 60 * 60)) * 1000

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

      // Token für Client-Hydration mitgeben
      return NextResponse.redirect(new URL(`/kreditanfrage?success=already-verified&token=${encodeURIComponent(token)}`, baseUrl))
    }

    // E-Mail als verifiziert markieren
    await markTokenAsVerified(token)

    // Falls eine caseId im Token gespeichert ist, Status auf 'open' setzen
    const caseId = (verificationData.formData as any)?.caseId;
    if (caseId) {
      await db.update(crmCases)
        .set({ status: 'open', updatedAt: new Date() })
        .where(eq(crmCases.id, caseId));
      console.log(`Case ${caseId} set to 'open' after verification.`);
    }

    // Kundenstatus aktualisieren (Email Verified)
    await db.update(crmCustomers)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(crmCustomers.email, verificationData.email.toLowerCase()));

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

    // Token für Client-Hydration mitgeben
    return NextResponse.redirect(new URL(`/kreditanfrage?success=email-verified&token=${encodeURIComponent(token)}`, baseUrl))

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