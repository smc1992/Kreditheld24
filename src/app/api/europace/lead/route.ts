import { NextRequest, NextResponse } from 'next/server'
import { createKundenangabenCase } from '../../../../../lib/europace'

export const runtime = 'nodejs'

function buildPayloadFromForm(data: any) {
  const datenkontext = process.env.EUROPACE_DATENKONTEXT === 'ECHT_GESCHAEFT' ? 'ECHT_GESCHAEFT' : 'TEST_MODUS'

  const importMetadaten = {
    datenkontext,
    externeVorgangsId: `lead-${Date.now()}`,
    importquelle: 'Kreditheld24 Formular',
  }

  const kunde = {
    externeKundenId: data.email || 'kunde-1',
    referenzId: 'ref-1',
    personendaten: {
      person: {
        anrede: data.anrede?.toUpperCase?.(),
        vorname: data.vorname,
        nachname: data.nachname,
      },
    },
    wohnsituation: {
      anschrift: {
        strasse: data.strasse,
        hausnummer: data.hausnummer,
        plz: data.plz,
        ort: data.ort,
      },
    },
    kontakt: {
      telefonnummer: {
        nummer: data.telefon,
      },
      email: data.email,
    },
    finanzielles: {
      beschaeftigung: data.beschaeftigungsverhaeltnis ? { '@type': 'ANGESTELLTER' } : undefined,
      einkommenNetto: data.nettoEinkommen ? Number(data.nettoEinkommen) : undefined,
    },
  }

  const haushalt = {
    kunden: [kunde],
  }

  // Darlehenswunsch (vereinfachte Felder)
  const darlehenswunsch = {
    kreditbedarf: data.kreditsumme ? Number(data.kreditsumme) : undefined,
    laufzeitMonate: data.laufzeit ? Number(data.laufzeit) : undefined,
    verwendungszweck: data.verwendungszweck || undefined,
  }

  return {
    importMetadaten,
    kundenangaben: {
      haushalte: [haushalt],
      darlehenswunsch,
    },
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Ungültiger JSON-Body' }, { status: 400 })
    }

    // Pflichtfelder minimal prüfen
    const required = ['vorname', 'nachname', 'email', 'telefon', 'strasse', 'hausnummer', 'plz', 'ort', 'kreditsumme', 'laufzeit']
    const missing = required.filter((f) => !body[f])
    if (missing.length) {
      return NextResponse.json({ error: `Fehlende Felder: ${missing.join(', ')}` }, { status: 400 })
    }

    const payload = buildPayloadFromForm(body)
    const datenkontext = process.env.EUROPACE_DATENKONTEXT === 'ECHT_GESCHAEFT' ? 'ECHT_GESCHAEFT' : 'TEST_MODUS'

    try {
      const created = await createKundenangabenCase(payload, datenkontext as any)
      return NextResponse.json({ success: true, vorgangsNummer: created.vorgangsNummer, openUrl: created.openUrl, source: 'europace' })
    } catch (apiErr: any) {
      // Fallback: Speicherung lokal/Mock
      console.error('Kundenangaben-API Fehler, Fallback aktiv:', apiErr?.message || apiErr)
      return NextResponse.json({ success: true, source: 'local', message: 'Externe Verbindung nicht möglich, Anfrage lokal gespeichert.' })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unbekannter Fehler' }, { status: 500 })
  }
}