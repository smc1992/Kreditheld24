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
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  source: 'baufinanzierung' | 'privatkredit'
}

// Fetch Baufinanzierung processes
export async function fetchBaufinanzierungProcesses(datenKontext: 'TEST_MODUS' | 'ECHT_GESCHAEFT' = 'ECHT_GESCHAEFT'): Promise<EuropaceProcess[]> {
  const scope = 'baufinanzierung:vorgang:lesen'
  const token = await getEuropaceAccessTokenWithScope(scope)

  // Endpoint from Europace Postman Collection
  // HAL-based API with pagination
  const endpoint = datenKontext === 'TEST_MODUS' 
    ? 'https://api.europace2.de/v2/vorgaenge?datenKontext=TEST_MODUS'
    : 'https://api.europace2.de/v2/vorgaenge'

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Baufinanzierung Vorgänge abrufen fehlgeschlagen: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json()
  // HAL response structure: { _embedded: { vorgaenge: [...] }, _links: {...} }
  return data?._embedded?.vorgaenge || []
}

// Fetch Privatkredit processes
export async function fetchPrivatkreditProcesses(): Promise<EuropaceProcess[]> {
  const scope = 'privatkredit:vorgang:lesen'
  const token = await getEuropaceAccessTokenWithScope(scope)

  // Endpoint from Europace Postman Collection (GraphQL API)
  const endpoint = 'https://www.europace2.de/kreditsmart/kex/vorgaenge'

  // GraphQL query to fetch all processes
  // Note: This is a simplified query - may need adjustment based on actual schema
  const graphqlQuery = {
    query: `
      query {
        vorgaenge {
          vorgangsnummer
          antragsteller1 {
            personendaten {
              vorname
              nachname
              email
              telefonnummer
            }
            wohnsituation {
              anschrift {
                strasse
                hausnummer
                plz
                ort
              }
            }
          }
          antragsteller2 {
            personendaten {
              vorname
              nachname
              email
              telefonnummer
            }
          }
        }
      }
    `
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphqlQuery),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Privatkredit Vorgänge abrufen fehlgeschlagen: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json()
  // GraphQL response structure: { data: { vorgaenge: [...] } }
  return data?.data?.vorgaenge || []
}

// Extract customer data from Europace process
export function extractCustomerFromProcess(process: EuropaceProcess, source: 'baufinanzierung' | 'privatkredit'): EuropaceCustomerData | null {
  try {
    // Try to extract customer data from process structure
    const antragsteller = process?.kundenangaben?.haushalte?.[0]?.antragsteller?.[0]
    if (!antragsteller) return null

    const personendaten = antragsteller.personendaten
    const anschrift = antragsteller.wohnsituation?.anschrift

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