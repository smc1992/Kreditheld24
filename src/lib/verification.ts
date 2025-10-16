import 'server-only'
import fs from 'fs'
import path from 'path'
import { ensureRedisConnected } from './redis'

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

export async function storeVerificationToken(
  token: string,
  email: string,
  formData: Record<string, unknown>
) {
  const record: VerificationRecord = {
    email,
    formData,
    createdAt: new Date().toISOString(),
    verified: false,
  }

  const redis = await ensureRedisConnected()
  if (redis) {
    try {
      // 24h TTL
      await redis.set(`verification:tokens:${token}`, JSON.stringify(record), 'EX', 24 * 60 * 60)
      return
    } catch (e) {
      console.error('Redis storeVerificationToken error:', e)
      // Fallback auf FS
    }
  }

  const store = readStore()
  store[token] = record
  writeStore(store)
}

export async function getVerificationData(token: string) {
  const redis = await ensureRedisConnected()
  if (redis) {
    try {
      const key = `verification:tokens:${token}`
      const raw = await redis.get(key)
      if (!raw) return undefined
      const rec = JSON.parse(raw) as VerificationRecord
      return {
        email: rec.email,
        formData: rec.formData,
        createdAt: new Date(rec.createdAt),
        verified: rec.verified,
      }
    } catch (e) {
      console.error('Redis getVerificationData error:', e)
    }
  }

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

export async function isTokenVerified(token: string): Promise<boolean> {
  const data = await getVerificationData(token)
  return !!data?.verified
}

export async function markTokenAsVerified(token: string): Promise<boolean> {
  const redis = await ensureRedisConnected()
  if (redis) {
    try {
      const key = `verification:tokens:${token}`
      const raw = await redis.get(key)
      if (!raw) return false
      const rec = JSON.parse(raw) as VerificationRecord
      rec.verified = true
      const ttl = await redis.ttl(key)
      if (ttl > 0) {
        await redis.set(key, JSON.stringify(rec), 'EX', ttl)
      } else {
        await redis.set(key, JSON.stringify(rec))
      }
      return true
    } catch (e) {
      console.error('Redis markTokenAsVerified error:', e)
      // Fallback auf FS
    }
  }

  const store = readStore()
  const rec = store[token]
  if (!rec) return false
  rec.verified = true
  store[token] = rec
  writeStore(store)
  return true
}