import fs from 'fs'
import path from 'path'

type VerificationRecord = {
  email: string
  formData: Record<string, unknown>
  createdAt: string // ISO string
  verified: boolean
}

// Persistenz: Verwende Projektordner 'data' statt '.next', damit der Store bei Deployments stabiler bleibt
const STORE_PATH = path.join(process.cwd(), 'data', 'verification-store.json')

function readStore(): Record<string, VerificationRecord> {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8')
    return JSON.parse(raw) as Record<string, VerificationRecord>
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, VerificationRecord>) {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true })
    fs.writeFileSync(STORE_PATH, JSON.stringify(store))
  } catch {
    // noop
  }
}

export function storeVerificationToken(
  token: string,
  email: string,
  formData: Record<string, unknown>
) {
  const store = readStore()
  store[token] = {
    email,
    formData,
    createdAt: new Date().toISOString(),
    verified: false,
  }
  writeStore(store)
}

export function getVerificationData(token: string) {
  const store = readStore()
  const rec = store[token]
  if (!rec) return undefined
  return {
    email: rec.email,
    formData: rec.formData,
    createdAt: new Date(rec.createdAt),
    verified: rec.verified,
  }
}

export function isTokenVerified(token: string): boolean {
  const store = readStore()
  return !!store[token]?.verified
}

export function markTokenAsVerified(token: string): boolean {
  const store = readStore()
  const rec = store[token]
  if (!rec) return false
  rec.verified = true
  store[token] = rec
  writeStore(store)
  return true
}