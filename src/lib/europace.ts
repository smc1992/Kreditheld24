
// Interfaces
export interface EuropaceCustomerData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string; // or structured address
    vorgangsNummer: string;
}

// Environment variables
const CLIENT_ID = process.env.EUROPACE_CLIENT_ID;
const CLIENT_SECRET = process.env.EUROPACE_CLIENT_SECRET;
const API_URL = 'https://api.europace.de'; // Base URL (adjust if specific product API is needed)
const OAUTH_URL = process.env.EUROPACE_OAUTH_URL || 'https://api.europace.de/login/oidc/token';

// Helper to get Access Token
async function getAccessToken(): Promise<string> {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.warn('EUROPACE_CLIENT_ID or EUROPACE_CLIENT_SECRET not set.');
        return '';
    }

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('scope', 'baufinanzierung:echtgeschaeft:lesen baufinanzierung:testmodus:lesen privatkredit:lesen'); // Adjust scopes as needed

        const response = await fetch(OAUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            },
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error(`Failed to get token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting Europace token:', error);
        return '';
    }
}

// Fetch Baufinanzierung Processes
export async function fetchBaufinanzierungProcesses(mode: 'TEST_MODUS' | 'ECHT_GESCHAEFT'): Promise<any[]> {
    const token = await getAccessToken();
    if (!token) return [];

    // Placeholder for actual API endpoint
    // Usually /v2/vorgaenge or specific product endpoint
    // Returning empty array to prevent runtime errors during build/test invocation if env vars missing
    try {
        // const response = await fetch(`${API_URL}/baufinanzierung/v2/vorgaenge?limit=100`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();
        // return data;
        console.log(`Fetching Europace Baufi processes [${mode}] (Mock/Stub)`);
        return [];
    } catch (error) {
        console.error('Error fetching Baufi processes:', error);
        return [];
    }
}

// Fetch Baufinanzierung Process Details
export async function fetchBaufinanzierungProcessDetails(vorgangsNummer: string): Promise<any> {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        // const response = await fetch(`${API_URL}/baufinanzierung/v2/vorgaenge/${vorgangsNummer}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // return await response.json();
        console.log(`Fetching Europace Baufi details for ${vorgangsNummer} (Mock/Stub)`);
        return { vorgangsNummer }; // Return minimal object
    } catch (error) {
        console.error(`Error fetching details for ${vorgangsNummer}:`, error);
        return null;
    }
}

// Fetch Privatkredit Processes
export async function fetchPrivatkreditProcesses(): Promise<any[]> {
    return []; // Placeholder
}

// Extract Customer Data
export function extractCustomerFromProcess(process: any, type: 'baufinanzierung' | 'privatkredit'): EuropaceCustomerData | null {
    if (!process) return null;

    // Basic extraction logic (Placeholder - adjust based on actual JSON structure)
    // Assuming 'antragsteller' array or similar logic

    if (type === 'baufinanzierung') {
        // Example structure assumption
        /*
        const antragsteller = process.antragsteller?.[0];
        if (!antragsteller) return null;
        return {
          firstName: antragsteller.vorname,
          lastName: antragsteller.nachname,
          email: antragsteller.kontaktdaten?.email,
          phone: antragsteller.kontaktdaten?.telefonPrivat,
          vorgangsNummer: process.vorgangsNummer
        };
        */
        // Minimal stub return
        if (process.vorgangsNummer) {
            return { vorgangsNummer: process.vorgangsNummer };
        }
    }

    return null;
}
