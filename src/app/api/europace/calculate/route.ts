import { NextResponse } from 'next/server'
import { calculateWithEuropace } from '../../../../../lib/europace'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const amount = Number(body?.amount)
    const term = Number(body?.term)
    const purpose = typeof body?.purpose === 'string' ? body.purpose : undefined

    if (!Number.isFinite(amount) || !Number.isFinite(term)) {
      return NextResponse.json({ error: 'Ungültige Eingaben' }, { status: 400 })
    }

    const result = await calculateWithEuropace({ amount, termMonths: term, purpose })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: (e as Error)?.message || 'Unbekannter Fehler' }, { status: 500 })
  }
}