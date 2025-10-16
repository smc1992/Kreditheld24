import Redis from 'ioredis'

let client: Redis | null = null

export function getRedisClient(): Redis | null {
  if (client) return client

  const url = process.env.REDIS_URL
  if (!url) return null

  try {
    client = new Redis(url, {
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 2,
      lazyConnect: true,
    })
    return client
  } catch (err) {
    console.error('Redis initialisation failed:', err)
    client = null
    return null
  }
}

export async function ensureRedisConnected(): Promise<Redis | null> {
  const c = getRedisClient()
  if (!c) return null
  try {
    // ioredis connects automatically unless lazyConnect=true, then connect() is needed
    // We call connect() but ignore error to allow FS fallback
    // @ts-expect-error connect exists on ioredis client
    if (typeof c.connect === 'function') {
      try {
        // status 'ready' means already connected
        const status = (c as any).status
        if (status !== 'ready') await c.connect()
      } catch (e) {
        console.error('Redis connect failed:', e)
        return null
      }
    }
    return c
  } catch (e) {
    console.error('Redis ensure connection error:', e)
    return null
  }
}