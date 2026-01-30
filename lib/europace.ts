export type EuropaceTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
  scope?: string
}

const DEFAULT_OAUTH_URL = 'https://oauth-api.europace.de/oauth/token'

export async function getEuropaceAccessToken(): Promise<string> {
  const clientId = process.env.EUROPACE_CLIENT_ID
  const clientSecret = process.env.EUROPACE_CLIENT_SECRET
  const oauthUrl = process.env.EUROPACE_OAUTH_URL || DEFAULT_OAUTH_URL

  if (!clientId || !clientSecret) {
    throw new Error('Fehlende Umgebungsvariablen: EUROPACE_CLIENT_ID und EUROPACE_CLIENT_SECRET')
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  })

  const res = await fetch(oauthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Europace OAuth Fehler: ${res.status} ${res.statusText} ${text}`)
  }

  const data = (await res.json()) as EuropaceTokenResponse
  if (!data.access_token) {
    throw new Error('Europace OAuth: Kein access_token im Antwortkörper erhalten')
  }
  return data.access_token
}

// Neuen Helper: Token mit Scope anfordern
export async function getEuropaceAccessTokenWithScope(scope: string): Promise<string> {
  const clientId = process.env.EUROPACE_CLIENT_ID
  const clientSecret = process.env.EUROPACE_CLIENT_SECRET
  const oauthUrl = process.env.EUROPACE_OAUTH_URL || DEFAULT_OAUTH_URL

  if (!clientId || !clientSecret) {
    throw new Error('Fehlende Umgebungsvariablen: EUROPACE_CLIENT_ID und EUROPACE_CLIENT_SECRET')
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope,
  })

  const res = await fetch(oauthUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Europace OAuth Fehler: ${res.status} ${res.statusText} ${text}`)
  }
  const data = (await res.json()) as EuropaceTokenResponse
  if (!data.access_token) {
    throw new Error('Europace OAuth: Kein access_token im Antwortkörper erhalten')
  }
  return data.access_token
}

export type EuropaceCalculationRequest = {
  amount: number
  termMonths: number
  purpose?: string
}

export type EuropaceCalculationResponse = {
  monthlyPayment: string
  totalCost?: string
  source: 'europace' | 'local'
}

// Platzhalter: Hier würde ein echter Europace-API-Call erfolgen.
// Die genauen Endpunkte hängen vom Produkt (z.B. KreditSmart/Baufi-Passt) ab.
// Siehe: https://docs.api.europace.de/
export async function calculateWithEuropace(req: EuropaceCalculationRequest): Promise<EuropaceCalculationResponse> {
  try {
    const token = await getEuropaceAccessToken()
    // TODO: Ersetzen Sie die folgende Logik durch den tatsächlichen Europace-Endpunkt.
    // Beispielhaft demonstrieren wir die Integration, indem wir einen lokalen Fallback rechnen
    // und markieren, dass die Verbindung (Tokenbezug) erfolgreich war.

    const interestRate = 0.0399 // Dummy bis echte Kondition ermittelt wird
    const r = interestRate / 12
    const n = req.termMonths
    const A = req.amount
    const m = A * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

    return {
      monthlyPayment: m.toFixed(2),
      totalCost: (m * n).toFixed(2),
      source: 'europace',
    }
  } catch (e) {
    // Fallback auf lokale Berechnung, falls Tokenabruf fehlschlägt
    const interestRate = 0.0399
    const r = interestRate / 12
    const n = req.termMonths
    const A = req.amount
    const m = A * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

    return {
      monthlyPayment: m.toFixed(2),
      totalCost: (m * n).toFixed(2),
      source: 'local',
    }
  }
}

// Kundenangaben-Vorgang anlegen (BaufiSmart Kundenangaben-API)
export type CreateKundenangabenResponse = {
  vorgangsNummer: string
  openUrl: string
}

export async function createKundenangabenCase(payload: any, datenkontext: 'TEST_MODUS' | 'ECHT_GESCHAEFT' = 'TEST_MODUS'): Promise<CreateKundenangabenResponse> {
  // Scopes laut Doku: baufinanzierung:vorgang:schreiben und baufinanzierung:echtgeschaeft (für Echtbetrieb)
  const scope = datenkontext === 'ECHT_GESCHAEFT'
    ? 'baufinanzierung:vorgang:schreiben baufinanzierung:echtgeschaeft'
    : 'baufinanzierung:vorgang:schreiben'

  const token = await getEuropaceAccessTokenWithScope(scope)

  // Endpoint laut Doku: POST https://baufinanzierung.api.europace.de/kundenangaben
  const res = await fetch('https://baufinanzierung.api.europace.de/kundenangaben', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Kundenangaben-API Fehler: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json()
  const vorgangsNummer: string = data?.vorgangsNummer || data?.fallNummer || data?.vorgangsnummer
  if (!vorgangsNummer) {
    throw new Error('Kundenangaben-API: Keine Vorgangsnummer in der Antwort gefunden')
  }
  return {
    vorgangsNummer,
    openUrl: `https://www.europace2.de/vorgang/oeffne/${vorgangsNummer}`,
  }
}

// Types for Europace processes
export type EuropaceProcess = {
  vorgangsNummer?: string
  // V3 Structure
  haushalte?: Array<{
    antragsteller?: Array<{
      anrede?: string
      vorname?: string
      nachname?: string
      email?: string
      telefonnummer?: string
      anschrift?: {
        strasse?: string
        hausnummer?: string
        plz?: string
        ort?: string
      }
      // Legacy/Alternative structure support
      personendaten?: {
        anrede?: string
        vorname?: string
        nachname?: string
        email?: string
        telefonnummer?: string
      }
      wohnsituation?: {
        anschrift?: {
          strasse?: string
          hausnummer?: string
          plz?: string
          ort?: string
        }
      }
    }>
  }>
  // Legacy Structure
  kundenangaben?: {
    haushalte?: Array<{
      antragsteller?: Array<{
        personendaten?: {
          anrede?: string
          vorname?: string
          nachname?: string
          email?: string
          telefonnummer?: string
        }
        wohnsituation?: {
          anschrift?: {
            strasse?: string
            hausnummer?: string
            plz?: string
            ort?: string
          }
        }
      }>
    }>
  }
  [key: string]: any
}

export type EuropaceCustomerData = {
  europaceId?: string
  vorgangsNummer?: string
  salutation?: string // HERR, FRAU
  title?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  birthDate?: Date
  birthPlace?: string
  maritalStatus?: string
  childrenCount?: number
  nationality?: string
  source: 'baufinanzierung' | 'privatkredit'
}

function mapMaritalStatus(status?: string): string {
  if (!status) return 'LEDIG';
  const s = status.toUpperCase();
  if (s.includes('VERHEIRATET')) return 'VERHEIRATET';
  if (s.includes('GESCHIEDEN')) return 'GESCHIEDEN';
  if (s.includes('VERWITWET')) return 'VERWITWET';
  if (s.includes('GETRENNT')) return 'GETRENNT_LEBEND';
  if (s.includes('PARTNER')) return 'EINGETRAGENE_LEBENSPARTNERSCHAFT';
  return 'LEDIG';
}

function mapSalutation(salutation?: string): string {
  if (!salutation) return 'HERR';
  const s = salutation.toUpperCase();
  if (s.includes('FRAU')) return 'FRAU';
  return 'HERR';
}

// Create a new Privatkredit case
export async function createPrivatkreditCase(customerData: EuropaceCustomerData, datenKontext: 'TEST_MODUS' | 'ECHT_GESCHAEFT' = 'TEST_MODUS'): Promise<string> {
  const scope = 'privatkredit:vorgang:schreiben'
  const token = await getEuropaceAccessTokenWithScope(scope)

  // Endpoint URLs based on environment
  const baseUrl = 'https://kex-vorgang-import.ratenkredit.api.europace.de/vorgang'
  const endpoint = datenKontext === 'ECHT_GESCHAEFT'
    ? `${baseUrl}?environment=PRODUCTION`
    : baseUrl

  // Map CRM customer data to Europace Privatkredit JSON structure
  const payload = {
    antragsteller1: {
      personendaten: {
        anrede: mapSalutation(customerData.salutation),
        titel: customerData.title || undefined,
        vorname: customerData.firstName,
        nachname: customerData.lastName,
        email: customerData.email,
        telefonPrivat: customerData.phone,
        geburtsdatum: customerData.birthDate ? customerData.birthDate.toISOString().split('T')[0] : undefined,
        geburtsort: customerData.birthPlace,
        famillienstand: mapMaritalStatus(customerData.maritalStatus),
        staatsangehoerigkeit: customerData.nationality || 'DEUTSCHLAND',
        anzahlKinderImHaushalt: customerData.childrenCount || 0,
      },
      wohnsituation: {
        anschrift: {
          strasse: 'Musterstr.',
          hausnummer: '1',
          plz: '12345',
          ort: 'Berlin',
          land: 'DE',
          wohnhaftSeit: new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0] // > 3 years to avoid prev address req
        },
        wohnart: "ZUR_MIETE",
        anzahlPersonenImHaushalt: 1,
        anzahlPkw: 0
      }
    }
  }

  // Refine payload mapping
  if (customerData.address) {
    const parts = customerData.address.match(/^(.+)\s+(\d+[a-z]?)$/i)
    const strasse = parts ? parts[1] : customerData.address
    const hausnummer = parts ? parts[2] : '1'

    // @ts-ignore
    payload.antragsteller1.wohnsituation.anschrift.strasse = strasse
    // @ts-ignore
    payload.antragsteller1.wohnsituation.anschrift.hausnummer = hausnummer
  } else {
    // @ts-ignore
    payload.antragsteller1.wohnsituation.anschrift.strasse = 'Musterstr.'
    // @ts-ignore
    payload.antragsteller1.wohnsituation.anschrift.hausnummer = '1'
  }

  // Add mandatory kundenbetreuer
  const partnerId = process.env.EUROPACE_PARTNER_ID || process.env.EUROPACE_PERSON_ID || 'TEST'
  // @ts-ignore
  payload.kundenbetreuer = {
    partnerId: partnerId
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Privatkredit Vorgang erstellen fehlgeschlagen: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json()
  // Response format: { "vorgangsnummer": "..." }
  return data.vorgangsnummer
}

// Extract customer data from Europace process
export function extractCustomerFromProcess(process: EuropaceProcess, source: 'baufinanzierung' | 'privatkredit'): EuropaceCustomerData | null {
  try {
    // Determine structure based on source and availability
    let antragsteller: any = null

    if (source === 'baufinanzierung') {
      // Check V3 structure (root haushalte)
      if (process.haushalte?.[0]?.antragsteller?.[0]) {
        antragsteller = process.haushalte[0].antragsteller[0]
      }
      // Check Legacy structure (kundenangaben.haushalte)
      else if (process.kundenangaben?.haushalte?.[0]?.antragsteller?.[0]) {
        antragsteller = process.kundenangaben.haushalte[0].antragsteller[0]
      }
    } else {
      // Privatkredit usually has flat structure from GraphQL
      antragsteller = process.antragsteller1
    }

    if (!antragsteller) return null

    // Extract fields (handle both direct properties and nested personendaten)
    const personendaten = antragsteller.personendaten || antragsteller
    const anschrift = antragsteller.wohnsituation?.anschrift || antragsteller.anschrift

    if (!personendaten?.email) return null // Email is required for duplicate detection

    // Build address string
    let address = ''
    if (anschrift) {
      const parts = [
        anschrift.strasse && anschrift.hausnummer ? `${anschrift.strasse} ${anschrift.hausnummer}` : '',
        anschrift.plz && anschrift.ort ? `${anschrift.plz} ${anschrift.ort}` : ''
      ].filter(Boolean)
      address = parts.join(', ')
    }

    return {
      vorgangsNummer: process.vorgangsNummer,
      firstName: personendaten.vorname || '',
      lastName: personendaten.nachname || '',
      email: personendaten.email,
      phone: personendaten.telefonnummer || '',
      address,
      source,
    }
  } catch (error) {
    console.error('Error extracting customer from process:', error)
    return null
  }
}