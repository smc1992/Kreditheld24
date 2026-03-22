
// Europace API Integration - LIVE Implementation
// Handles OAuth, process fetching, and customer data extraction

export interface EuropaceCustomerData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    salutation?: string;
    birthDate?: string;
    maritalStatus?: string;
    nationality?: string;
    occupation?: string;
    monthlyIncome?: number;
    employer?: string;
    employedSince?: string;
    vorgangsNummer: string;
    vorgangStatus?: string;
    datenKontext?: string;
    erstelltAm?: string;
}

// Environment variables
const CLIENT_ID = process.env.EUROPACE_CLIENT_ID;
const CLIENT_SECRET = process.env.EUROPACE_CLIENT_SECRET;
const OAUTH_URL = process.env.EUROPACE_OAUTH_URL || 'https://api.europace.de/auth/token';
const API_BASE = 'https://api.europace.de';

// Token cache to avoid requesting a new token for every call
let tokenCache: { token: string; expiresAt: number } | null = null;

/**
 * Get OAuth2 access token (Client Credentials flow)
 * Caches the token to avoid unnecessary requests
 */
async function getAccessToken(): Promise<string> {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('EUROPACE_CLIENT_ID or EUROPACE_CLIENT_SECRET not set');
    }

    // Return cached token if still valid (with 60s buffer)
    if (tokenCache && Date.now() < tokenCache.expiresAt - 60000) {
        return tokenCache.token;
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const response = await fetch(OAUTH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        body: params.toString()
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Europace auth failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    tokenCache = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in * 1000)
    };

    return data.access_token;
}

/**
 * Test the Europace connection
 */
export async function testConnection(): Promise<{ success: boolean; scopes: string; vorgaengeCount: number }> {
    const token = await getAccessToken();

    const res = await fetch(`${API_BASE}/v2/vorgaenge?limit=1`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    });

    if (!res.ok) {
        throw new Error(`Connection test failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Decode JWT to get scopes
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    return {
        success: true,
        scopes: payload.scope || '',
        vorgaengeCount: data.vorgaenge?.length || 0
    };
}

/**
 * Fetch all Baufinanzierung processes (paginated)
 */
export async function fetchBaufinanzierungProcesses(
    mode: 'TEST_MODUS' | 'ECHT_GESCHAEFT',
    limit: number = 100
): Promise<any[]> {
    const token = await getAccessToken();
    const allProcesses: any[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
        const url = `${API_BASE}/v2/vorgaenge?datenKontext=${mode}&limit=${Math.min(limit, 100)}&page=${page}`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        if (!response.ok) {
            if (response.status === 403) {
                console.warn(`[Europace] No access to ${mode} processes`);
                return [];
            }
            throw new Error(`Failed to fetch processes: ${response.status}`);
        }

        const data = await response.json();
        const vorgaenge = data.vorgaenge || [];
        allProcesses.push(...vorgaenge);

        // Check if there are more pages
        hasMore = !!data._links?.next && vorgaenge.length > 0;
        page++;

        // Safety limit
        if (allProcesses.length >= limit) {
            hasMore = false;
        }
    }

    console.log(`[Europace] Fetched ${allProcesses.length} ${mode} processes`);
    return allProcesses;
}

/**
 * Fetch details for a single Baufinanzierung process
 */
export async function fetchBaufinanzierungProcessDetails(vorgangsNummer: string): Promise<any> {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE}/v2/vorgaenge/${vorgangsNummer}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch process ${vorgangsNummer}: ${response.status}`);
    }

    return await response.json();
}

/**
 * Fetch Privatkredit (KEX) processes
 * Note: Currently the KEX list endpoint is not accessible with these credentials
 */
export async function fetchPrivatkreditProcesses(): Promise<any[]> {
    // KEX endpoint not available with current scopes/credentials
    console.log('[Europace] Privatkredit API not accessible with current credentials');
    return [];
}

/**
 * Map Europace Beschäftigungsart to German label
 */
function mapBeschaeftigungsart(art: string | undefined): string {
    const mapping: Record<string, string> = {
        'ANGESTELLTER': 'Angestellte/r',
        'ARBEITER': 'Arbeiter/in',
        'SELBSTAENDIGER': 'Selbständig',
        'FREIBERUFLER': 'Freiberufler/in',
        'BEAMTER': 'Beamte/r',
        'RENTNER': 'Rentner/in',
        'HAUSFRAU': 'Hausfrau/-mann',
        'AZUBI': 'Auszubildende/r',
        'STUDENT': 'Student/in',
        'GESCHAEFTSFUEHRER': 'Geschäftsführer/in',
    };
    return mapping[art || ''] || art || '';
}

/**
 * Map Europace Familienstand to German label
 */
function mapFamilienstand(status: string | undefined): string {
    const mapping: Record<string, string> = {
        'LEDIG': 'Ledig',
        'VERHEIRATET': 'Verheiratet',
        'GESCHIEDEN': 'Geschieden',
        'VERWITWET': 'Verwitwet',
        'GETRENNT_LEBEND': 'Getrennt lebend',
        'EHEAEHNLICHE_GEMEINSCHAFT': 'Eheähnliche Gemeinschaft',
        'EINGETRAGENE_LEBENSPARTNERSCHAFT': 'Eingetragene Lebenspartnerschaft',
    };
    return mapping[status || ''] || status || '';
}

/**
 * Extract all customer data from a Europace process
 * Returns one entry per antragsteller (applicant)
 */
export function extractCustomerFromProcess(
    process: any,
    type: 'baufinanzierung' | 'privatkredit'
): EuropaceCustomerData[] {
    if (!process) return [];

    const customers: EuropaceCustomerData[] = [];

    if (type === 'baufinanzierung') {
        const haushalte = process.haushalte || [];

        for (const haushalt of haushalte) {
            const antragsteller = haushalt.antragsteller || [];

            for (const person of antragsteller) {
                const addr = person.anschrift || {};
                const job = person.beschaeftigung || {};

                const fullAddress = [
                    addr.strasse ? `${addr.strasse} ${addr.hausnummer || ''}`.trim() : '',
                    addr.postleitzahl && addr.ort ? `${addr.postleitzahl} ${addr.ort}` : ''
                ].filter(Boolean).join(', ');

                customers.push({
                    firstName: person.vorname || '',
                    lastName: person.nachname || '',
                    email: person.email || undefined,
                    phone: person.telefonMobil || person.telefonPrivat || person.telefonGeschaeftlich || undefined,
                    salutation: person.anrede || undefined,
                    birthDate: person.geburtsdatum || undefined,
                    maritalStatus: mapFamilienstand(person.familienstand),
                    nationality: person.staatsangehoerigkeit?.name || undefined,
                    occupation: mapBeschaeftigungsart(job.art),
                    monthlyIncome: job.einkommenNettoMonatlich || undefined,
                    employer: job.arbeitgeber?.name || job.arbeitgeber || undefined,
                    employedSince: job.beschaeftigtSeit || undefined,
                    address: fullAddress || undefined,
                    street: addr.strasse ? `${addr.strasse} ${addr.hausnummer || ''}`.trim() : undefined,
                    zipCode: addr.postleitzahl || undefined,
                    city: addr.ort || undefined,
                    vorgangsNummer: process.vorgangsNummer,
                    vorgangStatus: process.status,
                    datenKontext: process.datenKontext,
                    erstelltAm: process.erstelltAm,
                });
            }
        }
    }

    return customers;
}

/**
 * Fetch all processes and extract all customer data
 * This is the main sync function
 */
export async function fetchAllCustomers(limit: number = 200): Promise<EuropaceCustomerData[]> {
    const allCustomers: EuropaceCustomerData[] = [];

    // Fetch Echt-Geschäft processes
    const echtProcesses = await fetchBaufinanzierungProcesses('ECHT_GESCHAEFT', limit);

    // Fetch details for each process and extract customers
    for (const processMeta of echtProcesses) {
        try {
            const fullProcess = await fetchBaufinanzierungProcessDetails(processMeta.vorgangsNummer);
            const customers = extractCustomerFromProcess(fullProcess, 'baufinanzierung');
            allCustomers.push(...customers);
        } catch (err) {
            console.error(`[Europace] Error fetching details for ${processMeta.vorgangsNummer}:`, err);
        }
    }

    console.log(`[Europace] Total customers extracted: ${allCustomers.length} from ${echtProcesses.length} processes`);
    return allCustomers;
}

/**
 * Create a Privatkredit case (Kundenangaben) in Europace
 */
export async function createKundenangabenCase(customerData: {
    vorname: string;
    nachname: string;
    email?: string;
    telefon?: string;
    strasse?: string;
    hausnummer?: string;
    plz?: string;
    ort?: string;
    geburtsdatum?: string;
    datenkontext?: 'TEST_MODUS' | 'ECHT_GESCHAEFT';
}) {
    const token = await getAccessToken();
    const partnerId = process.env.EUROPACE_PERSON_ID || process.env.EUROPACE_ORG_ID;

    const payload = {
        kundenangaben: {
            haushalte: [{
                antragsteller: [{
                    personendaten: {
                        vorname: customerData.vorname,
                        nachname: customerData.nachname,
                        email: customerData.email,
                        geburtsdatum: customerData.geburtsdatum,
                        telefonNummer: customerData.telefon,
                    },
                    wpiAnschrift: customerData.strasse ? {
                        strasse: customerData.strasse,
                        hausnummer: customerData.hausnummer || '',
                        plz: customerData.plz || '',
                        ort: customerData.ort || '',
                    } : undefined,
                }],
            }],
        },
        kundenbetreuer: { partnerId },
        bepiDatenkontext: customerData.datenkontext || 'ECHT_GESCHAEFT',
    };

    const response = await fetch(`${API_BASE}/kundenangaben/vorgaenge`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create Europace case: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return {
        vorgangsNummer: result.vorgangsNummer,
        openUrl: result._links?.selbstauskunft?.href || result._links?.self?.href || null,
    };
}
