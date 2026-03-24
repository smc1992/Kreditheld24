import 'server-only'
import { db, emailVerifications } from '@/db'
import { eq, and, gt } from 'drizzle-orm'

/**
 * Verification-Token in der PostgreSQL-Datenbank speichern.
 * Tokens überleben damit Redeployments und Container-Neustarts.
 */
export async function storeVerificationToken(
  token: string,
  email: string,
  formData: Record<string, unknown>
) {
  // Falls bereits ein unverified Token für diese E-Mail existiert, löschen wir ihn
  // um Duplikate zu vermeiden
  try {
    await db.delete(emailVerifications).where(
      and(
        eq(emailVerifications.email, email.toLowerCase()),
        eq(emailVerifications.verified, false)
      )
    )
  } catch (e) {
    // Nicht kritisch – weitermachen
    console.warn('Konnte alte unverified Tokens nicht löschen:', e)
  }

  // TTL aus ENV oder Standard 7 Tage
  const ttlSeconds = parseInt(process.env.VERIFICATION_TTL_SECONDS || '', 10) || (7 * 24 * 60 * 60)
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)

  await db.insert(emailVerifications).values({
    token,
    email: email.toLowerCase(),
    formData,
    verified: false,
    expiresAt,
  })
}

/**
 * Verification-Daten anhand des Tokens abrufen.
 * Prüft automatisch ob der Token abgelaufen ist.
 */
export async function getVerificationData(token: string) {
  const record = await db.query.emailVerifications.findFirst({
    where: eq(emailVerifications.token, token),
  })

  if (!record) return undefined

  // Ablauf prüfen
  if (record.expiresAt && new Date() > record.expiresAt) {
    return undefined
  }

  return {
    email: record.email,
    formData: (record.formData || {}) as Record<string, unknown>,
    createdAt: record.createdAt,
    verified: record.verified ?? false,
    caseId: ((record.formData as any)?.caseId as string) || undefined,
  }
}

/**
 * Prüft ob ein Token als verifiziert markiert ist und noch gültig.
 */
export async function isTokenVerified(token: string): Promise<boolean> {
  const data = await getVerificationData(token)
  return !!data?.verified
}

/**
 * Token als verifiziert markieren.
 */
export async function markTokenAsVerified(token: string): Promise<boolean> {
  const record = await db.query.emailVerifications.findFirst({
    where: eq(emailVerifications.token, token),
  })

  if (!record) return false

  // Ablauf prüfen
  if (record.expiresAt && new Date() > record.expiresAt) {
    return false
  }

  await db.update(emailVerifications)
    .set({ verified: true })
    .where(eq(emailVerifications.token, token))

  return true
}

/**
 * Prüft ob eine E-Mail bereits verifiziert wurde (über irgendeinen gültigen Token).
 * Nützlich für wiederkehrende Kunden.
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  const record = await db.query.emailVerifications.findFirst({
    where: and(
      eq(emailVerifications.email, email.toLowerCase()),
      eq(emailVerifications.verified, true),
      gt(emailVerifications.expiresAt, new Date())
    ),
  })

  return !!record
}

/**
 * Den neuesten gültigen Token für eine E-Mail finden.
 * Wenn ein Kunde zurückkehrt und sein alter Token noch gültig ist,
 * muss er sich nicht erneut verifizieren.
 */
export async function findValidTokenForEmail(email: string): Promise<string | null> {
  const record = await db.query.emailVerifications.findFirst({
    where: and(
      eq(emailVerifications.email, email.toLowerCase()),
      eq(emailVerifications.verified, true),
      gt(emailVerifications.expiresAt, new Date())
    ),
  })

  return record?.token || null
}